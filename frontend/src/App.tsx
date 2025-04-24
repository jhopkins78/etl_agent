import React from 'react';
import Header from './components/Header';
import AssignmentUpload from './components/AssignmentUpload/AssignmentUpload';
import WorkflowStatusTracker from './components/WorkflowStatusTracker/WorkflowStatusTracker';
import InsightViewer from './components/InsightViewer/InsightViewer';
import DataArtifacts from './components/DataArtifacts/DataArtifacts';
import ModelLeaderboard from './components/ModelLeaderboard/ModelLeaderboard';
import AgentConsole from './components/AgentConsole/AgentConsole';
import EDAConsole from './components/EDAConsole/EDAConsole';
import VisualizationConsole from './components/VisualizationConsole/VisualizationConsole';
import ModelingConsole from './components/ModelingConsole/ModelingConsole';
import EvaluationConsole from './components/EvaluationConsole/EvaluationConsole';
import ExecutionSummary from './components/ExecutionSummary/ExecutionSummary';
import { DashboardProvider } from './context/DashboardContext';
import './styles/globals.css';
import './styles/animations.css';

function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark transition-colors duration-300">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <AssignmentUpload />
            </div>
            <div className="lg:col-span-2">
              <WorkflowStatusTracker />
            </div>
          </div>
          
          <div className="mb-6">
            <InsightViewer />
          </div>
          
          <div className="mb-6">
            <EDAConsole />
          </div>
          
          <div className="mb-6">
            <VisualizationConsole />
          </div>
          
          <div className="mb-6">
            <ModelingConsole />
          </div>
          
          <div className="mb-6">
            <EvaluationConsole />
          </div>
          
          <div className="mb-6">
            <ExecutionSummary />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <DataArtifacts />
            </div>
            <div>
              <ModelLeaderboard />
            </div>
          </div>
          
          <div className="mb-6">
            <AgentConsole />
          </div>
        </div>
      </div>
    </DashboardProvider>
  );
}

export default App;
