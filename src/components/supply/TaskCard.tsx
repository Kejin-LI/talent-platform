import React from 'react';
import { User, ArrowUpRight } from 'lucide-react';
import { clsx } from 'clsx';

interface TaskProps {
  task: {
    id: string;
    title: string;
    price: string;
    hiredCount: number;
    totalBudget: string;
    isHighlighted?: boolean;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskProps> = ({ task, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={clsx(
        "bg-white rounded-xl p-6 transition-all duration-200 relative flex flex-col justify-between h-full group cursor-pointer",
        (task.isHighlighted || isSelected) 
          ? "ring-2 ring-indigo-600 shadow-lg" 
          : "border border-gray-200 hover:ring-2 hover:ring-indigo-600 hover:shadow-lg hover:border-transparent"
      )}
    >
      {/* Top Left Pill - Mocked as 'Recruiting' based on screenshot */}
      <div className="absolute top-6 right-6">
        <div className={clsx(
          "transition-opacity duration-200",
          (task.isHighlighted || isSelected) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
           <span className="inline-flex items-center text-sm font-bold text-indigo-600">
             Apply <ArrowUpRight className="ml-1 h-4 w-4" />
           </span>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 pr-16 mb-2">{task.title}</h3>
        <p className="text-gray-500 text-sm line-clamp-1 mb-3">Project description placeholder text that gets truncated...</p>
        <p className="text-xl font-bold text-gray-900">{task.price}</p>
      </div>

      <div className="mt-auto relative">
        <div className="flex items-end justify-between">
          <div className="flex items-center">
             <div className="flex -space-x-2 mr-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                     <User className="h-3 w-3 text-gray-400" />
                  </div>
                ))}
             </div>
             <span className="text-xs text-gray-500">{task.hiredCount} hired</span>
          </div>
          
          <div className="flex items-center text-gray-400">
             <span className="text-xs">Progress {task.hiredCount}/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
