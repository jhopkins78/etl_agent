import React from 'react';
import { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  activeInsightTab: string;
  setActiveInsightTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;
  workflowStep: number;
  setWorkflowStep: (step: number) => void;
  modelTrainingSettings: {
    enableTuning: boolean;
    useBayesianOpt: boolean;
    preferredModel: string;
  };
  setModelTrainingSettings: (settings: {
    enableTuning: boolean;
    useBayesianOpt: boolean;
    preferredModel: string;
  }) => void;
  activeConsoleTab: string;
  setActiveConsoleTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeInsightTab, setActiveInsightTab] = useState('full-report');
  const [darkMode, setDarkMode] = useState(true);
  const [workflowStep, setWorkflowStep] = useState(1);
  const [modelTrainingSettings, setModelTrainingSettings] = useState({
    enableTuning: true,
    useBayesianOpt: false,
    preferredModel: 'auto'
  });
  const [activeConsoleTab, setActiveConsoleTab] = useState('chat');

  return (
    <DashboardContext.Provider
      value={{
        isLoading,
        setIsLoading,
        activeInsightTab,
        setActiveInsightTab,
        darkMode,
        setDarkMode,
        workflowStep,
        setWorkflowStep,
        modelTrainingSettings,
        setModelTrainingSettings,
        activeConsoleTab,
        setActiveConsoleTab
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
