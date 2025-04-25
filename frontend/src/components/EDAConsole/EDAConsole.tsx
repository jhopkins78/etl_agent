import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const EDAConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('data-overview');
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Exploratory Data Analysis</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Analysis
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'data-overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('data-overview')}
        >
          Data Overview
        </div>
        <div 
          className={`tab ${activeTab === 'feature-analysis' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('feature-analysis')}
        >
          Feature Analysis
        </div>
        <div 
          className={`tab ${activeTab === 'correlation-analysis' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('correlation-analysis')}
        >
          Correlation Analysis
        </div>
        <div 
          className={`tab ${activeTab === 'outlier-detection' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('outlier-detection')}
        >
          Outlier Detection
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading EDA results...</p>
          </div>
        ) : (
          <>
            {activeTab === 'data-overview' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Dataset Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Total Observations</h4>
                      <p className="text-2xl font-semibold">1,460</p>
                    </div>
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Features</h4>
                      <p className="text-2xl font-semibold">81</p>
                    </div>
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Missing Values</h4>
                      <p className="text-2xl font-semibold">5.9%</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Data Types</h3>
                  <div className="card-alt p-md">
                    <div className="flex items-center">
                      <div className="w-1/2">
                        <div className="flex items-center mb-xs">
                          <div className="w-4 h-4 rounded-sm bg-primary mr-sm"></div>
                          <span className="text-sm">Numerical (38)</span>
                        </div>
                        <div className="flex items-center mb-xs">
                          <div className="w-4 h-4 rounded-sm bg-success mr-sm"></div>
                          <span className="text-sm">Categorical (43)</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-sm bg-warning mr-sm"></div>
                          <span className="text-sm">DateTime (0)</span>
                        </div>
                      </div>
                      <div className="w-1/2 h-32 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" strokeDasharray="251.2 251.2" strokeDashoffset="0" className="text-primary" />
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="currentColor" strokeWidth="20" strokeDasharray="251.2 251.2" strokeDashoffset="118.1" className="text-success" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Missing Values Distribution</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-xs">
                      <div className="flex items-center">
                        <span className="w-32 text-sm">PoolQC</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-danger h-full rounded-full" style={{ width: '99.5%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">99.5%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">MiscFeature</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-danger h-full rounded-full" style={{ width: '96.4%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">96.4%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Alley</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-danger h-full rounded-full" style={{ width: '93.8%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">93.8%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Fence</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-danger h-full rounded-full" style={{ width: '80.8%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">80.8%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">FireplaceQu</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-danger h-full rounded-full" style={{ width: '47.3%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">47.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'feature-analysis' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Numerical Features Summary</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="table-header">Feature</th>
                          <th className="table-header">Mean</th>
                          <th className="table-header">Std</th>
                          <th className="table-header">Min</th>
                          <th className="table-header">25%</th>
                          <th className="table-header">50%</th>
                          <th className="table-header">75%</th>
                          <th className="table-header">Max</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border-dark">
                        <tr className="table-row-hover">
                          <td className="table-cell">SalePrice</td>
                          <td className="table-cell table-cell-numeric">180,921</td>
                          <td className="table-cell table-cell-numeric">79,442</td>
                          <td className="table-cell table-cell-numeric">34,900</td>
                          <td className="table-cell table-cell-numeric">129,975</td>
                          <td className="table-cell table-cell-numeric">163,000</td>
                          <td className="table-cell table-cell-numeric">214,000</td>
                          <td className="table-cell table-cell-numeric">755,000</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">GrLivArea</td>
                          <td className="table-cell table-cell-numeric">1,515</td>
                          <td className="table-cell table-cell-numeric">525</td>
                          <td className="table-cell table-cell-numeric">334</td>
                          <td className="table-cell table-cell-numeric">1,129</td>
                          <td className="table-cell table-cell-numeric">1,464</td>
                          <td className="table-cell table-cell-numeric">1,776</td>
                          <td className="table-cell table-cell-numeric">5,642</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">LotArea</td>
                          <td className="table-cell table-cell-numeric">10,517</td>
                          <td className="table-cell table-cell-numeric">9,981</td>
                          <td className="table-cell table-cell-numeric">1,300</td>
                          <td className="table-cell table-cell-numeric">7,554</td>
                          <td className="table-cell table-cell-numeric">9,478</td>
                          <td className="table-cell table-cell-numeric">11,601</td>
                          <td className="table-cell table-cell-numeric">215,245</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Categorical Features Distribution</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">MSZoning</h4>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {[75, 25, 15, 10, 5].map((height, i) => (
                          <div 
                            key={i}
                            className="bg-primary bg-opacity-70 dark:bg-opacity-80 rounded-t-md w-full"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                        <span>RL</span>
                        <span>RM</span>
                        <span>FV</span>
                        <span>RH</span>
                        <span>C</span>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Neighborhood</h4>
                      <div className="h-40 flex items-end justify-between space-x-1">
                        {[60, 50, 45, 40, 35, 30, 25, 20].map((height, i) => (
                          <div 
                            key={i}
                            className="bg-success bg-opacity-70 dark:bg-opacity-80 rounded-t-md w-full"
                            style={{ height: `${height}%` }}
                          ></div>
                        ))}
                      </div>
                      <div className="mt-xs flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark">
                        <span>NAmes</span>
                        <span>CollgCr</span>
                        <span>OldTown</span>
                        <span>Edwards</span>
                        <span>...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'correlation-analysis' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Top Correlations with SalePrice</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-xs">
                      <div className="flex items-center">
                        <span className="w-32 text-sm">OverallQual</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '79%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">0.79</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">GrLivArea</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '71%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">0.71</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">GarageCars</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '64%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">0.64</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">GarageArea</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '62%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">0.62</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">TotalBsmtSF</span>
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: '61%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">0.61</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Correlation Matrix</h3>
                  <div className="card-alt p-md">
                    <div className="h-64 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-10 grid-rows-10 gap-0.5 w-full h-full">
                          {Array.from({ length: 100 }).map((_, i) => {
                            const row = Math.floor(i / 10);
                            const col = i % 10;
                            const intensity = Math.abs(Math.sin(row * 0.5) * Math.cos(col * 0.5));
                            const color = intensity > 0.7 ? 'bg-primary' : 
                                         intensity > 0.4 ? 'bg-primary bg-opacity-70' : 
                                         intensity > 0.2 ? 'bg-primary bg-opacity-40' : 
                                         'bg-primary bg-opacity-20';
                            return (
                              <div 
                                key={i} 
                                className={`${color} w-full h-full`}
                              ></div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-xs text-xs text-text-secondary dark:text-text-secondary-dark text-center">
                      Correlation matrix heatmap of top 10 numerical features
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'outlier-detection' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Outlier Detection Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Total Outliers</h4>
                      <p className="text-2xl font-semibold">42</p>
                    </div>
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Outlier Percentage</h4>
                      <p className="text-2xl font-semibold">2.9%</p>
                    </div>
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium text-text-secondary dark:text-text-secondary-dark">Features with Outliers</h4>
                      <p className="text-2xl font-semibold">8</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Box Plots for Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">SalePrice</h4>
                      <div className="h-40 relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="h-8 w-full bg-primary bg-opacity-20 rounded-md relative">
                            <div className="absolute inset-y-0 left-1/4 right-1/4 bg-primary bg-opacity-40 rounded-md"></div>
                            <div className="absolute inset-y-0 left-[45%] w-1 bg-primary"></div>
                            <div className="absolute left-0 w-1/4 h-0.5 bg-primary"></div>
                            <div className="absolute right-0 w-1/4 h-0.5 bg-primary"></div>
                            <div className="absolute right-[10%] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-danger"></div>
                            <div className="absolute right-[5%] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-danger"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">GrLivArea</h4>
                      <div className="h-40 relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="h-8 w-full bg-success bg-opacity-20 rounded-md relative">
                            <div className="absolute inset-y-0 left-1/5 right-1/4 bg-success bg-opacity-40 rounded-md"></div>
                            <div className="absolute inset-y-0 left-[40%] w-1 bg-success"></div>
                            <div className="absolute left-0 w-1/5 h-0.5 bg-success"></div>
                            <div className="absolute right-0 w-1/4 h-0.5 bg-success"></div>
                            <div className="absolute right-[8%] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-danger"></div>
                            <div className="absolute right-[12%] top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-danger"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Outlier Treatment Recommendations</h3>
                  <div className="card-alt p-md">
                    <ul className="list-disc list-inside space-y-xs text-sm">
                      <li>Remove 2 extreme outliers in GrLivArea (&gt;4000 sq ft with low price)</li>
                      <li>Cap LotArea values above 100,000 sq ft (99th percentile)</li>
                      <li>Log transform right-skewed features (SalePrice, LotArea, GrLivArea)</li>
                      <li>Winsorize TotalBsmtSF at 99th percentile</li>
                      <li>Keep moderate outliers in OverallQual as they represent genuine quality differences</li>
                    </ul>
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

export default EDAConsole;
