import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DataArtifacts: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState<'data' | 'visualizations'>('data');
  
  // Sample data for the table
  const sampleData = [
    { id: 1, sex: 'M', length: 0.455, diameter: 0.365, height: 0.095, weight: 0.514, age: 15 },
    { id: 2, sex: 'F', length: 0.350, diameter: 0.265, height: 0.090, weight: 0.226, age: 7 },
    { id: 3, sex: 'M', length: 0.530, diameter: 0.420, height: 0.135, weight: 0.677, age: 9 },
    { id: 4, sex: 'F', length: 0.440, diameter: 0.365, height: 0.125, weight: 0.516, age: 10 },
    { id: 5, sex: 'I', length: 0.330, diameter: 0.255, height: 0.080, weight: 0.205, age: 7 },
    { id: 6, sex: 'M', length: 0.425, diameter: 0.300, height: 0.095, weight: 0.351, age: 8 },
    { id: 7, sex: 'F', length: 0.485, diameter: 0.370, height: 0.150, weight: 0.608, age: 12 },
  ];
  
  // Sample visualizations
  const visualizations = [
    { id: 1, title: 'Feature Importance', description: 'Relative importance of each feature in the model' },
    { id: 2, title: 'Age Distribution', description: 'Distribution of specimen ages in the dataset' },
    { id: 3, title: 'Correlation Matrix', description: 'Correlation between different features' },
    { id: 4, title: 'Learning Curves', description: 'Model performance across training iterations' },
  ];

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Data Artifacts</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isLoading ? 'Loading data...' : '7 records'}
          </span>
          {isLoading ? (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-slow"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-success"></div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border dark:border-dark-border mb-md">
        <button
          className={`tab ${activeTab === 'data' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Preview
        </button>
        <button
          className={`tab ${activeTab === 'visualizations' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('visualizations')}
        >
          Visualizations
        </button>
      </div>
      
      {/* Tab content with fade transition */}
      <div className="flex-grow overflow-auto rounded-2xl transition-all duration-300 animate-fade-in h-96">
        {activeTab === 'data' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border dark:divide-dark-border">
              <thead>
                <tr>
                  <th className="table-header text-left">Sex</th>
                  <th className="table-header text-right">Length</th>
                  <th className="table-header text-right">Diameter</th>
                  <th className="table-header text-right">Height</th>
                  <th className="table-header text-right">Weight</th>
                  <th className="table-header text-right">Age</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-dark-border">
                {sampleData.map((row, index) => (
                  <tr key={row.id} className={`table-row ${index % 2 === 0 ? 'bg-card dark:bg-dark-card' : 'bg-card-alt dark:bg-dark-card-alt'}`}>
                    <td className="table-cell">{row.sex}</td>
                    <td className="table-cell table-cell-numeric">{row.length.toFixed(3)}</td>
                    <td className="table-cell table-cell-numeric">{row.diameter.toFixed(3)}</td>
                    <td className="table-cell table-cell-numeric">{row.height.toFixed(3)}</td>
                    <td className="table-cell table-cell-numeric">{row.weight.toFixed(3)}</td>
                    <td className="table-cell table-cell-numeric">{row.age}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'visualizations' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {visualizations.map((viz) => (
              <div key={viz.id} className="bg-card-alt dark:bg-dark-card-alt p-md rounded-2xl border border-border dark:border-dark-border hover-scale">
                <div className="aspect-video bg-card dark:bg-dark-card rounded-xl flex items-center justify-center mb-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-tertiary dark:text-dark-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-medium mb-xs">{viz.title}</h3>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">{viz.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Footer with pagination */}
      <div className="mt-lg pt-md border-t border-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            <span>Showing 7 of 4,177 records</span>
          </div>
          <div className="flex space-x-sm">
            <button className="btn btn-secondary text-sm" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="btn btn-primary text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataArtifacts;
