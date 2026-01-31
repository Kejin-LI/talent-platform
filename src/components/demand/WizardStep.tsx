import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface WizardStepProps {
  steps: { id: string; name: string; description: string }[];
  currentStep: number;
}

const WizardStep: React.FC<WizardStepProps> = ({ steps, currentStep }) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200">
        {steps.map((step, stepIdx) => (
          <li key={step.id} className="relative overflow-hidden lg:flex-1">
            <div
              className={clsx(
                stepIdx === 0 ? 'rounded-t-md border-b-0' : '',
                stepIdx === steps.length - 1 ? 'rounded-b-md border-t-0' : '',
                'overflow-hidden border border-gray-200 lg:border-0'
              )}
            >
              {stepIdx < currentStep ? (
                <a href="#" className="group">
                  <span
                    className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium'
                    )}
                  >
                    <span className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                        <Check className="h-6 w-6 text-white" aria-hidden="true" />
                      </span>
                    </span>
                    <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-gray-900">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </span>
                </a>
              ) : stepIdx === currentStep ? (
                <a href="#" aria-current="step">
                  <span
                    className="absolute top-0 left-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium'
                    )}
                  >
                    <span className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600">
                        <span className="text-indigo-600">{stepIdx + 1}</span>
                      </span>
                    </span>
                    <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-indigo-600">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </span>
                </a>
              ) : (
                <a href="#" className="group">
                  <span
                    className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-gray-200 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      stepIdx !== 0 ? 'lg:pl-9' : '',
                      'flex items-start px-6 py-5 text-sm font-medium'
                    )}
                  >
                    <span className="flex-shrink-0">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300">
                        <span className="text-gray-500">{stepIdx + 1}</span>
                      </span>
                    </span>
                    <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-gray-500">{step.name}</span>
                      <span className="text-sm text-gray-500">{step.description}</span>
                    </span>
                  </span>
                </a>
              )}

              {stepIdx !== 0 ? (
                <>
                  {/* Separator */}
                  <div className="absolute top-0 left-0 hidden -ml-px h-full w-0.5 bg-gray-300 lg:block" aria-hidden="true" />
                </>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default WizardStep;
