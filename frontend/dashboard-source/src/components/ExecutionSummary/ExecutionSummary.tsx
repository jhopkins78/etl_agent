import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const ExecutionSummary: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeTab, setActiveTab] = useState('summary');
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Execution Summary</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Summary
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeTab === 'summary' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Executive Summary
        </div>
        <div 
          className={`tab ${activeTab === 'findings' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('findings')}
        >
          Key Findings
        </div>
        <div 
          className={`tab ${activeTab === 'recommendations' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Recommendations
        </div>
        <div 
          className={`tab ${activeTab === 'next-steps' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('next-steps')}
        >
          Next Steps
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[500px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Generating execution summary...</p>
          </div>
        ) : (
          <>
            {activeTab === 'summary' && (
              <div className="space-y-md">
                <div>
                  <h3 className="text-md font-medium mb-sm">Project Overview</h3>
                  <p className="text-sm leading-relaxed">
                    This analysis examined the Ames Housing dataset to develop a predictive model for home prices. 
                    The dataset contains 79 explanatory variables describing various aspects of residential homes. 
                    Our objective was to identify key factors influencing home prices and build an accurate 
                    prediction model to estimate property values based on these features.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Methodology</h3>
                  <p className="text-sm leading-relaxed">
                    We employed a systematic approach including exploratory data analysis, feature engineering, 
                    and model development. Multiple regression algorithms were evaluated, with gradient boosting 
                    emerging as the top performer. Cross-validation was used to ensure model robustness, and 
                    hyperparameter tuning was performed to optimize model performance.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Results Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">Model Accuracy</h4>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">91.2%</span>
                        <span className="text-sm text-success mb-1">+28.1%</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">R² score on test data</p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">Error Rate</h4>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">$17,854</span>
                        <span className="text-sm text-success mb-1">-41.5%</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">RMSE on test data</p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <div className="flex items-center justify-between mb-xs">
                        <h4 className="text-sm font-medium">Top Feature</h4>
                      </div>
                      <div className="flex items-end space-x-xs">
                        <span className="text-2xl font-mono font-semibold">OverallQual</span>
                      </div>
                      <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">100% relative importance</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Business Impact</h3>
                  <p className="text-sm leading-relaxed">
                    The developed model provides accurate home price predictions with an R² of 0.912, 
                    explaining 91.2% of price variation. This represents a significant improvement over 
                    baseline models and can be leveraged for various business applications including 
                    property valuation, investment analysis, and market trend forecasting.
                  </p>
                </div>
              </div>
            )}
            
            {activeTab === 'findings' && (
              <div className="space-y-md">
                <div>
                  <h3 className="text-md font-medium mb-sm">Key Drivers of Home Prices</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-xs">
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Overall Quality</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">100.0</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Living Area</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '87%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">87.3</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Basement Size</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">65.1</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Garage Capacity</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '58%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">58.4</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32 text-sm">Year Built</span>
                        <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="bg-success h-full rounded-full" style={{ width: '52%' }}></div>
                        </div>
                        <span className="ml-sm text-sm font-mono">52.2</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Data Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Price Distribution</h4>
                      <p className="text-sm leading-relaxed">
                        Home prices follow a right-skewed distribution with a median of $180,000 and mean of $215,000, 
                        indicating the presence of high-value outliers. The majority of homes (68%) fall within the 
                        $150,000 to $250,000 range.
                      </p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Neighborhood Impact</h4>
                      <p className="text-sm leading-relaxed">
                        Significant price variation exists between neighborhoods, with NorthRidge Heights commanding 
                        the highest premium (+45% above average) and Old Town showing the lowest values (-32% below average).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Model Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Algorithm Comparison</h4>
                      <div className="table-container">
                        <table className="table text-sm">
                          <thead>
                            <tr>
                              <th className="table-header">Model</th>
                              <th className="table-header">R²</th>
                              <th className="table-header">RMSE</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border dark:divide-border-dark">
                            <tr className="table-row-hover">
                              <td className="table-cell">Gradient Boosting</td>
                              <td className="table-cell table-cell-numeric">0.912</td>
                              <td className="table-cell table-cell-numeric">17,854</td>
                            </tr>
                            <tr className="table-row-hover">
                              <td className="table-cell">Random Forest</td>
                              <td className="table-cell table-cell-numeric">0.895</td>
                              <td className="table-cell table-cell-numeric">18,245</td>
                            </tr>
                            <tr className="table-row-hover">
                              <td className="table-cell">Linear Regression</td>
                              <td className="table-cell table-cell-numeric">0.712</td>
                              <td className="table-cell table-cell-numeric">30,521</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Error Analysis</h4>
                      <p className="text-sm leading-relaxed">
                        The model performs well across most price ranges but shows increased error rates for homes 
                        above $400,000 (average error: 12.4%) and homes with unusual features such as pools or 
                        waterfront properties (average error: 18.7%).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'recommendations' && (
              <div className="space-y-md">
                <div>
                  <h3 className="text-md font-medium mb-sm">Model Selection</h3>
                  <div className="card-alt p-md">
                    <p className="text-sm leading-relaxed">
                      Based on comprehensive evaluation, we recommend implementing the Gradient Boosting model 
                      with the optimized hyperparameters (learning rate: 0.08, max depth: 6, n_estimators: 350). 
                      This model provides the best balance of accuracy (R² = 0.912) and interpretability, with 
                      clear feature importance rankings that align with domain knowledge.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Feature Engineering</h3>
                  <div className="card-alt p-md">
                    <p className="text-sm leading-relaxed mb-sm">
                      We recommend incorporating the following engineered features to further improve model performance:
                    </p>
                    <ul className="list-disc pl-md space-y-xs text-sm">
                      <li>Total Quality Score: Composite of OverallQual, ExterQual, and KitchenQual</li>
                      <li>Age at Sale: Difference between YrSold and YearBuilt</li>
                      <li>Total Bathroom Count: Sum of all bathroom-related features</li>
                      <li>Neighborhood Price Index: Relative price level of each neighborhood</li>
                      <li>Renovation Impact: Interaction between YearRemodAdd and OverallQual</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Model Deployment</h3>
                  <div className="card-alt p-md">
                    <p className="text-sm leading-relaxed mb-sm">
                      For optimal deployment, we recommend:
                    </p>
                    <ul className="list-disc pl-md space-y-xs text-sm">
                      <li>Implementing a model versioning system to track performance over time</li>
                      <li>Setting up automated retraining pipeline with new data (quarterly frequency)</li>
                      <li>Developing a simple API endpoint for integration with existing systems</li>
                      <li>Creating a monitoring dashboard to track prediction accuracy</li>
                      <li>Establishing alert thresholds for model drift detection</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Business Applications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Property Valuation</h4>
                      <p className="text-sm leading-relaxed">
                        Integrate the model into the property valuation workflow to provide data-driven price 
                        estimates alongside traditional appraisal methods, potentially reducing valuation time 
                        by 40% and improving accuracy by 15%.
                      </p>
                    </div>
                    
                    <div className="card-alt p-md">
                      <h4 className="text-sm font-medium mb-xs">Investment Analysis</h4>
                      <p className="text-sm leading-relaxed">
                        Use the model to identify undervalued properties by comparing predicted values with 
                        listing prices, focusing on properties where the model predicts values at least 8% 
                        higher than current asking prices.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'next-steps' && (
              <div className="space-y-md">
                <div>
                  <h3 className="text-md font-medium mb-sm">Immediate Actions</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-sm">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mr-sm">1</div>
                        <span className="text-sm">Finalize model selection and hyperparameter configuration</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mr-sm">2</div>
                        <span className="text-sm">Implement recommended feature engineering improvements</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mr-sm">3</div>
                        <span className="text-sm">Develop model deployment pipeline with versioning</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mr-sm">4</div>
                        <span className="text-sm">Create API documentation and integration examples</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white mr-sm">5</div>
                        <span className="text-sm">Set up monitoring dashboard for production model</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Future Enhancements</h3>
                  <div className="card-alt p-md">
                    <div className="space-y-sm">
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center border border-primary text-primary mr-sm mt-xs">A</div>
                        <div>
                          <h4 className="text-sm font-medium">External Data Integration</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                            Incorporate neighborhood amenities, school ratings, and crime statistics to improve predictions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center border border-primary text-primary mr-sm mt-xs">B</div>
                        <div>
                          <h4 className="text-sm font-medium">Time Series Forecasting</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                            Develop models to predict future price trends by neighborhood and property type
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-card flex items-center justify-center border border-primary text-primary mr-sm mt-xs">C</div>
                        <div>
                          <h4 className="text-sm font-medium">Computer Vision Integration</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark">
                            Extract features from property images to capture aspects not present in structured data
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-sm">Timeline</h3>
                  <div className="card-alt p-md">
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute top-0 bottom-0 left-6 w-px bg-border dark:bg-border-dark"></div>
                      
                      {/* Timeline items */}
                      <div className="space-y-md pl-lg">
                        <div className="relative">
                          <div className="absolute top-0 left-[-1.5rem] w-3 h-3 rounded-full bg-success"></div>
                          <h4 className="text-sm font-medium">Week 1-2: Model Finalization</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">
                            Complete feature engineering and final model selection
                          </p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute top-0 left-[-1.5rem] w-3 h-3 rounded-full bg-primary"></div>
                          <h4 className="text-sm font-medium">Week 3-4: Deployment Pipeline</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">
                            Develop API, documentation, and integration examples
                          </p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute top-0 left-[-1.5rem] w-3 h-3 rounded-full bg-text-tertiary dark:bg-text-tertiary-dark"></div>
                          <h4 className="text-sm font-medium">Week 5-6: Monitoring Setup</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">
                            Implement monitoring dashboard and alert system
                          </p>
                        </div>
                        
                        <div className="relative">
                          <div className="absolute top-0 left-[-1.5rem] w-3 h-3 rounded-full bg-text-tertiary dark:bg-text-tertiary-dark"></div>
                          <h4 className="text-sm font-medium">Week 7-8: Business Integration</h4>
                          <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-xs">
                            Train users and integrate with existing business processes
                          </p>
                        </div>
                      </div>
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

export default ExecutionSummary;
