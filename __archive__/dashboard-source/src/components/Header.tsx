import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 px-6 border-b border-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Insight Agent Dashboard</h1>
        <div className="flex space-x-4">
          <button className="px-3 py-1 text-sm rounded-md border border-slate-300 hover:bg-slate-50 transition-colors">
            Settings
          </button>
          <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-slate-600 transition-colors">
            New Assignment
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
