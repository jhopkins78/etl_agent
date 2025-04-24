import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const Header: React.FC = () => {
  return (
    <header className="bg-card dark:bg-card-dark shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold">Insight Agent Dashboard</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex space-x-4">
              <a href="#full-report" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">Full Report</a>
              <a href="#eda" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">EDA</a>
              <a href="#visualizations" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">Visualizations</a>
              <a href="#modeling" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">Modeling</a>
              <a href="#evaluation" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">Evaluation</a>
              <a href="#execution-summary" className="text-sm font-medium hover:text-primary dark:hover:text-primary-dark transition-colors">Execution Summary</a>
            </nav>
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const ThemeToggle: React.FC = () => {
  const { darkMode, setDarkMode } = useDashboard();
  
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-10 h-10 rounded-full flex items-center justify-center bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80 transition-colors"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default Header;
