import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import api, { endpoints } from '../../api';

const WorkflowStatusPanel: React.FC = () => {
  const { 
    workflowSteps, 
    updateWorkflowStep, 
    isLoading, 
    setIsLoading,
    assignmentFile,
    // Model Training settings
    enableTuning,
    setEnableTuning,
    useBayesianOptimization,
    setUseBayesianOptimization,
    preferredModel,
    setPreferredModel,
    availableModels
  } = useDashboard();
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showModelSettings, setShowModelSettings] = useState<boolean>(false);

  // Calculate overall progress
  const completedSteps = workflowSteps.filter(step => step.status === 'completed').length;
  const totalSteps = workflowSteps.length;
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100);
  
  const runEda = async () => {
    if (!assignmentFile) {
      setError('Please upload an assignment file first');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    updateWorkflowStep(1, 'in-progress'); // Set Data Loading to in-progress
    
    try {
      // Call the backend to run EDA
      const response = await api.post(endpoints.runEda);
      
      // Handle successful response
      console.log('EDA process started:', response.data);
      
      // Update workflow steps based on response
      updateWorkflowStep(1, 'completed'); // Data Loading
      updateWorkflowStep(2, 'completed'); // Data Cleaning
      
      // Set Feature Engineering to in-progress
      setTimeout(() => {
        updateWorkflowStep(3, 'in-progress'); // Feature Engineering
        
        // Simulate completion after delay
        setTimeout(() => {
          updateWorkflowStep(3, 'completed'); // Feature Engineering completed
          setSuccess('EDA process completed successfully');
          setIsLoading(false);
        }, 3000);
      }, 1000);
      
    } catch (error) {
      console.error('Error running EDA:', error);
      setError('Failed to run EDA process. Please try again.');
      updateWorkflowStep(1, 'pending'); // Reset Data Loading to pending
      setIsLoading(false);
    }
  };
  
  const handleStepAction = (id: number, currentStatus: string) => {
    if (isLoading) return; // Prevent actions while loading
    
    if (currentStatus === 'completed') {
      // View action - no status change
      console.log(`Viewing step ${id}`);
    } else if (currentStatus === 'in-progress') {
      // Pause action - set to pending
      updateWorkflowStep(id, 'pending');
    } else if (currentStatus === 'pending') {
      // Start action based on step ID
      if (id === 1) { // Data Loading step
        runEda(); // Run the EDA process
      } else if (id === 4) { // Model Training step
        setShowModelSettings(true); // Show model settings before starting
      } else {
        // For other steps, just update the status
        updateWorkflowStep(id, 'in-progress');
      }
    }
  };
  
  const runModelTraining = async () => {
    if (!assignmentFile) {
      setError('Please upload an assignment file first');
      return;
    }
    
    setError(null);
    setSuccess(null);
    setIsLoading(true);
    updateWorkflowStep(4, 'in-progress'); // Set Model Training to in-progress
    
    try {
      // Call the backend to run model training with settings
      const response = await api.post(endpoints.runModelTraining, {
        enableTuning,
        useBayesianOptimization,
        preferredModel
      });
      
      // Handle successful response
      console.log('Model training started:', response.data);
      
      // Update workflow step
      setTimeout(() => {
        updateWorkflowStep(4, 'completed'); // Model Training completed
        setSuccess('Model training completed successfully');
        setIsLoading(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error running model training:', error);
      setError('Failed to run model training process. Please try again.');
      updateWorkflowStep(4, 'pending'); // Reset Model Training to pending
      setIsLoading(false);
    }
    
    // Hide model settings after starting
    setShowModelSettings(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Workflow Status</h2>
      
      {/* Model Training Settings Modal */}
      {showModelSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Model Training Settings</h3>
            
            <div className="space-y-4 mb-6">
              {/* Enable Tuning Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium text-gray-700">Enable Tuning</label>
                  <p className="text-sm text-gray-500">Enable tuning using GridSearchCV</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    className="absolute w-6 h-6 opacity-0 cursor-pointer z-10"
                    checked={enableTuning}
                    onChange={(e) => setEnableTuning(e.target.checked)}
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${enableTuning ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enableTuning ? 'transform translate-x-6' : ''}`}></div>
                </div>
              </div>
              
              {/* Use Bayesian Optimization Toggle - Only show if tuning is enabled */}
              {enableTuning && (
                <div className="flex items-center justify-between">
                  <div>
                    <label className="font-medium text-gray-700">Use Bayesian Optimization</label>
                    <p className="text-sm text-gray-500">Use Bayesian methods for hyperparameter tuning</p>
                  </div>
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer">
                    <input
                      type="checkbox"
                      className="absolute w-6 h-6 opacity-0 cursor-pointer z-10"
                      checked={useBayesianOptimization}
                      onChange={(e) => setUseBayesianOptimization(e.target.checked)}
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${useBayesianOptimization ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${useBayesianOptimization ? 'transform translate-x-6' : ''}`}></div>
                  </div>
                </div>
              )}
              
              {/* Preferred Model Override Dropdown */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">Preferred Model Override</label>
                <p className="text-sm text-gray-500 mb-2">Optionally select a specific model to use</p>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={preferredModel || ''}
                  onChange={(e) => setPreferredModel(e.target.value || null)}
                >
                  <option value="">Auto (Agent Recommendation)</option>
                  {availableModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowModelSettings(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={runModelTraining}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Start Training'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Overall Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div 
            className="bg-pending h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-3">
        {workflowSteps.map(step => (
          <div key={step.id} className="border border-slate-200 rounded-md p-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                {step.status === 'completed' && (
                  <span className="text-success mr-2">✅</span>
                )}
                {step.status === 'in-progress' && (
                  <span className="text-pending mr-2 animate-pulse">⏳</span>
                )}
                {step.status === 'pending' && (
                  <span className="text-slate-300 mr-2">⚪</span>
                )}
                <span className="font-medium">{step.name}</span>
              </div>
              <div>
                {step.status === 'completed' && (
                  <button 
                    className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                    onClick={() => handleStepAction(step.id, step.status)}
                    disabled={isLoading}
                  >
                    View
                  </button>
                )}
                {step.status === 'in-progress' && (
                  <button 
                    className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                    onClick={() => handleStepAction(step.id, step.status)}
                    disabled={isLoading}
                  >
                    Pause
                  </button>
                )}
                {step.status === 'pending' && (
                  <button 
                    className="text-xs px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 transition-colors"
                    onClick={() => handleStepAction(step.id, step.status)}
                    disabled={isLoading}
                  >
                    Start
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStatusPanel;
