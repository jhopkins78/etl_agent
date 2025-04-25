import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const WorkflowStatusTracker: React.FC = () => {
  const { workflowStep, setWorkflowStep, isLoading } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  
  // Workflow steps
  const steps = [
    { id: 1, name: 'Data Preparation', description: 'Clean and prepare dataset for analysis' },
    { id: 2, name: 'Model Training', description: 'Train and tune machine learning models' },
    { id: 3, name: 'Model Evaluation', description: 'Evaluate model performance metrics' },
    { id: 4, name: 'Insight Generation', description: 'Generate insights from model results' }
  ];
  
  const handleStepClick = (stepId: number) => {
    if (stepId <= workflowStep + 1) {
      setSelectedStep(stepId);
      setShowModal(true);
    }
  };
  
  const startStep = () => {
    if (selectedStep !== null) {
      setWorkflowStep(selectedStep);
      setShowModal(false);
    }
  };
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Workflow Status</h2>
        <div className="flex items-center">
          <span className="badge badge-primary mr-sm">Step {workflowStep + 1} of {steps.length}</span>
          {isLoading && (
            <span className="flex items-center text-sm text-text-secondary dark:text-text-secondary-dark">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-md">
        {steps.map((step, index) => {
          const isActive = index === workflowStep;
          const isCompleted = index < workflowStep;
          const isPending = index > workflowStep;
          const isDisabled = index > workflowStep + 1;
          
          return (
            <div 
              key={step.id}
              onClick={() => !isDisabled && handleStepClick(index)}
              className={`workflow-step ${isActive ? 'workflow-step-active' : ''} ${isCompleted ? 'workflow-step-completed' : ''} ${isPending && !isDisabled ? 'workflow-step-pending' : ''} ${isDisabled ? 'workflow-step-disabled' : ''}`}
            >
              <div className={`workflow-step-indicator ${isActive ? 'workflow-step-indicator-active' : ''} ${isCompleted ? 'workflow-step-indicator-completed' : ''} ${isPending ? 'workflow-step-indicator-pending' : ''}`}>
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              
              <div className="ml-md flex-1">
                <h3 className="text-md font-medium">{step.name}</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">{step.description}</p>
              </div>
              
              <div>
                {isActive && !isLoading && (
                  <span className="text-sm text-primary dark:text-primary-light">In Progress</span>
                )}
                {isCompleted && (
                  <span className="text-sm text-success">Completed</span>
                )}
                {isPending && !isDisabled && (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStepClick(index);
                    }}
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Step Modal */}
      {showModal && selectedStep !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-card dark:bg-card-dark rounded-2xl p-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-md">{steps[selectedStep].name}</h3>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-lg">
              {selectedStep === 0 && "This step will clean and prepare your dataset for analysis. It includes handling missing values, encoding categorical variables, and feature scaling."}
              {selectedStep === 1 && "This step will train machine learning models on your dataset. You can enable tuning to optimize model parameters for better performance."}
              {selectedStep === 2 && "This step will evaluate model performance using metrics like RMSE, MAE, and R². You'll see a comparison of all trained models."}
              {selectedStep === 3 && "This step will generate insights from your model results, including feature importance, prediction explanations, and business recommendations."}
            </p>
            
            {selectedStep === 1 && (
              <div className="mb-lg space-y-md">
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <div className="mr-sm">
                      <span className="text-sm font-medium">Enable Tuning</span>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark">Optimize model parameters</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" defaultChecked />
                      <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner dark:bg-gray-700"></div>
                      <div className="dot absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-1 transition transform translate-x-full"></div>
                    </div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <div className="mr-sm">
                      <span className="text-sm font-medium">Use Bayesian Optimization</span>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark">More efficient parameter search</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" className="sr-only" />
                      <div className="w-10 h-5 bg-gray-200 rounded-full shadow-inner dark:bg-gray-700"></div>
                      <div className="dot absolute w-5 h-5 bg-white rounded-full shadow -left-1 -top-1 transition"></div>
                    </div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-xs">Preferred Model Override</label>
                  <select className="form-input">
                    <option value="">No preference (try all models)</option>
                    <option value="linear">Linear Regression</option>
                    <option value="ridge">Ridge Regression</option>
                    <option value="lasso">Lasso Regression</option>
                    <option value="rf">Random Forest</option>
                    <option value="xgb">XGBoost</option>
                  </select>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-sm">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={startStep}
              >
                {workflowStep === selectedStep ? 'Resume' : 'Start'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowStatusTracker;
