import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Share, MoreHorizontal, Check, Circle, Clock, MapPin, Users, ChevronUp, ChevronsRight, AlertCircle } from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';

export interface Step {
  name: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface TaskProgress {
  steps: Step[];
  currentStep: number;
}

interface TaskDrawerProps {
  task: {
    title: string;
    price: string;
    hiredCount: number;
    progress?: TaskProgress;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  onClose: () => void;
}

const TaskDrawer: React.FC<TaskDrawerProps> = ({ task, onClose }) => {
  const navigate = useNavigate();
  const { uploadedResume, basicInfo, taskProgress } = useResumeStore();

  if (!task) return null;

  // Default steps if not provided
  const rawSteps: Step[] = task.progress?.steps || [
    { name: 'Resume', status: 'pending' },
    { name: 'AI Interview', status: 'pending' },
    { name: 'Technical Test', status: 'pending' },
  ];

  // Check if the task is historically fully completed (all steps passed)
  // We only apply dynamic resume logic to active/incomplete applications
  const isOriginallyCompleted = rawSteps.every(s => s.status === 'completed');

  const steps = rawSteps.map((step, index) => {
    // If the task is already fully completed, don't change history
    if (isOriginallyCompleted) return step;

    // For active applications, sync Resume step with global uploadedResume state
    if (step.name === 'Resume' && step.status !== 'failed') {
      // Check mandatory fields: Resume + Basic Info (Name, Phone, Email)
      const isResumeStepValid = uploadedResume && basicInfo.name && basicInfo.phone && basicInfo.email;
      return {
        ...step,
        status: isResumeStepValid ? 'completed' : 'pending'
      };
    }

    // Sync AI Interview status
    if (step.name === 'AI Interview' && step.status !== 'completed') {
       const taskId = task.id;
       // We map 'AI Interview' to index 1 of the application flow
       // This assumes consistency between TaskDrawer list and Application page list
       if (taskId && taskProgress?.[taskId]?.includes(1)) {
          return { ...step, status: 'completed' };
       }
    }

    return step;
  });
  
  const completedStepsCount = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = Math.round((completedStepsCount / steps.length) * 100);
  const hasFailedStep = steps.some(s => s.status === 'failed');
  const isAllCompleted = completedStepsCount === steps.length;

  const getButtonText = () => {
    if (hasFailedStep) return "Application Failed - Please browse other tasks";
    if (isAllCompleted) return "Start Work";
    if (completedStepsCount > 0) return "Continue Application";
    return "Start Application";
  };

  const getButtonStyles = () => {
    if (hasFailedStep) return "bg-red-50 text-red-600 hover:bg-red-100";
    if (isAllCompleted) return "bg-green-600 text-white hover:bg-green-700";
    return "bg-indigo-600 text-white hover:bg-indigo-700";
  };

  // Check if the task is active and resume is missing
  // "对于已经开始工作的任务" -> "Start Work" implies active/hired.
  // "如果用户在个人中心删除了简历" -> !uploadedResume
  // "需要备注下“历史简历已被删除，将影响新任务申请，请立即补充”"
  const showResumeWarning = !uploadedResume && isAllCompleted;

  const handleButtonClick = () => {
    if (getButtonText() === "Start Application" || getButtonText() === "Continue Application") {
      // Navigate to application page with task data
      navigate(`/supply/application/${task.id || 'unknown'}`, { state: { task } });
      onClose();
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col border-l border-gray-200">
      {/* Header Actions */}
      <div className="flex justify-between items-center p-4 border-b border-gray-100">
        <div className="flex space-x-2">
           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
             <ChevronsRight className="h-5 w-5" />
           </button>
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
             <Share className="h-5 w-5" />
           </button>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Title Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
          <div className="flex items-baseline justify-between">
             <div className="flex space-x-4 text-sm text-gray-500">
               <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> Hourly contract</span>
               <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> Remote</span>
               <span className="flex items-center"><Users className="h-4 w-4 mr-1" /> {task.hiredCount} hired this month</span>
             </div>
             <div className="text-right">
                <div className="text-xl font-bold text-gray-900">{task.price}</div>
             </div>
          </div>
        </div>

        {/* Application Progress */}
        <div className="mb-8">
           <div className="flex justify-between items-center mb-2">
             <h3 className="text-lg font-semibold text-gray-900">Application</h3>
             <ChevronUp className="h-5 w-5 text-gray-400" />
           </div>
           
           <div className="flex justify-between text-sm text-gray-500 mb-2">
             <span>{completedStepsCount} of {steps.length} steps completed</span>
             <span>{progressPercentage}%</span>
           </div>
           <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
             <div 
               className={`h-1.5 rounded-full ${hasFailedStep ? 'bg-red-500' : 'bg-indigo-600'}`} 
               style={{ width: `${progressPercentage}%` }}
             ></div>
           </div>

           <div className="space-y-4">
             {steps.map((step) => (
               <div key={step.name} className="flex items-start">
                 <div className="flex-shrink-0 mt-0.5">
                   {step.status === 'completed' ? (
                     <div className="h-5 w-5 rounded-full bg-indigo-600 flex items-center justify-center">
                       <Check className="h-3 w-3 text-white" />
                     </div>
                   ) : step.status === 'failed' ? (
                     <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center">
                       <X className="h-3 w-3 text-red-600" />
                     </div>
                   ) : (
                     <Circle className="h-5 w-5 text-gray-300" />
                   )}
                 </div>
                 <div className="ml-3">
                   <div className="flex items-center">
                      <p className={`text-sm font-medium ${step.status === 'failed' ? 'text-red-600' : 'text-gray-900'}`}>
                        {step.name}
                      </p>
                      {step.name === 'AI Interview' && (
                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-500 rounded border border-gray-200">CORE</span>
                      )}
                   </div>
                   <p className="text-xs text-gray-500">
                     {step.status === 'completed' ? 'Completed' : step.status === 'failed' ? 'Not passed' : 'Not started'}
                   </p>
                 </div>
               </div>
             ))}
           </div>

           {/* Resume Warning for Active Tasks */}
           {showResumeWarning && (
             <div className="mt-4 p-3 bg-orange-50 rounded-lg text-xs text-orange-700 flex items-start border border-orange-100">
               <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-orange-500" />
               <div className="flex flex-col gap-1">
                 <span className="font-medium">历史简历已被删除，将影响新任务申请，请立即补充</span>
                 <button 
                   onClick={() => {
                     // We can't easily navigate from here as we don't have a router in this component prop context
                     // But user asked to "guide user to jump". 
                     // Assuming we can trigger the profile tab selection via a global event or prop.
                     // For now, let's just add a console log or a simple alert, 
                     // OR ideally, we'd have a way to switch tabs. 
                     // Since I can't see the parent component, I'll use window.location.hash or similar if strictly needed,
                     // but a better UX is just a text guidance or a callback.
                     // Given the constraint, I will dispatch a custom event that the parent can listen to.
                     window.dispatchEvent(new CustomEvent('switch-to-profile-resume'));
                     onClose();
                   }}
                   className="text-orange-600 hover:text-orange-800 underline text-left w-fit"
                 >
                   前往上传简历 &rarr;
                 </button>
               </div>
             </div>
           )}

           <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500 flex items-start">
             <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
             <span>
               <strong>Note:</strong> Some application steps (e.g., Resume, Work Authorization) are reusable across different roles. You only need to complete them once.
             </span>
           </div>
        </div>

        {/* Description */}
        <div>
           <p className="text-gray-700 leading-relaxed mb-4">
             Kejin AI is recruiting {task.title} to work on a research project for one of the world's top AI companies. This project involves using your professional experience to design questions related to your occupation.
           </p>
           <p className="font-medium text-gray-900 mb-2">Applicants must:</p>
           <ul className="list-disc pl-5 space-y-1 text-gray-700">
             <li>Have 4+ years full-time work experience in this occupation</li>
             <li>Be able to work at least 10 hours per week</li>
             <li>Have a high level of proficiency in English</li>
           </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <button 
          onClick={handleButtonClick}
          disabled={hasFailedStep}
          className={`w-full font-bold py-3 px-4 rounded-lg transition-colors ${getButtonStyles()} ${hasFailedStep ? 'cursor-not-allowed' : ''}`}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};

export default TaskDrawer;
