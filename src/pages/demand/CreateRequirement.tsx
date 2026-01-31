import React, { useState } from 'react';
import Layout from '@/components/Layout';
import WizardStep from '@/components/demand/WizardStep';
import { Upload, DollarSign, Calendar } from 'lucide-react';

const steps = [
  { id: '01', name: 'Basic Info', description: 'Project details and type.' },
  { id: '02', name: 'Quality & Specs', description: 'Requirements and standards.' },
  { id: '03', name: 'Budget & Timeline', description: 'Cost and schedule.' },
  { id: '04', name: 'Preview', description: 'Review and publish.' },
];

const CreateRequirement = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  return (
    <Layout role="demand">
      <div className="lg:border-b lg:border-t lg:border-gray-200 bg-white">
        <WizardStep steps={steps} currentStep={currentStep} />
      </div>

      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 divide-y divide-gray-200">
          
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Basic Information</h3>
                <p className="mt-1 text-sm text-gray-500">Define the core aspects of your data annotation project.</p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label htmlFor="project-name" className="block text-sm font-medium text-gray-700">Project Name</label>
                  <div className="mt-1">
                    <input type="text" name="project-name" id="project-name" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="e.g., Medical Entity Extraction" />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="domain" className="block text-sm font-medium text-gray-700">Domain</label>
                  <div className="mt-1">
                    <select id="domain" name="domain" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                      <option>Medical</option>
                      <option>Legal</option>
                      <option>Finance</option>
                      <option>Computer Science</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Task Type</label>
                  <div className="mt-1">
                    <select id="type" name="type" className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                      <option>Text Classification</option>
                      <option>SFT Dialogue</option>
                      <option>RLHF Ranking</option>
                      <option>Code Generation</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quality & Specifications</h3>
                <p className="mt-1 text-sm text-gray-500">Set the standards for expert qualification and deliverables.</p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Expert Qualification</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="phd" name="qualification" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="phd" className="font-medium text-gray-700">PhD Required</label>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="cert" name="qualification" type="checkbox" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="cert" className="font-medium text-gray-700">Professional Certification (e.g., Bar Exam, Medical License)</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                   <label className="block text-sm font-medium text-gray-700">Upload Sample Data</label>
                   <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV, JSON up to 10MB</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Budget & Timeline</h3>
                <p className="mt-1 text-sm text-gray-500">Define payment terms and project schedule.</p>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                   <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price per Item</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input type="text" name="price" id="price" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md p-2 border" placeholder="0.00" />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">USD</span>
                      </div>
                   </div>
                </div>

                <div className="sm:col-span-3">
                   <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">Deadline</label>
                   <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input type="date" name="deadline" id="deadline" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border" />
                   </div>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Review Project Details</h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Project Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">Medical Entity Extraction</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Domain</dt>
                    <dd className="mt-1 text-sm text-gray-900">Medical</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">Text Classification</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Budget</dt>
                    <dd className="mt-1 text-sm text-gray-900">$5.00 / item</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

        </div>
        
        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {currentStep === steps.length - 1 ? 'Publish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRequirement;
