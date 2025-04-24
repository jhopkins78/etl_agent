import React from 'react';

const Header: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <header className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border transition-colors duration-300">
      <div className="container mx-auto px-md py-md flex justify-between items-center">
        <div className="flex items-center space-x-md">
          <div className="text-xl font-bold text-primary">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Insight Agent
            </span>
          </div>
          <nav className="hidden md:flex space-x-md">
            <a href="#" className="text-text-primary dark:text-dark-text-primary hover:text-primary dark:hover:text-primary transition-colors">Dashboard</a>
            <a href="#" className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary transition-colors">Projects</a>
            <a href="#" className="text-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-primary transition-colors">Reports</a>
          </nav>
        </div>
        <div className="flex items-center space-x-md">
          {children}
          <div className="relative">
            <button className="w-8 h-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary hover:bg-opacity-20 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          <div className="w-8 h-8 rounded-full bg-card-alt dark:bg-dark-card-alt flex items-center justify-center">
            <span className="text-sm font-medium">AI</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
