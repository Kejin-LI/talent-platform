import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Check, 
  Circle, 
  FileText, 
  Upload, 
  Loader2, 
  Info,
  Monitor,
  Shield,
  CreditCard
} from 'lucide-react';
import { useResumeStore } from '@/store/resumeStore';
import ResumeTab from '@/components/supply/profile/ResumeTab';
import AIInterviewTab from '@/components/supply/application/AIInterviewTab';
import { mockTasks } from './TaskSquare';

const Application = () => {
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Try to get task from state, or find it by ID from mock data
  const task = location.state?.task || mockTasks.find(t => t.id === taskId);
  const [activeStep, setActiveStep] = useState(0);

  const { 
    uploadedResume,
    basicInfo,
    taskProgress,
    setTaskStepCompleted
  } = useResumeStore();

  const currentTaskId = taskId || task?.id || 'demo-task';
  
  // Default steps if not provided, matching screenshot structure mostly
  const rawSteps = task?.progress?.steps || [
    { name: 'Upload Resume', status: 'pending', icon: FileText },
    { name: 'Domain Expert Interview', status: 'pending', icon: Monitor, isCore: true },
    { name: 'Senior Domain Expert', status: 'pending', icon: CreditCard },
    { name: 'Work Authorization', status: 'completed', icon: Shield }, // Mocking completed as per screenshot example
  ];

  // Check if the task is historically fully completed (all steps passed)
  // We only apply dynamic resume logic to active/incomplete applications
  const isOriginallyCompleted = rawSteps.every((s: any) => s.status === 'completed');

  const steps = rawSteps.map((step: any, index: number) => {
    // If the task is already fully completed, don't change history
    if (isOriginallyCompleted) return step;

    // For active applications, sync Resume step with global uploadedResume state
    if (index === 0) {
       // Ensure icon is preserved or set default
       const icon = step.icon || FileText;
       if (step.status !== 'failed') {
         // Check mandatory fields: Resume + Basic Info (Name, Phone, Email)
         const isResumeStepValid = uploadedResume && basicInfo.name && basicInfo.phone && basicInfo.email;
         return {
           ...step,
           icon,
           status: isResumeStepValid ? 'completed' : 'pending'
         };
       }
    }
    
    // Check AI Interview step completion from store
    if (index === 1) {
        const isCompleted = taskProgress[currentTaskId]?.includes(1);
        if (isCompleted) {
            return { ...step, status: 'completed', icon: step.icon || Monitor };
        }
    }

    return step;
  });

  const completedStepsCount = steps.filter((s: any) => s.status === 'completed').length;
  const progressPercentage = Math.round((completedStepsCount / steps.length) * 100);

  const handleStepClick = (index: number) => {
    // If trying to access AI Interview (index 1), check if Resume (index 0) is completed
    if (index === 1) {
      const resumeStep = steps[0];
      if (resumeStep.status !== 'completed') {
        alert("请优先完成简历步骤 (Please complete the Resume step first)");
        return;
      }
    }
    setActiveStep(index);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      handleStepClick(activeStep + 1);
    }
  };

  if (!task && !taskId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Task not found</h2>
          <button 
            onClick={() => navigate('/supply/square')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Back to Square
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Go back
            </button>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
              View listing
            </button>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-6 leading-tight">
            {task?.title || 'Application'}
          </h1>

          <div className="mb-8">
            <div className="flex justify-between text-xs font-medium text-gray-500 mb-2">
              <span>{completedStepsCount} of {steps.length} steps done</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full bg-indigo-600 transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step: any, index: number) => {
              const isActive = index === activeStep;
              const Icon = step.icon || Circle;
              
              return (
                <div 
                  key={index}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${isActive ? 'text-indigo-900' : 'text-gray-600'}`}>
                        {step.name}
                      </span>
                      {step.isCore && (
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-200 text-gray-600 rounded">
                          CORE
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {step.status === 'completed' ? (
                    <div className="flex-shrink-0 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  ) : step.status === 'pending' ? (
                    <div className="flex-shrink-0 w-5 h-5 border-2 border-gray-200 rounded-full"></div>
                  ) : (
                    <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-y-auto">
        <div className="p-8 max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="flex justify-end gap-3 mb-12">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
              FAQ
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50">
              Contact support
            </button>
          </div>

          {/* Main Content */}
          {activeStep === 0 && <ResumeTab />}
          {activeStep === 1 && (
            <AIInterviewTab 
               taskTitle={task?.title} 
               onComplete={() => setTaskStepCompleted(currentTaskId, 1)} 
            />
          )}
          {activeStep > 1 && (
             <div className="text-center py-20 text-gray-500">
                Step content coming soon...
             </div>
          )}

          {/* Footer Action - Only show for Resume step to allow Next */}
          {activeStep === 0 && (
            <div className="flex justify-end pt-6 border-t border-gray-100 mt-8 pb-8">
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Application;