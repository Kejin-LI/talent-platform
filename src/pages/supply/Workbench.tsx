import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { ArrowLeft, ArrowRight, Save, Flag, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Workbench = () => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const totalTasks = 10;
  
  const [annotation, setAnnotation] = useState('');

  const handleNext = () => {
    if (currentTaskIndex < totalTasks - 1) {
      setCurrentTaskIndex(prev => prev + 1);
      setAnnotation(''); // Reset for demo
    }
  };

  const handlePrev = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
    }
  };

  return (
    <Layout role="supply">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
             <Link to="/supply/square" className="text-gray-500 hover:text-gray-700 mr-4">
               <ArrowLeft className="h-5 w-5" />
             </Link>
             <div>
               <h2 className="text-lg font-medium text-gray-900">Medical Case Note Analysis</h2>
               <p className="text-sm text-gray-500">Task ID: #8392 • $1.50/item</p>
             </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Progress: <span className="font-medium text-indigo-600">{currentTaskIndex + 1}</span> / {totalTasks}
            </div>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${((currentTaskIndex + 1) / totalTasks) * 100}%` }}></div>
            </div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
               00:45:12
            </span>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Source Data */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-200 bg-gray-50">
            <div className="bg-white p-6 shadow rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Patient History</h3>
              <p className="text-gray-900 leading-relaxed text-lg">
                The patient is a 45-year-old male presenting with a 3-week history of persistent dry cough and low-grade fever (37.8°C). 
                He reports no shortness of breath at rest but mild dyspnea on exertion. 
                Social history is significant for 20 pack-year smoking history. 
                Initial chest X-ray reveals an opacity in the right upper lobe.
                Recommended follow-up CT scan of the chest.
              </p>
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
               <div className="flex">
                 <div className="flex-shrink-0">
                   <HelpCircle className="h-5 w-5 text-blue-400" />
                 </div>
                 <div className="ml-3">
                   <h3 className="text-sm font-medium text-blue-800">Annotation Guidelines</h3>
                   <div className="mt-2 text-sm text-blue-700">
                     <ul className="list-disc pl-5 space-y-1">
                       <li>Identify all symptoms mentioned.</li>
                       <li>Extract vital signs values.</li>
                       <li>Highlight any diagnostic procedures.</li>
                     </ul>
                   </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Panel: Annotation Tool */}
          <div className="w-1/2 p-6 overflow-y-auto bg-white">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Extraction Form</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <div className="mt-1">
                  <textarea 
                    rows={3} 
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" 
                    placeholder="e.g., Dry cough, Fever"
                    value={annotation}
                    onChange={(e) => setAnnotation(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Vital Signs</label>
                 <div className="mt-1">
                   <input type="text" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="e.g., 37.8°C" />
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-gray-700">Diagnostic Procedures</label>
                 <div className="mt-2 space-y-2">
                    <label className="inline-flex items-center">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                      <span className="ml-2 text-gray-700">X-Ray</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                      <span className="ml-2 text-gray-700">CT Scan</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out" />
                      <span className="ml-2 text-gray-700">MRI</span>
                    </label>
                 </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-200 flex justify-between">
               <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                 <Flag className="h-4 w-4 mr-2 text-red-500" />
                 Report Issue
               </button>
               
               <div className="flex space-x-3">
                 <button
                    type="button"
                    onClick={handlePrev}
                    disabled={currentTaskIndex === 0}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                 >
                   <ArrowLeft className="h-4 w-4 mr-2" />
                   Previous
                 </button>
                 <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                 >
                   <Save className="h-4 w-4 mr-2" />
                   {currentTaskIndex === totalTasks - 1 ? 'Submit Batch' : 'Save & Next'}
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Workbench;
