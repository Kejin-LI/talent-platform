import React, { useState } from 'react';
import SupplyLayout from '@/components/supply/SupplyLayout';
import TaskCard from '@/components/supply/TaskCard';
import TaskDrawer, { TaskProgress } from '@/components/supply/TaskDrawer';
import { Search, Filter, Sparkles, Zap, TrendingUp, DollarSign, Gift } from 'lucide-react';
import { clsx } from 'clsx';

interface Task {
  id: string;
  title: string;
  price: string;
  hiredCount: number;
  totalBudget: string;
  isHighlighted?: boolean;
  progress?: TaskProgress;
}

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Software Engineering, Data Science, and Systems Design',
    price: '$60 - $100 / hour',
    hiredCount: 53,
    totalBudget: '$460',
    progress: {
      steps: [
        { name: 'Resume', status: 'completed' },
        { name: 'AI Interview', status: 'completed' },
        { name: 'Technical Test', status: 'pending' },
      ],
      currentStep: 2
    }
  },
  {
    id: '2',
    title: 'Conservation Scientists',
    price: '$65 - $115 / hour',
    hiredCount: 53,
    totalBudget: '$460',
    progress: {
      steps: [
        { name: 'Resume', status: 'pending' },
        { name: 'AI Interview', status: 'pending' },
        { name: 'Technical Test', status: 'pending' },
      ],
      currentStep: 0
    }
  },
  {
    id: '3',
    title: 'Calibration Technologists and Technicians',
    price: '$60 - $105 / hour',
    hiredCount: 42,
    totalBudget: '$420',
    progress: {
      steps: [
        { name: 'Resume', status: 'completed' },
        { name: 'AI Interview', status: 'completed' },
        { name: 'Technical Test', status: 'completed' },
      ],
      currentStep: 3
    }
  },
  {
    id: '4',
    title: 'Office.js Coding Experts – Excel Add-in Development',
    price: '$80 / hour',
    hiredCount: 33,
    totalBudget: '$320',
    isHighlighted: false,
    progress: {
      steps: [
        { name: 'Resume', status: 'completed' },
        { name: 'AI Interview', status: 'failed' },
        { name: 'Technical Test', status: 'pending' },
      ],
      currentStep: 1
    }
  },
  {
    id: '5',
    title: 'Software Engineering & Systems Design Expert',
    price: '$45 - $80 / hour',
    hiredCount: 15,
    totalBudget: '$320',
  },
  {
    id: '6',
    title: 'Biology Expert (PhD, Master\'s, or Olympiad Medalist)',
    price: '$60 - $80 / hour',
    hiredCount: 10,
    totalBudget: '$320',
  },
  {
    id: '7',
    title: 'Excel Experts — Spreadsheet Manipulation for Finance',
    price: '$80 / hour',
    hiredCount: 52,
    totalBudget: '$320',
  },
  {
    id: '8',
    title: 'Generalist - English & Italian Translation',
    price: '$36.16 / hour',
    hiredCount: 10,
    totalBudget: '$145',
  },
  {
    id: '9',
    title: 'Engineering Expert (PhD, Master\'s, or Olympiad)',
    price: '$60 - $80 / hour',
    hiredCount: 4,
    totalBudget: '$320',
  },
];

const filters = [
  { name: 'Best match', icon: Sparkles, active: true },
  { name: 'Priority', icon: Zap, active: false },
  { name: 'Trending', icon: TrendingUp, active: false },
  { name: 'Most pay', icon: DollarSign, active: false },
  { name: 'Refer & earn', icon: Gift, active: false, primary: true },
];

const TaskSquare = () => {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsSidebarCollapsed(true);
  };

  const handleCloseDrawer = () => {
    setSelectedTaskId(null);
    // Optionally expand sidebar back when closing drawer
    // setIsSidebarCollapsed(false); 
  };

  const selectedTask = mockTasks.find(t => t.id === selectedTaskId);

  return (
    <SupplyLayout 
      isCollapsed={isSidebarCollapsed} 
      onToggle={setIsSidebarCollapsed}
    >
      <div className={clsx(
        "space-y-8 transition-all duration-300",
        selectedTaskId ? "mr-[600px]" : ""
      )}>
        <h1 className="text-2xl font-bold text-gray-900">Explore opportunities</h1>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center space-x-2 w-full lg:max-w-md">
             <button className="p-2 text-gray-400 hover:text-gray-600">
               <Filter className="h-5 w-5" />
             </button>
             <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="text" 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  placeholder="Type to search" 
                />
             </div>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.name}
                className={clsx(
                  "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border",
                  filter.primary 
                    ? "bg-indigo-600 text-white border-transparent hover:bg-indigo-700"
                    : filter.active
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                )}
              >
                <filter.icon className={clsx("mr-2 h-4 w-4", filter.primary ? "text-white" : "text-gray-500")} />
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className={clsx(
          "grid gap-6 transition-all duration-300",
          selectedTaskId 
            ? "grid-cols-1 xl:grid-cols-2" 
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        )}>
          {mockTasks.map((task) => (
            <div key={task.id} onClick={() => handleTaskClick(task.id)} className="cursor-pointer">
              <TaskCard 
                task={{
                  ...task,
                  isHighlighted: task.id === selectedTaskId || task.isHighlighted // Maintain original highlight or select
                }} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Task Drawer */}
      {selectedTaskId && (
        <TaskDrawer 
          task={selectedTask} 
          onClose={handleCloseDrawer} 
        />
      )}
    </SupplyLayout>
  );
};

export default TaskSquare;
