import React, { createContext, useContext, useState } from 'react';

// Define the types for our context
type WorkflowStep = {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
};

type Task = {
  id: number;
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
};

// Model types
type ModelOption = {
  value: string;
  label: string;
};

type DashboardContextType = {
  // Assignment state
  assignmentFile: File | null;
  setAssignmentFile: (file: File | null) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  
  // Workflow state
  workflowSteps: WorkflowStep[];
  updateWorkflowStep: (id: number, status: 'completed' | 'in-progress' | 'pending') => void;
  
  // Model Training settings
  enableTuning: boolean;
  setEnableTuning: (enable: boolean) => void;
  useBayesianOptimization: boolean;
  setUseBayesianOptimization: (use: boolean) => void;
  preferredModel: string | null;
  setPreferredModel: (model: string | null) => void;
  availableModels: ModelOption[];
  
  // Active tab states
  activeInsightTab: string;
  setActiveInsightTab: (tab: string) => void;
  activeDataTab: string;
  setActiveDataTab: (tab: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

// Create the context with default values
const DashboardContext = createContext<DashboardContextType>({
  assignmentFile: null,
  setAssignmentFile: () => {},
  tasks: [],
  setTasks: () => {},
  workflowSteps: [],
  updateWorkflowStep: () => {},
  
  // Model Training settings
  enableTuning: true, // default: on
  setEnableTuning: () => {},
  useBayesianOptimization: false,
  setUseBayesianOptimization: () => {},
  preferredModel: null,
  setPreferredModel: () => {},
  availableModels: [],
  
  activeInsightTab: 'full-report',
  setActiveInsightTab: () => {},
  activeDataTab: 'data-preview',
  setActiveDataTab: () => {},
  isLoading: false,
  setIsLoading: () => {},
});

// Create a provider component
export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assignmentFile, setAssignmentFile] = useState<File | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Exploratory Data Analysis', status: 'completed' },
    { id: 2, name: 'Feature Engineering', status: 'in-progress' },
    { id: 3, name: 'Model Training', status: 'pending' },
    { id: 4, name: 'Evaluation', status: 'pending' },
    { id: 5, name: 'Reporting', status: 'pending' }
  ]);
  
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([
    { id: 1, name: 'Data Loading', status: 'completed', description: 'Load dataset from source' },
    { id: 2, name: 'Data Cleaning', status: 'completed', description: 'Handle missing values and outliers' },
    { id: 3, name: 'Feature Engineering', status: 'in-progress', description: 'Create and transform features' },
    { id: 4, name: 'Model Training', status: 'pending', description: 'Train machine learning models' },
    { id: 5, name: 'Model Evaluation', status: 'pending', description: 'Evaluate model performance' },
    { id: 6, name: 'Report Generation', status: 'pending', description: 'Generate final insights report' }
  ]);
  
  // Model Training settings
  const [enableTuning, setEnableTuning] = useState<boolean>(true); // default: on
  const [useBayesianOptimization, setUseBayesianOptimization] = useState<boolean>(false);
  const [preferredModel, setPreferredModel] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelOption[]>([
    { value: 'linear_regression', label: 'Linear Regression' },
    { value: 'ridge', label: 'Ridge' },
    { value: 'lasso', label: 'Lasso' },
    { value: 'elasticnet', label: 'ElasticNet' },
    { value: 'knn', label: 'KNN' },
    { value: 'decision_tree', label: 'Decision Tree' },
    { value: 'random_forest', label: 'Random Forest' },
    { value: 'gradient_boosting', label: 'Gradient Boosting' },
    { value: 'svr', label: 'SVR' }
  ]);
  
  const [activeInsightTab, setActiveInsightTab] = useState('full-report');
  const [activeDataTab, setActiveDataTab] = useState('data-preview');
  const [isLoading, setIsLoading] = useState(false);
  
  const updateWorkflowStep = (id: number, status: 'completed' | 'in-progress' | 'pending') => {
    setWorkflowSteps(prevSteps => 
      prevSteps.map(step => 
        step.id === id ? { ...step, status } : step
      )
    );
    
    // Update related tasks if needed
    if (id === 3 && status === 'completed') {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === 2 ? { ...task, status: 'completed' } : task
        )
      );
    }
  };
  
  return (
    <DashboardContext.Provider value={{
      assignmentFile,
      setAssignmentFile,
      tasks,
      setTasks,
      workflowSteps,
      updateWorkflowStep,
      
      // Model Training settings
      enableTuning,
      setEnableTuning,
      useBayesianOptimization,
      setUseBayesianOptimization,
      preferredModel,
      setPreferredModel,
      availableModels,
      
      activeInsightTab,
      setActiveInsightTab,
      activeDataTab,
      setActiveDataTab,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

// Create a custom hook to use the context
export const useDashboard = () => useContext(DashboardContext);
