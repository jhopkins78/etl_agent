import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

interface ModelData {
  id: number;
  name: string;
  rmse: number;
  mae: number;
  r2: number;
  trainingTime: number;
  isTuned: boolean;
  bestParams: Record<string, any>;
}

const ModelLeaderboard: React.FC = () => {
  const { isLoading } = useDashboard();
  const [expandedModel, setExpandedModel] = useState<number | null>(null);
  
  // Sample model data
  const models: ModelData[] = [
    {
      id: 1,
      name: 'Gradient Boosting',
      rmse: 2.06,
      mae: 1.49,
      r2: 0.76,
      trainingTime: 1.24,
      isTuned: true,
      bestParams: {
        n_estimators: 200,
        learning_rate: 0.1,
        max_depth: 5,
        min_samples_split: 2,
        subsample: 0.8
      }
    },
    {
      id: 2,
      name: 'Random Forest',
      rmse: 2.25,
      mae: 1.62,
      r2: 0.53,
      trainingTime: 0.87,
      isTuned: false,
      bestParams: {
        n_estimators: 100,
        max_depth: 10,
        min_samples_split: 2,
        min_samples_leaf: 1
      }
    },
    {
      id: 3,
      name: 'XGBoost',
      rmse: 2.11,
      mae: 1.52,
      r2: 0.74,
      trainingTime: 0.95,
      isTuned: true,
      bestParams: {
        n_estimators: 150,
        learning_rate: 0.05,
        max_depth: 6,
        subsample: 0.9,
        colsample_bytree: 0.8
      }
    },
    {
      id: 4,
      name: 'Linear Regression',
      rmse: 2.35,
      mae: 1.70,
      r2: 0.49,
      trainingTime: 0.02,
      isTuned: false,
      bestParams: {}
    },
    {
      id: 5,
      name: 'Neural Network',
      rmse: 2.29,
      mae: 1.65,
      r2: 0.51,
      trainingTime: 3.45,
      isTuned: true,
      bestParams: {
        hidden_layer_sizes: [64, 32],
        activation: 'relu',
        solver: 'adam',
        alpha: 0.0001,
        learning_rate: 'adaptive'
      }
    }
  ];
  
  // Sort models by R² (best first)
  const sortedModels = [...models].sort((a, b) => b.r2 - a.r2);
  
  // Toggle model expansion
  const toggleModelExpansion = (modelId: number) => {
    if (expandedModel === modelId) {
      setExpandedModel(null);
    } else {
      setExpandedModel(modelId);
    }
  };
  
  // Format parameter value for display
  const formatParamValue = (value: any) => {
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`;
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return `"${value}"`;
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Model Leaderboard</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isLoading ? 'Evaluating models...' : `${models.length} models`}
          </span>
          {isLoading ? (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-slow"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-success"></div>
          )}
        </div>
      </div>
      
      {/* Best model highlight */}
      <div className="mb-lg">
        <div className="bg-success bg-opacity-5 border border-success border-opacity-20 rounded-2xl p-md">
          <div className="flex items-center mb-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success mr-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-success">Best Performing Model</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-xs">Model</p>
              <p className="font-semibold">{sortedModels[0].name}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-xs">R² Score</p>
              <p className="font-mono font-semibold">{sortedModels[0].r2.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-xs">RMSE</p>
              <p className="font-mono font-semibold">{sortedModels[0].rmse.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Model comparison table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-dark-border">
          <thead>
            <tr>
              <th className="table-header text-left">Model</th>
              <th className="table-header text-right">RMSE</th>
              <th className="table-header text-right">MAE</th>
              <th className="table-header text-right">R²</th>
              <th className="table-header text-right">Training Time (s)</th>
              <th className="table-header text-center">Tuned?</th>
              <th className="table-header text-center">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border dark:divide-dark-border">
            {sortedModels.map((model, index) => (
              <React.Fragment key={model.id}>
                <tr 
                  className={`model-row ${expandedModel === model.id ? 'model-row-expanded' : ''} ${index === 0 ? 'bg-success bg-opacity-5' : ''}`}
                  onClick={() => toggleModelExpansion(model.id)}
                >
                  <td className="table-cell font-medium">
                    <div className="flex items-center">
                      {index === 0 && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success mr-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {model.name}
                    </div>
                  </td>
                  <td className="table-cell table-cell-numeric">{model.rmse.toFixed(2)}</td>
                  <td className="table-cell table-cell-numeric">{model.mae.toFixed(2)}</td>
                  <td className="table-cell table-cell-numeric">{model.r2.toFixed(2)}</td>
                  <td className="table-cell table-cell-numeric">{model.trainingTime.toFixed(2)}</td>
                  <td className="table-cell text-center">
                    {model.isTuned ? (
                      <span className="badge badge-success">Yes</span>
                    ) : (
                      <span className="badge badge-neutral">No</span>
                    )}
                  </td>
                  <td className="table-cell text-center">
                    <button className="btn btn-tertiary p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedModel === model.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details */}
                {expandedModel === model.id && (
                  <tr>
                    <td colSpan={7} className="p-0">
                      <div className="model-details animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                          {/* Learning curve visualization */}
                          <div>
                            <h4 className="font-medium mb-sm">Learning Curve</h4>
                            <div className="aspect-video bg-card dark:bg-dark-card rounded-xl flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-tertiary dark:text-dark-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Best parameters */}
                          <div>
                            <h4 className="font-medium mb-sm">Best Parameters</h4>
                            {Object.keys(model.bestParams).length > 0 ? (
                              <div className="bg-card dark:bg-dark-card rounded-xl p-md font-mono text-sm overflow-auto max-h-48">
                                <pre className="text-text-primary dark:text-dark-text-primary">
                                  {`{\n${Object.entries(model.bestParams)
                                    .map(([key, value]) => `  "${key}": ${formatParamValue(value)}`)
                                    .join(',\n')}\n}`}
                                </pre>
                              </div>
                            ) : (
                              <div className="bg-card dark:bg-dark-card rounded-xl p-md text-text-secondary dark:text-dark-text-secondary flex items-center justify-center h-48">
                                <p>No hyperparameter tuning performed</p>
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
      
      <div className="mt-lg pt-md border-t border-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            <span>Click on a model row to see details</span>
          </div>
          <button className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelLeaderboard;
