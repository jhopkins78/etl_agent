import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const EvaluationConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('model-evaluation');
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Evaluation</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Evaluation
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'model-evaluation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('model-evaluation')}
        >
          Model Evaluation
        </div>
        <div 
          className={`tab ${activeTab === 'prediction-analysis' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('prediction-analysis')}
        >
          Prediction Analysis
        </div>
        <div 
          className={`tab ${activeTab === 'cross-validation' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('cross-validation')}
        >
          Cross-Validation
        </div>
        <div 
          className={`tab ${activeTab === 'error-analysis' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('error-analysis')}
        >
          Error Analysis
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading evaluation results...</p>
          </div>
        ) : (
          <>
            {activeTab === 'model-evaluation' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Model Performance Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">RMSE</h4>
                        <span className="badge badge-success">Best</span>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">17,854</span>
                        <span className="text-sm text-success mb-1">-12.4%</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">vs. baseline: 30,521</p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">MAE</h4>
                        <span className="badge badge-success">Best</span>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">12,459</span>
                        <span className="text-sm text-success mb-1">-9.8%</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">vs. baseline: 24,618</p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">R²</h4>
                        <span className="badge badge-success">Best</span>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">0.912</span>
                        <span className="text-sm text-success mb-1">+28.1%</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">vs. baseline: 0.712</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Prediction vs. Actual</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Perfect prediction line */}
                        <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Scatter points */}
                        {Array.from({ length: 50 }).map((_, i) => {
                          const x = 10 + (Math.random() * 80);
                          const y = 90 - (x - 10) + (Math.random() * 20 - 10);
                          return (
                            <circle 
                              key={i} 
                              cx={x} 
                              cy={y} 
                              r="1.5" 
                              fill="currentColor" 
                              className="text-primary"
                            />
                          );
                        })}
                        
                        {/* Labels */}
                        <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Predicted Values</text>
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Actual Values</text>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Error Distribution</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="70" x2="90" y2="70" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="50" y1="90" x2="50" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Histogram bars */}
                        <rect x="15" y="65" width="5" height="5" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="20" y="60" width="5" height="10" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="25" y="50" width="5" height="20" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="30" y="40" width="5" height="30" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="35" y="30" width="5" height="40" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="40" y="20" width="5" height="50" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="45" y="15" width="5" height="55" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="50" y="15" width="5" height="55" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="55" y="20" width="5" height="50" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="60" y="30" width="5" height="40" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="65" y="40" width="5" height="30" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="70" y="50" width="5" height="20" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="75" y="60" width="5" height="10" fill="currentColor" className="text-primary opacity-70" />
                        <rect x="80" y="65" width="5" height="5" fill="currentColor" className="text-primary opacity-70" />
                        
                        {/* Normal distribution curve */}
                        <path d="M15,65 Q30,20 50,15 Q70,20 85,65" fill="none" stroke="currentColor" strokeWidth="2" className="text-success" />
                        
                        {/* Labels */}
                        <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Error</text>
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Frequency</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'prediction-analysis' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Prediction Intervals</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Prediction line */}
                        <path d="M10,70 Q30,50 50,40 Q70,30 90,20" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
                        
                        {/* Confidence intervals */}
                        <path d="M10,80 Q30,60 50,50 Q70,40 90,30" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-30" />
                        <path d="M10,60 Q30,40 50,30 Q70,20 90,10" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-30" />
                        
                        {/* Fill between confidence intervals */}
                        <path d="M10,80 Q30,60 50,50 Q70,40 90,30 L90,10 Q70,20 50,30 Q30,40 10,60 Z" fill="currentColor" className="text-primary opacity-10" />
                        
                        {/* Actual points */}
                        {Array.from({ length: 10 }).map((_, i) => {
                          const x = 10 + (i * 8);
                          const y = 70 - (i * 5) + (Math.random() * 20 - 10);
                          return (
                            <circle 
                              key={i} 
                              cx={x} 
                              cy={y} 
                              r="2" 
                              fill="currentColor" 
                              className="text-success"
                            />
                          );
                        })}
                        
                        {/* Labels */}
                        <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">Samples</text>
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Value</text>
                        
                        {/* Legend */}
                        <line x1="60" y1="15" x2="70" y2="15" stroke="currentColor" strokeWidth="2" className="text-primary" />
                        <text x="72" y="17" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Prediction</text>
                        
                        <circle cx="65" y="25" r="2" fill="currentColor" className="text-success" />
                        <text x="72" y="27" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">Actual</text>
                        
                        <rect x="60" y="32" width="10" height="5" fill="currentColor" className="text-primary opacity-10" />
                        <text x="72" y="37" fontSize="6" className="text-text-secondary dark:text-text-secondary-dark">95% CI</text>
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Prediction Analysis by Feature</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Prediction vs. OverallQual</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Box plots */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => {
                              const x = 15 + (i * 7.5);
                              const boxHeight = 20 + (i * 5);
                              const boxBottom = 90 - boxHeight;
                              const median = boxBottom + (boxHeight / 2);
                              
                              return (
                                <g key={i}>
                                  {/* Box */}
                                  <rect x={x - 3} y={boxBottom} width="6" height={boxHeight} fill="currentColor" className="text-primary opacity-20" />
                                  
                                  {/* Median line */}
                                  <line x1={x - 3} y1={median} x2={x + 3} y2={median} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  
                                  {/* Whiskers */}
                                  <line x1={x} y1={boxBottom} x2={x} y2={boxBottom - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  <line x1={x - 2} y1={boxBottom - 10} x2={x + 2} y2={boxBottom - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  
                                  <line x1={x} y1={boxBottom + boxHeight} x2={x} y2={boxBottom + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  <line x1={x - 2} y1={boxBottom + boxHeight + 10} x2={x + 2} y2={boxBottom + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                </g>
                              );
                            })}
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">OverallQual</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">SalePrice</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Prediction vs. GrLivArea</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Scatter points */}
                            {Array.from({ length: 50 }).map((_, i) => {
                              const x = 10 + (Math.random() * 80);
                              const y = 90 - (x - 10) * 0.8 + (Math.random() * 20 - 10);
                              return (
                                <circle 
                                  key={i} 
                                  cx={x} 
                                  cy={y} 
                                  r="1.5" 
                                  fill="currentColor" 
                                  className="text-primary opacity-70"
                                />
                              );
                            })}
                            
                            {/* Trend line */}
                            <line x1="10" y1="82" x2="90" y2="18" stroke="currentColor" strokeWidth="2" className="text-success" />
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">GrLivArea</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">SalePrice</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'cross-validation' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Cross-Validation Results</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="table-header">Fold</th>
                          <th className="table-header">RMSE</th>
                          <th className="table-header">MAE</th>
                          <th className="table-header">R²</th>
                          <th className="table-header">Training Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border-dark">
                        <tr className="table-row-hover">
                          <td className="table-cell">Fold 1</td>
                          <td className="table-cell table-cell-numeric">17,854</td>
                          <td className="table-cell table-cell-numeric">12,459</td>
                          <td className="table-cell table-cell-numeric">0.912</td>
                          <td className="table-cell table-cell-numeric">3.2s</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">Fold 2</td>
                          <td className="table-cell table-cell-numeric">18,245</td>
                          <td className="table-cell table-cell-numeric">13,102</td>
                          <td className="table-cell table-cell-numeric">0.895</td>
                          <td className="table-cell table-cell-numeric">2.8s</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">Fold 3</td>
                          <td className="table-cell table-cell-numeric">17,932</td>
                          <td className="table-cell table-cell-numeric">12,876</td>
                          <td className="table-cell table-cell-numeric">0.903</td>
                          <td className="table-cell table-cell-numeric">3.1s</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">Fold 4</td>
                          <td className="table-cell table-cell-numeric">18,102</td>
                          <td className="table-cell table-cell-numeric">12,743</td>
                          <td className="table-cell table-cell-numeric">0.908</td>
                          <td className="table-cell table-cell-numeric">3.0s</td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">Fold 5</td>
                          <td className="table-cell table-cell-numeric">17,965</td>
                          <td className="table-cell table-cell-numeric">12,582</td>
                          <td className="table-cell table-cell-numeric">0.910</td>
                          <td className="table-cell table-cell-numeric">3.3s</td>
                        </tr>
                        <tr className="table-row-hover font-medium">
                          <td className="table-cell">Mean</td>
                          <td className="table-cell table-cell-numeric">18,019</td>
                          <td className="table-cell table-cell-numeric">12,752</td>
                          <td className="table-cell table-cell-numeric">0.906</td>
                          <td className="table-cell table-cell-numeric">3.1s</td>
                        </tr>
                        <tr className="table-row-hover text-text-secondary dark:text-text-secondary-dark">
                          <td className="table-cell">Std</td>
                          <td className="table-cell table-cell-numeric">±154</td>
                          <td className="table-cell table-cell-numeric">±248</td>
                          <td className="table-cell table-cell-numeric">±0.007</td>
                          <td className="table-cell table-cell-numeric">±0.2s</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Cross-Validation Stability</h3>
                  <div className="card-alt p-md h-64 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Axes */}
                        <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                        
                        {/* Box plots for each metric */}
                        {['RMSE', 'MAE', 'R²'].map((_, i) => {
                          const x = 25 + (i * 25);
                          const boxHeight = 30;
                          const boxBottom = 60;
                          const median = boxBottom + (boxHeight / 2);
                          
                          return (
                            <g key={i}>
                              {/* Box */}
                              <rect x={x - 5} y={boxBottom} width="10" height={boxHeight} fill="currentColor" className="text-primary opacity-20" />
                              
                              {/* Median line */}
                              <line x1={x - 5} y1={median} x2={x + 5} y2={median} stroke="currentColor" strokeWidth="1" className="text-primary" />
                              
                              {/* Whiskers */}
                              <line x1={x} y1={boxBottom} x2={x} y2={boxBottom - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                              <line x1={x - 3} y1={boxBottom - 10} x2={x + 3} y2={boxBottom - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                              
                              <line x1={x} y1={boxBottom + boxHeight} x2={x} y2={boxBottom + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                              <line x1={x - 3} y1={boxBottom + boxHeight + 10} x2={x + 3} y2={boxBottom + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                              
                              {/* Label */}
                              <text x={x} y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">
                                {['RMSE', 'MAE', 'R²'][i]}
                              </text>
                            </g>
                          );
                        })}
                        
                        {/* Y-axis label */}
                        <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Normalized Score</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'error-analysis' && (
              <div className="space-y-lg">
                <div>
                  <h3 className="text-md font-medium mb-sm">Error Analysis by Feature</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Error vs. OverallQual</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Box plots */}
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => {
                              const x = 15 + (i * 7.5);
                              const boxHeight = 20;
                              const boxBottom = 50 - (boxHeight / 2);
                              const median = boxBottom + (boxHeight / 2);
                              const offset = (i % 3 - 1) * 5;
                              
                              return (
                                <g key={i}>
                                  {/* Box */}
                                  <rect x={x - 3} y={boxBottom + offset} width="6" height={boxHeight} fill="currentColor" className="text-primary opacity-20" />
                                  
                                  {/* Median line */}
                                  <line x1={x - 3} y1={median + offset} x2={x + 3} y2={median + offset} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  
                                  {/* Whiskers */}
                                  <line x1={x} y1={boxBottom + offset} x2={x} y2={boxBottom + offset - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  <line x1={x - 2} y1={boxBottom + offset - 10} x2={x + 2} y2={boxBottom + offset - 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  
                                  <line x1={x} y1={boxBottom + offset + boxHeight} x2={x} y2={boxBottom + offset + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                  <line x1={x - 2} y1={boxBottom + offset + boxHeight + 10} x2={x + 2} y2={boxBottom + offset + boxHeight + 10} stroke="currentColor" strokeWidth="1" className="text-primary" />
                                </g>
                              );
                            })}
                            
                            {/* Zero line */}
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-success" />
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">OverallQual</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Error</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Error vs. YearBuilt</h4>
                      <div className="h-48 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            {/* Axes */}
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            <line x1="10" y1="90" x2="10" y2="10" stroke="currentColor" strokeWidth="1" className="text-text-tertiary dark:text-text-tertiary-dark" />
                            
                            {/* Scatter points */}
                            {Array.from({ length: 50 }).map((_, i) => {
                              const x = 10 + (Math.random() * 80);
                              const y = 50 + (Math.sin(x * 0.1) * 10) + (Math.random() * 20 - 10);
                              return (
                                <circle 
                                  key={i} 
                                  cx={x} 
                                  cy={y} 
                                  r="1.5" 
                                  fill="currentColor" 
                                  className="text-primary opacity-70"
                                />
                              );
                            })}
                            
                            {/* Trend line */}
                            <path d="M10,60 Q30,45 50,50 Q70,55 90,40" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger" />
                            
                            {/* Zero line */}
                            <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="2" className="text-success" />
                            
                            {/* Labels */}
                            <text x="50" y="98" textAnchor="middle" fontSize="8" className="text-text-secondary dark:text-text-secondary-dark">YearBuilt</text>
                            <text x="5" y="50" textAnchor="middle" fontSize="8" transform="rotate(-90, 5, 50)" className="text-text-secondary dark:text-text-secondary-dark">Error</text>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Top Errors</h3>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="table-header">ID</th>
                          <th className="table-header">Actual</th>
                          <th className="table-header">Predicted</th>
                          <th className="table-header">Error</th>
                          <th className="table-header">Error %</th>
                          <th className="table-header">Key Features</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border dark:divide-border-dark">
                        <tr className="table-row-hover">
                          <td className="table-cell">1234</td>
                          <td className="table-cell table-cell-numeric">350,000</td>
                          <td className="table-cell table-cell-numeric">275,450</td>
                          <td className="table-cell table-cell-numeric text-danger">-74,550</td>
                          <td className="table-cell table-cell-numeric text-danger">-21.3%</td>
                          <td className="table-cell">
                            <div className="flex items-center space-x-xs">
                              <span className="badge badge-sm badge-neutral">Pool</span>
                              <span className="badge badge-sm badge-neutral">Remodeled</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">2567</td>
                          <td className="table-cell table-cell-numeric">180,000</td>
                          <td className="table-cell table-cell-numeric">231,200</td>
                          <td className="table-cell table-cell-numeric text-success">+51,200</td>
                          <td className="table-cell table-cell-numeric text-success">+28.4%</td>
                          <td className="table-cell">
                            <div className="flex items-center space-x-xs">
                              <span className="badge badge-sm badge-neutral">Corner Lot</span>
                              <span className="badge badge-sm badge-neutral">Old</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">3891</td>
                          <td className="table-cell table-cell-numeric">425,000</td>
                          <td className="table-cell table-cell-numeric">378,900</td>
                          <td className="table-cell table-cell-numeric text-danger">-46,100</td>
                          <td className="table-cell table-cell-numeric text-danger">-10.8%</td>
                          <td className="table-cell">
                            <div className="flex items-center space-x-xs">
                              <span className="badge badge-sm badge-neutral">Fireplace</span>
                              <span className="badge badge-sm badge-neutral">Large Garage</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">4102</td>
                          <td className="table-cell table-cell-numeric">290,000</td>
                          <td className="table-cell table-cell-numeric">335,600</td>
                          <td className="table-cell table-cell-numeric text-success">+45,600</td>
                          <td className="table-cell table-cell-numeric text-success">+15.7%</td>
                          <td className="table-cell">
                            <div className="flex items-center space-x-xs">
                              <span className="badge badge-sm badge-neutral">Near School</span>
                              <span className="badge badge-sm badge-neutral">New Roof</span>
                            </div>
                          </td>
                        </tr>
                        <tr className="table-row-hover">
                          <td className="table-cell">5743</td>
                          <td className="table-cell table-cell-numeric">520,000</td>
                          <td className="table-cell table-cell-numeric">478,200</td>
                          <td className="table-cell table-cell-numeric text-danger">-41,800</td>
                          <td className="table-cell table-cell-numeric text-danger">-8.0%</td>
                          <td className="table-cell">
                            <div className="flex items-center space-x-xs">
                              <span className="badge badge-sm badge-neutral">Waterfront</span>
                              <span className="badge badge-sm badge-neutral">Small Lot</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default EvaluationConsole;
