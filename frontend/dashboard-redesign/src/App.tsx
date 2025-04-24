import React from 'react';
import './styles/globals.css';
import './styles/animations.css';
import { DashboardProvider } from './context/DashboardContext';
import Header from './components/Header';
import AssignmentUpload from './components/AssignmentUpload/AssignmentUpload';
import WorkflowStatusTracker from './components/WorkflowStatusTracker/WorkflowStatusTracker';
import InsightViewer from './components/InsightViewer/InsightViewer';
import DataArtifacts from './components/DataArtifacts/DataArtifacts';
import ModelLeaderboard from './components/ModelLeaderboard/ModelLeaderboard';
import AgentConsole from './components/AgentConsole/AgentConsole';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

function App() {
  // State to track dark mode
  const [darkMode, setDarkMode] = React.useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Update document class for dark mode
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Check for user's preferred color scheme on mount
  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background dark:bg-dark-background text-text-primary dark:text-dark-text-primary transition-colors duration-300">
        <Header>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </Header>
        
        <main className="container mx-auto px-md py-lg animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl animate-staggered-fade-in">
            <AssignmentUpload />
            <WorkflowStatusTracker />
          </div>
          
          <div className="mb-xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <ModelLeaderboard />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl animate-staggered-fade-in">
            <InsightViewer />
            <DataArtifacts />
          </div>
          
          <div className="mb-xl animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <AgentConsole />
          </div>
        </main>
        
        <footer className="bg-card dark:bg-dark-card border-t border-border dark:border-dark-border p-md text-center text-sm text-text-secondary dark:text-dark-text-secondary">
          <div className="container mx-auto">
            Insight Agent Dashboard © {new Date().getFullYear()}
          </div>
        </footer>
      </div>
    </DashboardProvider>
  );
}

export default App;
