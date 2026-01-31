import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Education {
  id: string;
  school: string;
  degree: string;
  startYear: string;
  endYear: string;
  major: string;
  gpa: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startYear: string;
  endYear: string;
  city: string;
  country: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  startYear: string;
  endYear: string;
  description: string;
}

export interface UploadedResume {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
}

export interface BasicInfo {
  name: string;
  email: string;
  phone: string;
}

export interface InterviewRecord {
  id: string;
  role: string; // Interview Role/Job Title
  startTime: string;
  endTime: string;
  score?: number; // 0-100, optional if pending
  status: 'passed' | 'failed' | 'pending'; // Derived from score or process
  feedback: string;
  videoLink: string;
}

interface ResumeState {
  basicInfo: BasicInfo;
  educations: Education[];
  works: Experience[];
  projects: Project[];
  uploadedResume: UploadedResume | null;
  taskProgress: Record<string, number[]>; // taskId -> completed step indices
  interviewRecords: InterviewRecord[];

  // Actions
  setBasicInfo: (info: Partial<BasicInfo>) => void;
  
  setTaskStepCompleted: (taskId: string, stepIndex: number) => void;
  addInterviewRecord: (record: Omit<InterviewRecord, 'id'>) => void;
  removeInterviewRecord: (id: string) => void;
  
  addEducation: () => void;
  removeEducation: (id: string) => void;
  updateEducation: (id: string, field: keyof Education, value: string) => void;
  setEducations: (educations: Education[]) => void;
  
  addWork: () => void;
  removeWork: (id: string) => void;
  updateWork: (id: string, field: keyof Experience, value: string) => void;
  setWorks: (works: Experience[]) => void;
  
  addProject: () => void;
  removeProject: (id: string) => void;
  updateProject: (id: string, field: keyof Project, value: string) => void;
  setProjects: (projects: Project[]) => void;

  setUploadedResume: (file: File | null) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      basicInfo: { name: '', email: '', phone: '' },
      educations: [],
      works: [],
      projects: [],
      uploadedResume: null,
      taskProgress: {},
      interviewRecords: [],

      addInterviewRecord: (record) => set((state) => ({
        interviewRecords: [...(state.interviewRecords || []), {
          id: Math.random().toString(36).substr(2, 9),
          ...record
        }]
      })),

      removeInterviewRecord: (id) => set((state) => ({
        interviewRecords: state.interviewRecords.filter((r) => r.id !== id)
      })),

      setTaskStepCompleted: (taskId, stepIndex) => set((state) => {
        const currentSteps = state.taskProgress[taskId] || [];
        if (currentSteps.includes(stepIndex)) return state;
        return {
          taskProgress: {
            ...state.taskProgress,
            [taskId]: [...currentSteps, stepIndex]
          }
        };
      }),

      setBasicInfo: (info) => set((state) => ({ 
        basicInfo: { ...state.basicInfo, ...info } 
      })),

      addEducation: () => set((state) => ({
        educations: [...state.educations, {
          id: Math.random().toString(36).substr(2, 9),
          school: '',
          degree: '',
          startYear: '',
          endYear: '',
          major: '',
          gpa: ''
        }]
      })),
      removeEducation: (id) => set((state) => ({
        educations: state.educations.filter((e) => e.id !== id)
      })),
      updateEducation: (id, field, value) => set((state) => ({
        educations: state.educations.map((e) => 
          e.id === id ? { ...e, [field]: value } : e
        )
      })),
      setEducations: (educations) => set({ educations }),

      addWork: () => set((state) => ({
        works: [...state.works, {
          id: Math.random().toString(36).substr(2, 9),
          company: '',
          role: '',
          startYear: '',
          endYear: '',
          city: '',
          country: '',
          description: ''
        }]
      })),
      removeWork: (id) => set((state) => ({
        works: state.works.filter((w) => w.id !== id)
      })),
      updateWork: (id, field, value) => set((state) => ({
        works: state.works.map((w) => 
          w.id === id ? { ...w, [field]: value } : w
        )
      })),
      setWorks: (works) => set({ works }),

      addProject: () => set((state) => ({
        projects: [...state.projects, {
          id: Math.random().toString(36).substr(2, 9),
          name: '',
          role: '',
          startYear: '',
          endYear: '',
          description: ''
        }]
      })),
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter((p) => p.id !== id)
      })),
      updateProject: (id, field, value) => set((state) => ({
        projects: state.projects.map((p) => 
          p.id === id ? { ...p, [field]: value } : p
        )
      })),
      setProjects: (projects) => set({ projects }),

      setUploadedResume: (file) => set(() => ({
        uploadedResume: file ? {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          uploadDate: new Date().toLocaleDateString(),
          size: (file.size / 1024).toFixed(2) + ' KB'
        } : null
      })),
    }),
    {
      name: 'resume-storage', // unique name
    }
  )
);
