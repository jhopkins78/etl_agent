import React from 'react';
import './App.css';
import Header from './components/Header.tsx';
import AssignmentOverview from './components/AssignmentOverview/AssignmentOverview.tsx';
import AssignmentDropzone from './components/AssignmentDropzone/index.ts';
import WorkflowStatusPanel from './components/WorkflowStatusPanel/WorkflowStatusPanel.tsx';
import InsightViewer from './components/InsightViewer/InsightViewer.tsx';
import DataArtifactsPanel from './components/DataArtifactsPanel/DataArtifactsPanel.tsx';
import AgentConsole from './components/AgentConsole/AgentConsole.tsx';
import { DashboardProvider } from './context/DashboardContext.tsx';

interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AssignmentDropzone />
            <WorkflowStatusPanel />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InsightViewer />
            <DataArtifactsPanel />
          </div>
          <div className="mb-6">
            <AgentConsole />
          </div>
        </main>
        <footer className="bg-white border-t border-slate-200 p-4 text-center text-sm text-slate-500">
          Insight Agent Dashboard © {new Date().getFullYear()}
        </footer>
      </div>
    </DashboardProvider>
  );
};

export default App;
