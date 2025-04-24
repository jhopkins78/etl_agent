import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const DataArtifacts: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('data-preview');
  
  // Sample data for preview
  const sampleData = [
    { id: 1, MSSubClass: 60, MSZoning: 'RL', LotFrontage: 65, LotArea: 8450, SalePrice: 208500 },
    { id: 2, MSSubClass: 20, MSZoning: 'RL', LotFrontage: 80, LotArea: 9600, SalePrice: 181500 },
    { id: 3, MSSubClass: 60, MSZoning: 'RL', LotFrontage: 68, LotArea: 11250, SalePrice: 223500 },
    { id: 4, MSSubClass: 70, MSZoning: 'RL', LotFrontage: 60, LotArea: 9550, SalePrice: 140000 },
    { id: 5, MSSubClass: 60, MSZoning: 'RL', LotFrontage: 84, LotArea: 14260, SalePrice: 250000 },
  ];
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Data Artifacts</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'data-preview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('data-preview')}
        >
          Data Preview
        </div>
        <div 
          className={`tab ${activeTab === 'visualizations' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('visualizations')}
        >
          Visualizations
        </div>
        <div 
          className={`tab ${activeTab === 'feature-stats' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('feature-stats')}
        >
          Feature Stats
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading data artifacts...</p>
          </div>
        ) : (
          <>
            {activeTab === 'data-preview' && (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">ID</th>
                      <th className="table-header">MSSubClass</th>
                      <th className="table-header">MSZoning</th>
                      <th className="table-header">LotFrontage</th>
                      <th className="table-header">LotArea</th>
                      <th className="table-header">SalePrice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-border-dark">
                    {sampleData.map((row) => (
                      <tr key={row.id} className="table-row-hover">
                        <td className="table-cell">{row.id}</td>
                        <td className="table-cell">{row.MSSubClass}</td>
                        <td className="table-cell">{row.MSZoning}</td>
                        <td className="table-cell table-cell-numeric">{row.LotFrontage}</td>
                        <td className="table-cell table-cell-numeric">{row.LotArea}</td>
                        <td className="table-cell table-cell-numeric">${row.SalePrice.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-md text-sm text-text-secondary dark:text-text-secondary-dark text-center">
                  Showing 5 of 1,460 rows
                </div>
              </div>
            )}
            
            {activeTab === 'visualizations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                <div className="card-alt p-md">
                  <h3 className="text-md font-medium mb-sm">Sale Price Distribution</h3>
                  <div className="h-40 flex items-end justify-between space-x-1">
                    {[15, 28, 42, 65, 38, 25, 18, 12, 8, 5].map((height, i) => (
                      <div 
                        key={i}
                        className="bg-primary bg-opacity-70 dark:bg-opacity-80 rounded-t-md w-full"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                    <span>$0</span>
                    <span>$250k</span>
                    <span>$500k</span>
                  </div>
                </div>
                
                <div className="card-alt p-md">
                  <h3 className="text-md font-medium mb-sm">Living Area vs Price</h3>
                  <div className="h-40 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          {[
                            { x: 20, y: 70 },
                            { x: 30, y: 60 },
                            { x: 35, y: 50 },
                            { x: 40, y: 45 },
                            { x: 45, y: 40 },
                            { x: 50, y: 35 },
                            { x: 55, y: 30 },
                            { x: 60, y: 25 },
                            { x: 65, y: 20 },
                            { x: 70, y: 15 },
                            { x: 75, y: 25 },
                            { x: 80, y: 20 },
                          ].map((point, i) => (
                            <circle 
                              key={i} 
                              cx={point.x} 
                              cy={point.y} 
                              r="1.5" 
                              className="fill-primary"
                            />
                          ))}
                          <line x1="10" y1="90" x2="90" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-primary" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                    <span>800 sqft</span>
                    <span>2500 sqft</span>
                  </div>
                </div>
                
                <div className="card-alt p-md">
                  <h3 className="text-md font-medium mb-sm">Quality vs Price</h3>
                  <div className="h-40 flex items-end justify-between space-x-1">
                    {[10, 20, 35, 45, 60, 75, 85, 95].map((height, i) => (
                      <div 
                        key={i}
                        className="bg-success bg-opacity-70 dark:bg-opacity-80 rounded-t-md w-full"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                    <span>3</span>
                    <span>5</span>
                    <span>7</span>
                    <span>10</span>
                  </div>
                </div>
                
                <div className="card-alt p-md">
                  <h3 className="text-md font-medium mb-sm">Year Built Distribution</h3>
                  <div className="h-40 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path d="M10,90 C20,80 30,40 40,60 C50,30 60,50 70,40 C80,20 90,10 90,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-info" />
                        <path d="M10,90 C20,80 30,40 40,60 C50,30 60,50 70,40 C80,20 90,10 90,10" fill="rgba(59, 130, 246, 0.1)" stroke="none" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                    <span>1900</span>
                    <span>1950</span>
                    <span>2000</span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'feature-stats' && (
              <div className="space-y-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  <div className="card-alt p-md">
                    <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Total Features</h3>
                    <p className="text-2xl font-semibold">81</p>
                  </div>
                  <div className="card-alt p-md">
                    <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Numerical Features</h3>
                    <p className="text-2xl font-semibold">38</p>
                  </div>
                  <div className="card-alt p-md">
                    <h3 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Categorical Features</h3>
                    <p className="text-2xl font-semibold">43</p>
                  </div>
                </div>
                
                <div className="card-alt p-md">
                  <h3 className="text-md font-medium mb-sm">Top Correlated Features</h3>
                  <div className="space-y-xs">
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Overall Quality</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '79%' }}></div>
                      </div>
                      <span className="ml-sm text-sm font-mono">0.79</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Living Area</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '71%' }}></div>
                      </div>
                      <span className="ml-sm text-sm font-mono">0.71</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Garage Cars</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '64%' }}></div>
                      </div>
                      <span className="ml-sm text-sm font-mono">0.64</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Garage Area</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
                      </div>
                      <span className="ml-sm text-sm font-mono">0.62</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-32 text-sm">Total Basement</span>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: '61%' }}></div>
                      </div>
                      <span className="ml-sm text-sm font-mono">0.61</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataArtifacts;
