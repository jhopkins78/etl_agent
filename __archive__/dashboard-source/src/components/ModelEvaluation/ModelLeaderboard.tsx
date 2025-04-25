import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import api, { endpoints } from '../../api';

type ModelLeaderboardEntry = {
  model: string;
  rmse: number;
  mae: number;
  r2: number;
  training_time: number;
  tuned: boolean;
  best_parameters: string;
  learning_curve_path?: string;
};

const ModelLeaderboard: React.FC = () => {
  const { isLoading, setIsLoading } = useDashboard();
  const [leaderboardData, setLeaderboardData] = useState<ModelLeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  // Fetch leaderboard data from backend
  const fetchLeaderboardData = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.get(endpoints.getModelLeaderboard);
      
      // Handle successful response
      console.log('Leaderboard data fetched successfully:', response.data);
      
      if (response.data && Array.isArray(response.data)) {
        setLeaderboardData(response.data);
      } else {
        // Set fallback data for demo purposes
        setLeaderboardData([
          {
            model: 'SVR',
            rmse: 2.17,
            mae: 1.49,
            r2: 0.56,
            training_time: 5.13,
            tuned: true,
            best_parameters: "{'C': 10.0, 'epsilon': 0.2, 'kernel': 'rbf'}",
            learning_curve_path: '/reports/visuals/learning_curves/SVR_learning_curve.png'
          },
          {
            model: 'Ridge',
            rmse: 2.21,
            mae: 1.59,
            r2: 0.55,
            training_time: 0.04,
            tuned: true,
            best_parameters: "{'alpha': 1.0}",
            learning_curve_path: '/reports/visuals/learning_curves/Ridge_learning_curve.png'
          },
          {
            model: 'Random Forest',
            rmse: 2.25,
            mae: 1.62,
            r2: 0.53,
            training_time: 0.87,
            tuned: true,
            best_parameters: "{'max_depth': 10, 'n_estimators': 100}",
            learning_curve_path: '/reports/visuals/learning_curves/RandomForest_learning_curve.png'
          },
          {
            model: 'Gradient Boosting',
            rmse: 2.30,
            mae: 1.65,
            r2: 0.51,
            training_time: 1.24,
            tuned: true,
            best_parameters: "{'learning_rate': 0.1, 'max_depth': 3, 'n_estimators': 100}",
            learning_curve_path: '/reports/visuals/learning_curves/GradientBoosting_learning_curve.png'
          },
          {
            model: 'Linear Regression',
            rmse: 2.35,
            mae: 1.70,
            r2: 0.49,
            training_time: 0.02,
            tuned: false,
            best_parameters: "{}",
            learning_curve_path: '/reports/visuals/learning_curves/LinearRegression_learning_curve.png'
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setError('Failed to fetch model leaderboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch leaderboard data when component mounts
  useEffect(() => {
    fetchLeaderboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle expanded model
  const toggleExpandModel = (model: string) => {
    if (expandedModel === model) {
      setExpandedModel(null);
    } else {
      setExpandedModel(model);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Model Leaderboard</h2>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RMSE
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MAE
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  R²
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Training Time (s)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tuned?
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaderboardData.map((entry, index) => (
                <React.Fragment key={entry.model}>
                  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {entry.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.rmse.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.mae.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.r2.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.training_time.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.tuned ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          No
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => toggleExpandModel(entry.model)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        {expandedModel === entry.model ? 'Hide Details' : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedModel === entry.model && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Best Parameters:</h4>
                          <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                            {entry.best_parameters}
                          </pre>
                          
                          {entry.learning_curve_path && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">Learning Curve:</h4>
                              <div className="flex justify-center">
                                <img 
                                  src={`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${entry.learning_curve_path}`} 
                                  alt={`${entry.model} Learning Curve`}
                                  className="max-w-full h-auto"
                                  onError={(e) => {
                                    // Fallback for missing images
                                    const target = e.target as HTMLImageElement;
                                    target.src = 'https://via.placeholder.com/400x300?text=Learning+Curve+Not+Available';
                                  }}
                                />
                              </div>
                            </div>
                          )}
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
