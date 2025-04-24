import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const ModelingConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('model-performance');
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Modeling</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Results
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'model-performance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('model-performance')}
        >
          Performance Metrics
        </div>
        <div 
          className={`tab ${activeTab === 'feature-importance' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('feature-importance')}
        >
          Feature Importance
        </div>
        <div 
          className={`tab ${activeTab === 'hyperparameters' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('hyperparameters')}
        >
          Hyperparameters
        </div>
        <div 
          className={`tab ${activeTab === 'learning-curves' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('learning-curves')}
        >
          Learning Curves
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading modeling results...</p>
          </div>
        ) : (
          <>
            {activeTab === 'model-performance' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Model Comparison</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="table-header">Model</th>
                          <th className="table-header">RMSE</th>
                          <th className="table-header">MAE</th>
                          <th className="table-header">R²</th>
                          <th className="table-header">Training Time</th>
                          <th className="table-header">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border-dark">
                        <tr className="table-row-hover">
                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-success mr-sm"></div>
                              <span>Gradient Boosting</span>
                            </div>
                          </td>
                          <td className="table-cell table-cell-numeric">17,854</td>
                          <td className="table-cell table-cell-numeric">12,459</td>
                          <td className="table-cell table-cell-numeric">0.912</td>
                          <td className="table-cell table-cell-numeric">3.2s</td>
                          <td className="table-cell">
                            <span className="badge badge-success">Best</span>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-primary mr-sm"></div>
                              <span>Random Forest</span>
                            </div>
                          </td>
                          <td className="table-cell table-cell-numeric">18,245</td>
                          <td className="table-cell table-cell-numeric">13,102</td>
                          <td className="table-cell table-cell-numeric">0.895</td>
                          <td className="table-cell table-cell-numeric">2.8s</td>
                          <td className="table-cell">
                            <span className="badge badge-primary">Runner-up</span>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-text-tertiary mr-sm"></div>
                              <span>Linear Regression</span>
                            </div>
                          </td>
                          <td className="table-cell table-cell-numeric">30,521</td>
                          <td className="table-cell table-cell-numeric">24,618</td>
                          <td className="table-cell table-cell-numeric">0.712</td>
                          <td className="table-cell table-cell-numeric">0.5s</td>
                          <td className="table-cell">
                            <span className="badge badge-neutral">Baseline</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div>
                    <h3 className="text-md font-medium mb-sm">ROC Curve</h3>
                    <div className="card-alt p-md h-64 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Axes */}
                          <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          
                          {/* Diagonal line (random classifier) */}
                          <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          
                          {/* ROC curves */}
                          <path d="M10,90 Q30,30 90,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" />
                          <path d="M10,90 Q40,40 90,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                          <path d="M10,90 Q60,70 90,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          
                          {/* Labels */}
                          <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">False Positive Rate</text>
                          <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">True Positive Rate</text>
                          
                          {/* Legend */}
                          <circle cx="75" cy="30" r="2" fill="currentColor" className="text-success" />
                          <text x="80" y="32" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">GB (AUC=0.94)</text>
                          
                          <circle cx="75" cy="40" r="2" fill="currentColor" className="text-primary" />
                          <text x="80" y="42" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">RF (AUC=0.91)</text>
                          
                          <circle cx="75" cy="50" r="2" fill="currentColor" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          <text x="80" y="52" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">LR (AUC=0.78)</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-md font-medium mb-sm">Precision-Recall Curve</h3>
                    <div className="card-alt p-md h-64 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Axes */}
                          <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          
                          {/* PR curves */}
                          <path d="M10,30 Q50,60 90,10" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" />
                          <path d="M10,40 Q40,65 90,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                          <path d="M10,60 Q30,75 90,40" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          
                          {/* Labels */}
                          <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Recall</text>
                          <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Precision</text>
                          
                          {/* Legend */}
                          <circle cx="75" cy="30" r="2" fill="currentColor" className="text-success" />
                          <text x="80" y="32" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">GB (AP=0.92)</text>
                          
                          <circle cx="75" cy="40" r="2" fill="currentColor" className="text-primary" />
                          <text x="80" y="42" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">RF (AP=0.89)</text>
                          
                          <circle cx="75" cy="50" r="2" fill="currentColor" className="text-text-tertiary dark:text-text-tertiary-dark" />
                          <text x="80" y="52" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">LR (AP=0.74)</text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Residual Analysis</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Scatter points for residuals */}
                        {Array.from({ length: 50 }).map((_, i) => {
                          const x = 10 + (i * 1.6);
                          const y = 50 + (Math.sin(i * 0.5) * 10) + (Math.random() * 20 - 10);
                          return (
                            <circle 
                              key={i} 
                              cx={x} 
                              cy={y} 
                              r="1" 
                              fill="currentColor" 
                              className="text-success"
                            />
                          );
                        })}
                        
                        {/* Labels */}
                        <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Predicted Values</text>
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Residuals</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'feature-importance' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Feature Importance</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-xs">
                      <div className="flex items-center">
                        <span className="w-32 text-sm">OverallQual</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">100.0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">GrLivArea</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">87.3</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">TotalBsmtSF</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">65.1</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">GarageCars</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '58%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">58.4</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">YearBuilt</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '52%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">52.2</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">1stFlrSF</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '43%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">43.5</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">FullBath</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '36%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">36.2</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Neighborhood</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '31%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">31.8</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">SHAP Values</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Vertical axis line */}
                        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Feature labels */}
                        <text x="48" y="15" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">OverallQual</text>
                        <text x="48" y="25" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">GrLivArea</text>
                        <text x="48" y="35" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">TotalBsmtSF</text>
                        <text x="48" y="45" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">GarageCars</text>
                        <text x="48" y="55" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">YearBuilt</text>
                        <text x="48" y="65" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">1stFlrSF</text>
                        <text x="48" y="75" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">FullBath</text>
                        <text x="48" y="85" textAnchor="end" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Neighborhood</text>
                        
                        {/* SHAP values (positive) */}
                        <rect x="50" y="12" width="30" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="22" width="26" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="32" width="20" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="42" width="17" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="52" width="16" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="62" width="13" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="72" width="11" height="6" fill="currentColor" className="text-success" />
                        <rect x="50" y="82" width="9" height="6" fill="currentColor" className="text-success" />
                        
                        {/* SHAP values (negative) */}
                        <rect x="35" y="52" width="15" height="6" fill="currentColor" className="text-danger" />
                        <rect x="40" y="82" width="10" height="6" fill="currentColor" className="text-danger" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'hyperparameters' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Gradient Boosting Parameters</h3>
                  <div className="card-alt p-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      <div>
                        <h4 className="text-sm font-medium mb-xs">Learning Rate</h4>
                        <div className="flex items-center">
                          <span className="text-sm font-mono">0.05</span>
                          <div className="flex-1 mx-sm h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="bg-primary h-full rounded-full" style={{ width: '25%' }}></div>
                          </div>
                          <span className="text-sm font-mono">0.2</span>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">Optimal: 0.08</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-xs">Max Depth</h4>
                        <div className="flex items-center">
                          <span className="text-sm font-mono">3</span>
                          <div className="flex-1 mx-sm h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="bg-primary h-full rounded-full" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-sm font-mono">10</span>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">Optimal: 6</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-xs">N Estimators</h4>
                        <div className="flex items-center">
                          <span className="text-sm font-mono">50</span>
                          <div className="flex-1 mx-sm h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="bg-primary h-full rounded-full" style={{ width: '70%' }}></div>
                          </div>
                          <span className="text-sm font-mono">500</span>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">Optimal: 350</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-xs">Min Samples Split</h4>
                        <div className="flex items-center">
                          <span className="text-sm font-mono">2</span>
                          <div className="flex-1 mx-sm h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                            <div className="bg-primary h-full rounded-full" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-sm font-mono">20</span>
                        </div>
                        <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">Optimal: 8</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Hyperparameter Tuning</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Tuning Method</h4>
                      <div className="flex items-center space-x-sm mb-sm">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <span>Bayesian Optimization</span>
                      </div>
                      <div className="space-y-xs text-sm">
                        <div className="flex justify-between">
                          <span className="text-text-secondary dark:text-text-secondary-dark">Total Iterations:</span>
                          <span className="font-mono">50</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary dark:text-text-secondary-dark">Cross-validation:</span>
                          <span className="font-mono">5-fold</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary dark:text-text-secondary-dark">Scoring Metric:</span>
                          <span className="font-mono">neg_mean_squared_error</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-text-secondary dark:text-text-secondary-dark">Time Elapsed:</span>
                          <span className="font-mono">12m 34s</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Tuning Results</h4>
                      <div className="h-40 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Convergence curve */}
                            <path d="M10,70 Q20,50 30,40 Q40,30 50,25 Q60,20 70,18 Q80,17 90,16" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                            
                            {/* Points */}
                            {Array.from({ length: 10 }).map((_, i) => {
                              const x = 10 + (i * 8);
                              const y = 70 - (i * 6) + (Math.random() * 10 - 5);
                              return (
                                <circle 
                                  key={i} 
                                  cx={x} 
                                  cy={y} 
                                  r="2" 
                                  fill="currentColor" 
                                  className="text-primary"
                                />
                              );
                            })}
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Iterations</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Score</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'learning-curves' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Learning Curves</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Gradient Boosting</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Training curve */}
                            <path d="M10,80 Q30,40 50,30 Q70,20 90,15" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                            
                            {/* Validation curve */}
                            <path d="M10,80 Q30,50 50,40 Q70,35 90,32" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Training Examples</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Score</text>
                            
                            {/* Legend */}
                            <line x1="60" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary" />
                            <text x="72" y="17" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Training</text>
                            
                            <line x1="60" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                            <text x="72" y="27" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Validation</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Random Forest</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Training curve */}
                            <path d="M10,80 Q30,30 50,15 Q70,10 90,8" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                            
                            {/* Validation curve */}
                            <path d="M10,80 Q30,50 50,40 Q70,35 90,33" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Training Examples</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Score</text>
                            
                            {/* Legend */}
                            <line x1="60" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary" />
                            <text x="72" y="17" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Training</text>
                            
                            <line x1="60" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                            <text x="72" y="27" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Validation</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Validation Curve</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Training curve */}
                        <path d="M10,80 Q20,60 30,40 Q40,25 50,15 Q60,10 70,8 Q80,7 90,6" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                        
                        {/* Validation curve */}
                        <path d="M10,80 Q20,60 30,45 Q40,35 50,30 Q60,32 70,38 Q80,45 90,55" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                        
                        {/* Optimal point */}
                        <circle cx="50" cy="30" r="3" fill="currentColor" className="text-danger" />
                        <line x1="50" y1="30" x2="50" y2="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-danger" />
                        
                        {/* Labels */}
                        <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">max_depth</text>
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Score</text>
                        
                        {/* Legend */}
                        <line x1="60" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary" />
                        <text x="72" y="17" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Training</text>
                        
                        <line x1="60" y1="25" x2="70" y2="25" stroke="currentColor" strokeWidth="2" className="text-success" strokeDasharray="2" />
                        <text x="72" y="27" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Validation</text>
                      </svg>
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

export default ModelingConsole;
