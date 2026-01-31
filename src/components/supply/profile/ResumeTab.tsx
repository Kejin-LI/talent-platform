import React, { useState } from 'react';
import { Upload, FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import { parseResume } from '@/utils/resumeParser';
import { useResumeStore } from '@/store/resumeStore';

const ResumeTab = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // Global persisted state
  const {
    basicInfo,
    educations,
    works,
    projects,
    uploadedResume,
    setBasicInfo,
    addEducation,
    removeEducation,
    updateEducation,
    setEducations,
    addWork,
    removeWork,
    updateWork,
    setWorks,
    addProject,
    removeProject,
    updateProject,
    setProjects,
    setUploadedResume
  } = useResumeStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBasicInfo({ [name]: value });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set current uploaded resume (replaces old one)
    setUploadedResume(file);

    setIsUploading(true);
    setParseError(null);

    try {
      const parsedData = await parseResume(file);
      
      setIsUploading(false);

      // Only update fields if we found data
      if (parsedData.basicInfo) {
        setBasicInfo(parsedData.basicInfo);
      }

      // Always overwrite sections with parsed data (even if empty, as per "overwrite" requirement)
      // If the parser returns empty arrays, it means it didn't find anything, but the user requested "overwrite".
      // However, usually "overwrite" means "replace with what is found". If nothing is found, maybe we shouldn't clear?
      // "覆盖之前的简历和下方填充的内容" -> "Overwrite previous resume and the filled content below".
      // This strongly suggests replacing the content with the new parse result.
      setEducations(parsedData.educations);
      setWorks(parsedData.works);
      setProjects(parsedData.projects);

      if (
        parsedData.educations.length === 0 && 
        parsedData.works.length === 0 && 
        parsedData.projects.length === 0
      ) {
        setParseError('Could not auto-parse sections. Please fill manually.');
      }

    } catch (error) {
      console.error("Parsing error:", error);
      setIsUploading(false);
      setParseError('Failed to parse file. Please try a different file or fill manually.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      {/* Basic Information */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
          基本信息 (Basic Info)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">姓名 (Name) <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="name"
              value={basicInfo.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                !basicInfo.name ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="Your full name"
            />
            {!basicInfo.name && <p className="text-red-500 text-xs mt-1">必填 (Required)</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">电话 (Phone) <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={basicInfo.phone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                !basicInfo.phone ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="+1 (555) 000-0000"
            />
            {!basicInfo.phone && <p className="text-red-500 text-xs mt-1">必填 (Required)</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">邮箱 (Email) <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={basicInfo.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all ${
                !basicInfo.email ? 'border-red-500' : 'border-gray-200'
              }`}
              placeholder="you@example.com"
            />
            {!basicInfo.email && <p className="text-red-500 text-xs mt-1">必填 (Required)</p>}
          </div>
        </div>
      </section>

      {/* Resume Upload */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
          简历解析 (Resume Parsing) <span className="text-red-500">*</span>
        </h2>
        
        <div className={`border-2 border-dashed rounded-xl bg-purple-50 p-8 text-center transition-all hover:bg-purple-100 relative ${
          !uploadedResume ? 'border-red-500' : 'border-purple-200 hover:border-purple-300'
        }`}>
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
            disabled={isUploading}
          />
          <div className="flex flex-col items-center justify-center gap-3">
            {isUploading ? (
              <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
            ) : (
              <Upload className="w-10 h-10 text-purple-400" />
            )}
            
            <div className="space-y-1">
              {isUploading ? (
                <p className="text-purple-700 font-medium">正在智能解析简历中... (Parsing resume...)</p>
              ) : (
                <>
                  <p className="text-gray-700 font-medium">点击或拖拽上传简历 (Click or drag to upload)</p>
                  <p className="text-sm text-gray-500">支持 PDF, Word 格式，上传后自动填充下方信息</p>
                </>
              )}
              {parseError && (
                 <p className="text-orange-500 text-sm mt-2">{parseError}</p>
              )}
            </div>
          </div>
        </div>
        {!uploadedResume && <p className="text-red-500 text-xs mt-1">必填 (Required)</p>}

        {/* Uploaded Resume Display */}
        {uploadedResume && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText size={16} />
              已上传简历 (Uploaded Resume)
            </h3>
            <div className="space-y-2">
              <div key={uploadedResume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border border-gray-100">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{uploadedResume.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{uploadedResume.uploadDate}</span>
                      <span>•</span>
                      <span>{uploadedResume.size}</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    // Prevent deletion if it's the only resume, as per requirement "无法删除成功" for mandatory fields
                    // Actually, requirement says "if user completes... returns and deletes... cannot delete successfully".
                    // This implies blocking the action or showing error.
                    // Since it's mandatory (*), we should probably not allow leaving it empty.
                    // However, user might want to replace. Replace is done via upload.
                    // Delete implies "I want no resume". Which is invalid.
                    alert("简历为必填项，无法直接删除。请上传新简历以进行替换。(Resume is mandatory and cannot be deleted directly. Please upload a new one to replace.)");
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Education */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            教育经历 (Education)
          </h2>
        </div>
        
        <div className="space-y-8">
          {educations.map((edu) => (
            <div key={edu.id} className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors group">
              <button 
                onClick={() => removeEducation(edu.id)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Row 1 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">School</label>
                  <input
                    type="text"
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    placeholder="Ex: Stanford University"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    placeholder="Ex: Bachelor of Science"
                  />
                </div>

                {/* Row 2 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Start year</label>
                  <select
                    value={edu.startYear}
                    onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">End year</label>
                  <select
                    value={edu.endYear}
                    onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                  >
                    <option value="">Select year</option>
                    {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() + 10 - i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Row 3 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Major</label>
                  <input
                    type="text"
                    value={edu.major}
                    onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    placeholder="Ex: Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">GPA</label>
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                    placeholder="Ex: 3.9"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addEducation}
          className="mt-6 flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          <Plus size={20} />
          Add Education
        </button>
      </section>

      {/* Work Experience */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            工作经历 (Work Experience)
          </h2>
        </div>

        <div className="space-y-8">
          {works.map((work) => (
            <div key={work.id} className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors group">
               <button 
                 onClick={() => removeWork(work.id)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
               >
                <Trash2 size={18} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Row 1 */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Company</label>
                   <input
                     type="text"
                     value={work.company}
                     onChange={(e) => updateWork(work.id, 'company', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: Microsoft"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Role</label>
                   <input
                     type="text"
                     value={work.role}
                     onChange={(e) => updateWork(work.id, 'role', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: Software Engineer"
                   />
                 </div>

                 {/* Row 2 */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Start year</label>
                   <select
                     value={work.startYear}
                     onChange={(e) => updateWork(work.id, 'startYear', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                   >
                     <option value="">Select year</option>
                     {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">End year</label>
                   <select
                     value={work.endYear}
                     onChange={(e) => updateWork(work.id, 'endYear', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                   >
                     <option value="">Select year</option>
                     {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() + 10 - i).map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 </div>

                 {/* Row 3 */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">City</label>
                   <input
                     type="text"
                     value={work.city}
                     onChange={(e) => updateWork(work.id, 'city', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: San Francisco"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Country</label>
                   <input
                     type="text"
                     value={work.country}
                     onChange={(e) => updateWork(work.id, 'country', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: United States of America"
                   />
                 </div>

                 {/* Row 4 - Description */}
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-medium text-gray-700">Description</label>
                   <input
                     type="text"
                     value={work.description}
                     onChange={(e) => updateWork(work.id, 'description', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: At Microsoft, I collaborated with..."
                   />
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addWork}
          className="mt-6 flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          <Plus size={20} />
          Add Work Experience
        </button>
      </section>

      {/* Projects */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <div className="w-1 h-6 bg-purple-600 rounded-full"></div>
            项目经历 (Projects)
          </h2>
        </div>

        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id} className="relative p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-200 transition-colors group">
               <button 
                 onClick={() => removeProject(project.id)}
                 className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
               >
                <Trash2 size={18} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Row 1 */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Project Name</label>
                   <input
                     type="text"
                     value={project.name}
                     onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: AI Chatbot"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Role</label>
                   <input
                     type="text"
                     value={project.role}
                     onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: Lead Developer"
                   />
                 </div>

                 {/* Row 2 */}
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">Start year</label>
                   <select
                     value={project.startYear}
                     onChange={(e) => updateProject(project.id, 'startYear', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                   >
                     <option value="">Select year</option>
                     {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-gray-700">End year</label>
                   <select
                     value={project.endYear}
                     onChange={(e) => updateProject(project.id, 'endYear', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white text-gray-700"
                   >
                     <option value="">Select year</option>
                     {Array.from({ length: 60 }, (_, i) => new Date().getFullYear() + 10 - i).map(year => (
                       <option key={year} value={year}>{year}</option>
                     ))}
                   </select>
                 </div>

                 {/* Row 3 - Description */}
                 <div className="space-y-2 md:col-span-2">
                   <label className="text-sm font-medium text-gray-700">Description</label>
                   <input
                     type="text"
                     value={project.description}
                     onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white"
                     placeholder="Ex: Developed a scalable chatbot using OpenAI API..."
                   />
                 </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={addProject}
          className="mt-6 flex items-center gap-2 text-purple-600 font-medium hover:text-purple-700 transition-colors"
        >
          <Plus size={20} />
          Add Project
        </button>
      </section>

      {/* Auto-save Indicator */}
      <div className="fixed bottom-8 right-8 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 animate-fade-in">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-600 font-medium">Auto-saved</span>
      </div>
    </div>
  );
};

export default ResumeTab;
