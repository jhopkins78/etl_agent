import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const WorkflowStatusTracker: React.FC = () => {
  const { currentStep, setCurrentStep, isLoading } = useDashboard();
  
  // Workflow steps
  const steps = [
    { id: 1, name: 'Data Loading', description: 'Importing and validating data' },
    { id: 2, name: 'Exploratory Data Analysis', description: 'Analyzing patterns and distributions' },
    { id: 3, name: 'Feature Engineering', description: 'Creating and selecting features' },
    { id: 4, name: 'Model Training', description: 'Training and tuning models' },
    { id: 5, name: 'Model Evaluation', description: 'Assessing model performance' },
    { id: 6, name: 'Report Generation', description: 'Creating insights and visualizations' },
  ];
  
  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  // Handle step click
  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep + 1 && !isLoading) {
      setCurrentStep(stepId);
    }
  };
  
  // Get step status
  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Workflow Status</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isLoading ? 'Processing...' : `Step ${currentStep} of ${steps.length}`}
          </span>
          {isLoading && (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-slow"></div>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-lg">
        <div className="progress-track">
          <div 
            className="progress-indicator" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Vertical stepper */}
      <div className="space-y-sm relative">
        {/* Vertical line connector */}
        <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-border dark:bg-dark-border"></div>
        
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          
          return (
            <div 
              key={step.id}
              className={`workflow-step ${status === 'active' ? 'workflow-step-active' : ''} ${status === 'completed' ? 'workflow-step-completed' : ''} ${status === 'pending' ? 'workflow-step-pending' : ''} ${step.id <= currentStep + 1 && !isLoading ? 'cursor-pointer hover-scale' : 'cursor-not-allowed opacity-70'}`}
              onClick={() => handleStepClick(step.id)}
            >
              <div className={`workflow-step-icon ${status === 'active' ? 'workflow-step-icon-active' : ''} ${status === 'completed' ? 'workflow-step-icon-completed' : ''} ${status === 'pending' ? 'workflow-step-icon-pending' : ''} z-10`}>
                {status === 'completed' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              <div className="ml-md flex-grow">
                <div className="font-medium">{step.name}</div>
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary">{step.description}</div>
              </div>
              
              <div>
                {status === 'active' && (
                  <button className="btn btn-primary text-sm">
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Running
                      </span>
                    ) : (
                      'Start'
                    )}
                  </button>
                )}
                
                {status === 'completed' && (
                  <button className="btn btn-secondary text-sm">
                    View
                  </button>
                )}
                
                {status === 'pending' && step.id !== currentStep + 1 && (
                  <button className="btn btn-tertiary text-sm" disabled>
                    Pending
                  </button>
                )}
                
                {status === 'pending' && step.id === currentStep + 1 && (
                  <button className="btn btn-secondary text-sm" disabled={isLoading}>
                    Next
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-lg pt-md border-t border-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            <span>Estimated completion: ~3 minutes</span>
          </div>
          <button 
            className="btn btn-secondary"
            disabled={currentStep <= 1 || isLoading}
            onClick={() => setCurrentStep(currentStep - 1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Previous Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkflowStatusTracker;
