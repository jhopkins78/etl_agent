import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const InsightViewer: React.FC = () => {
  const { activeInsightTab, setActiveInsightTab, isLoading } = useDashboard();
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Full Report</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .md
          </button>
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download .pdf
          </button>
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Visuals
          </button>
        </div>
      </div>
      
      <div className="tab-container">
        <div 
          className={`tab ${activeInsightTab === 'full-report' ? 'tab-active' : ''}`}
          onClick={() => setActiveInsightTab('full-report')}
        >
          Full Report
        </div>
      </div>
      
      <div className="bg-card-alt dark:bg-card-alt-dark rounded-2xl p-lg mt-md h-[400px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading report content...</p>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <h1>Ames Housing Price Analysis</h1>
            
            <p>
              This report presents a comprehensive analysis of the Ames Housing dataset, 
              focusing on predicting home sale prices based on various property features. 
              The analysis includes exploratory data analysis, feature engineering, model 
              development, and evaluation.
            </p>
            
            <h2>Executive Summary</h2>
            
            <p>
              Our analysis of the Ames Housing dataset revealed that overall quality, 
              living area, and neighborhood are the most significant factors influencing 
              home prices. Using gradient boosting regression, we achieved an R² score of 
              0.912 on the test set, indicating that our model explains 91.2% of the 
              variance in home prices.
            </p>
            
            <h2>Dataset Overview</h2>
            
            <p>
              The Ames Housing dataset contains information on 2,930 properties sold in 
              Ames, Iowa between 2006 and 2010. The dataset includes 79 explanatory 
              variables describing various aspects of residential homes, including:
            </p>
            
            <ul>
              <li>Property size and dimensions</li>
              <li>Quality and condition ratings</li>
              <li>Building materials and finishes</li>
              <li>Room counts and types</li>
              <li>Garage and basement information</li>
              <li>Neighborhood and location data</li>
              <li>Sale conditions and prices</li>
            </ul>
            
            <h2>Methodology</h2>
            
            <p>
              Our analysis followed a structured approach:
            </p>
            
            <ol>
              <li><strong>Data Cleaning:</strong> Handled missing values, outliers, and inconsistencies</li>
              <li><strong>Exploratory Data Analysis:</strong> Examined distributions, correlations, and patterns</li>
              <li><strong>Feature Engineering:</strong> Created new features and transformed existing ones</li>
              <li><strong>Model Development:</strong> Tested multiple regression algorithms</li>
              <li><strong>Hyperparameter Tuning:</strong> Optimized model parameters</li>
              <li><strong>Evaluation:</strong> Assessed performance using cross-validation</li>
            </ol>
            
            <h2>Key Findings</h2>
            
            <p>
              Our analysis revealed several important insights:
            </p>
            
            <ul>
              <li>Overall quality is the strongest predictor of home price</li>
              <li>Above-ground living area shows a strong positive correlation with price</li>
              <li>Newer homes command significant price premiums</li>
              <li>Neighborhood location explains approximately 15% of price variation</li>
              <li>Basement quality and finished area contribute substantially to home value</li>
              <li>Garage capacity and condition have moderate impact on price</li>
            </ul>
            
            <h2>Model Performance</h2>
            
            <p>
              We evaluated several regression algorithms:
            </p>
            
            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>R² Score</th>
                  <th>RMSE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Linear Regression</td>
                  <td>0.712</td>
                  <td>$30,521</td>
                </tr>
                <tr>
                  <td>Random Forest</td>
                  <td>0.895</td>
                  <td>$18,245</td>
                </tr>
                <tr>
                  <td>Gradient Boosting</td>
                  <td>0.912</td>
                  <td>$17,854</td>
                </tr>
              </tbody>
            </table>
            
            <p>
              The gradient boosting model demonstrated superior performance and was selected 
              as our final model. Cross-validation confirmed the model's robustness across 
              different data subsets.
            </p>
            
            <h2>Recommendations</h2>
            
            <p>
              Based on our analysis, we recommend:
            </p>
            
            <ol>
              <li>Focusing renovation efforts on overall quality improvements</li>
              <li>Prioritizing kitchen and exterior quality upgrades</li>
              <li>Considering finished basement space as a high-ROI improvement</li>
              <li>Accounting for neighborhood trends in pricing strategies</li>
              <li>Using the model for automated valuation with human oversight</li>
            </ol>
            
            <h2>Conclusion</h2>
            
            <p>
              Our analysis provides a data-driven approach to understanding home price 
              determinants in the Ames market. The developed model offers accurate price 
              predictions and valuable insights for real estate professionals, homeowners, 
              and investors.
            </p>
            
            <h2>Next Steps</h2>
            
            <p>
              Future work could include:
            </p>
            
            <ul>
              <li>Incorporating external data sources (schools, crime, amenities)</li>
              <li>Developing time-series forecasting for price trends</li>
              <li>Creating neighborhood-specific models</li>
              <li>Implementing computer vision analysis of property images</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightViewer;
