import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Initialize PDF.js worker
// Note: In a real Vite app, you might need to configure the worker path properly.
// For this MVP, we'll try standard import. If it fails, we might need a CDN URL.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ParsedResume {
  educations: Array<{
    id: string;
    school: string;
    degree: string;
    startYear: string;
    endYear: string;
    major: string;
    gpa: string;
  }>;
  works: Array<{
    id: string;
    company: string;
    role: string;
    startYear: string;
    endYear: string;
    city: string;
    country: string;
    description: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    role: string;
    startYear: string;
    endYear: string;
    description: string;
  }>;
  basicInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export const parseResume = async (file: File): Promise<ParsedResume> => {
  const text = await extractText(file);
  console.log('Extracted Text:', text); // For debugging
  return parseTextToData(text);
};

const extractText = async (file: File): Promise<string> => {
  if (file.type === 'application/pdf') {
    return extractPdfText(file);
  } else if (
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    file.name.endsWith('.docx')
  ) {
    return extractDocxText(file);
  }
  throw new Error('Unsupported file type');
};

const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
};

const extractDocxText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseTextToData = (text: string): ParsedResume => {
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
  
  const result: ParsedResume = {
    educations: [],
    works: [],
    projects: [],
    basicInfo: {}
  };

  // 1. Basic Info Extraction
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  
  const emailMatch = text.match(emailRegex);
  if (emailMatch) result.basicInfo!.email = emailMatch[0];

  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) result.basicInfo!.phone = phoneMatch[0];

  const possibleName = lines.find(l => 
    l.length > 3 && l.length < 30 && 
    !l.includes('@') && 
    !l.match(phoneRegex) &&
    !['resume', 'curriculum vitae', 'cv', 'education', 'experience', 'projects', 'skills'].some(k => l.toLowerCase().includes(k))
  );
  if (possibleName) result.basicInfo!.name = possibleName;


  // 2. Section Parsing
  let currentSection: 'education' | 'work' | 'projects' | null = null;
  let currentBuffer: string[] = [];

  const processBuffer = () => {
    if (currentBuffer.length === 0) return;

    const content = currentBuffer.join(' ');
    const id = Math.random().toString(36).substr(2, 9);
    
    // Improved Date Regex: matches "Jan 2020 - Present", "2019-2023", "05/2020 - 08/2020"
    const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)\s*(?:-|–|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)/i;
    
    const dateMatch = content.match(datePattern);
    const period = dateMatch ? dateMatch[0] : '';
    
    let startYear = '';
    let endYear = '';
    if (period) {
        const years = period.match(/\d{4}/g);
        if (years) {
          if (years.length >= 1) startYear = years[0];
          if (years.length >= 2) endYear = years[1];
        }
        if (period.toLowerCase().includes('present') || period.toLowerCase().includes('current')) {
           endYear = 'Present';
        }
    }

    if (currentSection === 'education') {
      const degreeMatch = content.match(/(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|MBA|Associate)/i);
      const degree = degreeMatch ? degreeMatch[0] : '';
      
      let major = '';
      if (degreeMatch) {
         // Heuristic: Major often comes after degree, e.g. "Bachelor of Science in Computer Science"
         const afterDegree = content.split(degreeMatch[0])[1];
         if (afterDegree) {
             // Split by comma or common delimiters
             major = afterDegree.split(/,| - /)[0].replace(/^ in /, '').trim();
         }
      }

      // Heuristic: School is usually the first line or detected via keywords (Univ, College, Institute)
      let school = currentBuffer[0];
      // If the first line is the date, maybe the second line is school?
      if (datePattern.test(school) && currentBuffer.length > 1) {
          school = currentBuffer[1];
      }

      const gpaMatch = content.match(/GPA[:\s]*([\d.]+)/i);
      const gpa = gpaMatch ? gpaMatch[1] : '';

      result.educations.push({
        id,
        school: school.length > 60 ? school.substring(0, 60) + '...' : school,
        degree: degree.length > 50 ? degree.substring(0, 50) + '...' : degree,
        startYear,
        endYear,
        major: major.length > 50 ? major.substring(0, 50) + '...' : major,
        gpa
      });
    } else if (currentSection === 'work') {
      // Heuristic: Role at Company or Company - Role
      let role = '';
      let company = '';
      
      const firstLine = currentBuffer[0];
      if (firstLine.includes(' at ')) {
        [role, company] = firstLine.split(' at ');
      } else if (firstLine.includes(' - ')) {
         // Could be "Company - Role" or "Role - Company"
         // Hard to guess, let's assume Company first if it looks capitalized?
         const parts = firstLine.split(' - ');
         company = parts[0];
         role = parts[1] || '';
      } else {
         // Maybe line 1 is Company, line 2 is Role?
         company = firstLine;
         if (currentBuffer.length > 1 && !datePattern.test(currentBuffer[1])) {
             role = currentBuffer[1];
         }
      }

      const description = currentBuffer.filter(l => !l.includes(period) && l !== role && l !== company).join('. ');

      result.works.push({
        id,
        role: role.length > 50 ? role.substring(0, 50) + '...' : role,
        company: company.length > 50 ? company.substring(0, 50) + '...' : company,
        startYear,
        endYear,
        city: '', 
        country: '',
        description: description.substring(0, 300)
      });
    } else if (currentSection === 'projects') {
      const name = currentBuffer[0];
      // Description is the rest
      const description = currentBuffer.slice(1).join('. ');

      result.projects.push({
        id,
        name: name.length > 50 ? name.substring(0, 50) + '...' : name,
        role: 'Contributor', 
        startYear,
        endYear,
        description: description.substring(0, 300)
      });
    }

    currentBuffer = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    
    // Detect Section Headers
    // Must be short lines, usually UPPERCASE or Title Case
    if (line.length < 40) {
        if (['education', 'academic background', 'academic history'].some(k => lower.includes(k))) {
            processBuffer();
            currentSection = 'education';
            continue;
        }
        if (['experience', 'work history', 'employment', 'work experience'].some(k => lower.includes(k))) {
            processBuffer();
            currentSection = 'work';
            continue;
        }
        if (['projects', 'personal projects', 'project experience'].some(k => lower.includes(k))) {
            processBuffer();
            currentSection = 'projects';
            continue;
        }
        if (['skills', 'languages', 'interests', 'certifications', 'summary', 'profile'].some(k => lower.includes(k))) {
            processBuffer();
            currentSection = null; 
            continue;
        }
    }

    if (currentSection) {
      // Heuristic for NEW ITEM within a section
      // 1. Line contains a date range (often starts a new job/school)
      // 2. Line starts with a bullet point? (No, bullet points usually belong to current item)
      // 3. Line is distinctively short/bold (hard to tell bold) and looks like a title?
      
      const datePattern = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)\s*(?:-|–|to)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}|\d{1,2}\/\d{4}|\d{4}|Present|Current)/i;
      
      // If we encounter a date range, it *usually* signals the start of a new block (or header of current block)
      // BUT, we need to be careful not to split if the date is just mentioned in description.
      // Usually dates in headers are near the start of the line or end of line.
      
      const hasDateRange = datePattern.test(line);
      
      // Heuristic: If we already have content in buffer, and we hit a line with a date range, 
      // AND the previous lines were likely the description of the previous item, then this is a new item.
      if (hasDateRange && currentBuffer.length > 2) { 
         // Assume >2 lines means we had a title + some description. 
         // If we hit a date now, it's likely a new job.
         processBuffer();
      } else if (hasDateRange && currentBuffer.length > 0 && currentSection === 'education') {
         // Education items are often short. If we see a date and we already have a school, maybe it's the SAME item (date line), 
         // OR a new item? 
         // Actually, typically: School \n Degree \n Date.  OR School, Date.
         // If we see a date line, it might be part of the current item.
         // But if we see ANOTHER date line later?
         // Let's rely on "School Name" detection? Hard.
         
         // Let's try this: New item if line looks like a Header? 
         // If currentBuffer has > 4 lines, force split?
      }

      // Stronger Heuristic:
      // If the line matches a specific pattern of "Title/Company" (e.g. capitalized words, no periods),
      // and is NOT a bullet point.
      const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-');
      if (!isBullet && currentBuffer.length > 3 && (hasDateRange || line.length < 50)) {
           // If buffer is "full" and we see a short line or date, likely new item
           processBuffer();
      }

      currentBuffer.push(line);
    }
  }
  processBuffer(); // Flush last item

  return result;
};
