import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const ModelLeaderboard: React.FC = () => {
  const { isLoading } = useDashboard();
  const [expandedModel, setExpandedModel] = useState<string | null>(null);
  
  // Sample model data
  const models = [
    { 
      id: 'xgb', 
      name: 'XGBoost', 
      rmse: 17682, 
      mae: 12459, 
      r2: 0.912, 
      trainingTime: '3.2s',
      tuned: true,
      bestParams: { learning_rate: 0.05, max_depth: 5, n_estimators: 180 },
      isBest: true
    },
    { 
      id: 'rf', 
      name: 'Random Forest', 
      rmse: 19245, 
      mae: 13589, 
      r2: 0.897, 
      trainingTime: '2.8s',
      tuned: true,
      bestParams: { max_depth: 12, n_estimators: 100, min_samples_split: 5 },
      isBest: false
    },
    { 
      id: 'ridge', 
      name: 'Ridge Regression', 
      rmse: 21876, 
      mae: 15214, 
      r2: 0.865, 
      trainingTime: '0.5s',
      tuned: true,
      bestParams: { alpha: 0.8 },
      isBest: false
    },
    { 
      id: 'lasso', 
      name: 'Lasso Regression', 
      rmse: 22543, 
      mae: 15789, 
      r2: 0.854, 
      trainingTime: '0.6s',
      tuned: true,
      bestParams: { alpha: 0.001 },
      isBest: false
    },
    { 
      id: 'linear', 
      name: 'Linear Regression', 
      rmse: 24982, 
      mae: 17654, 
      r2: 0.823, 
      trainingTime: '0.3s',
      tuned: false,
      bestParams: {},
      isBest: false
    }
  ];
  
  const toggleModelExpand = (modelId: string) => {
    if (expandedModel === modelId) {
      setExpandedModel(null);
    } else {
      setExpandedModel(modelId);
    }
  };
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Model Leaderboard</h2>
        <div className="flex items-center space-x-sm">
          <span className="badge badge-primary">Best: XGBoost</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Training models...</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="table-header">Model</th>
                <th className="table-header">RMSE</th>
                <th className="table-header">MAE</th>
                <th className="table-header">R²</th>
                <th className="table-header">Training Time</th>
                <th className="table-header">Tuned?</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-border-dark">
              {models.map((model) => (
                <React.Fragment key={model.id}>
                  <tr 
                    className={`model-row ${expandedModel === model.id ? 'model-row-expanded' : ''}`}
                    onClick={() => toggleModelExpand(model.id)}
                  >
                    <td className="table-cell">
                      <div className="flex items-center">
                        {model.isBest && (
                          <span className="w-2 h-2 bg-success rounded-full mr-sm"></span>
                        )}
                        <span className={model.isBest ? 'font-semibold' : ''}>{model.name}</span>
                      </div>
                    </td>
                    <td className="table-cell table-cell-numeric">
                      <span className={model.isBest ? 'text-success font-semibold' : ''}>
                        {model.rmse.toLocaleString()}
                      </span>
                    </td>
                    <td className="table-cell table-cell-numeric">{model.mae.toLocaleString()}</td>
                    <td className="table-cell table-cell-numeric">
                      <span className={model.isBest ? 'text-success font-semibold' : ''}>
                        {model.r2.toFixed(3)}
                      </span>
                    </td>
                    <td className="table-cell">{model.trainingTime}</td>
                    <td className="table-cell">
                      {model.tuned ? (
                        <span className="badge badge-success">Yes</span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`h-5 w-5 text-text-secondary dark:text-text-secondary-dark transition-transform ${expandedModel === model.id ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </td>
                  </tr>
                  
                  {expandedModel === model.id && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="model-details">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                            <div>
                              <h3 className="text-md font-medium mb-sm">Learning Curve</h3>
                              <div className="h-48 bg-card dark:bg-card-dark rounded-xl p-md">
                                <div className="h-full relative">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-full h-full">
                                      <line x1="10" y1="90" x2="90" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-text-tertiary dark:text-text-tertiary-dark" />
                                      <line x1="10" y1="10" x2="10" y2="90" stroke="currentColor" strokeWidth="0.5" className="text-text-tertiary dark:text-text-tertiary-dark" />
                                      
                                      {/* Training error line */}
                                      <path 
                                        d="M10,70 C20,60 30,40 40,30 C50,25 60,22 70,20 C80,18 90,17 90,17" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        className="text-primary" 
                                      />
                                      
                                      {/* Validation error line */}
                                      <path 
                                        d="M10,80 C20,70 30,50 40,45 C50,40 60,38 70,37 C80,36 90,35 90,35" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        className="text-warning" 
                                        strokeDasharray="4" 
                                      />
                                      
                                      {/* Legend */}
                                      <circle cx="15" cy="15" r="2" className="fill-primary" />
                                      <circle cx="35" cy="15" r="2" className="fill-warning" />
                                    </svg>
                                  </div>
                                </div>
                                <div className="flex justify-between text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">
                                  <span>Training Error</span>
                                  <span>Validation Error</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-md font-medium mb-sm">Best Parameters</h3>
                              {model.tuned ? (
                                <div className="bg-card dark:bg-card-dark rounded-xl p-md h-48 overflow-y-auto">
                                  <div className="space-y-xs">
                                    {Object.entries(model.bestParams).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-sm font-mono">{key}:</span>
                                        <span className="text-sm font-mono text-primary dark:text-primary-light">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="bg-card dark:bg-card-dark rounded-xl p-md h-48 flex items-center justify-center">
                                  <p className="text-text-secondary dark:text-text-secondary-dark">No tuning performed</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ModelLeaderboard;
