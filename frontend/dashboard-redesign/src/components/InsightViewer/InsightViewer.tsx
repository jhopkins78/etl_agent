import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import ReactMarkdown from 'react-markdown';

const InsightViewer: React.FC = () => {
  const { activeInsightTab, setActiveInsightTab, isLoading } = useDashboard();
  const [downloadType, setDownloadType] = useState<'md' | 'pdf' | 'visuals' | null>(null);
  
  // Tabs configuration
  const tabs = [
    { id: 'full-report', label: 'Full Report' },
    { id: 'eda', label: 'EDA' },
    { id: 'modeling', label: 'Modeling' },
    { id: 'evaluation', label: 'Evaluation' },
    { id: 'gpt-summary', label: 'GPT Summary' },
  ];
  
  // Placeholder markdown content for each tab
  const tabContent = {
    'full-report': `# Analysis Report

This dataset contains information about abalone specimens, with the goal of predicting their age based on physical measurements.

## Key Findings

* The dataset contains 4,177 samples with 8 features.
* Weight is the most important feature for predicting age.
* The Gradient Boosting model achieved the best performance with an R² of 0.76.
* Feature engineering improved model performance by 12%.

## Recommendations

Based on the analysis, we recommend using the Gradient Boosting model for production. The model should be retrained quarterly as new data becomes available.`,
    
    'eda': `# Exploratory Data Analysis

## Dataset Overview

The abalone dataset contains 4,177 samples with the following features:
* Sex (categorical: M, F, I)
* Length (continuous, mm)
* Diameter (continuous, mm)
* Height (continuous, mm)
* Whole weight (continuous, grams)
* Shucked weight (continuous, grams)
* Viscera weight (continuous, grams)
* Shell weight (continuous, grams)
* Rings (integer, +1.5 gives the age in years)

## Distribution Analysis

The age distribution is slightly right-skewed, with most specimens between 8-12 years old.

## Correlation Analysis

Strong correlations were found between:
* Length and Diameter (0.98)
* Whole weight and Shucked weight (0.97)
* All weight measurements and Age (0.54-0.63)`,
    
    'modeling': `# Modeling Process

## Feature Engineering

The following features were created:
* Weight ratios (shell_ratio, viscera_ratio)
* Volume approximation (length × diameter × height)
* Surface area approximation

## Models Evaluated

1. Linear Regression
2. Random Forest
3. Gradient Boosting
4. XGBoost
5. Neural Network

## Hyperparameter Tuning

Grid search was used for hyperparameter optimization with 5-fold cross-validation.

\`\`\`python
param_grid = {
    'n_estimators': [50, 100, 200],
    'learning_rate': [0.01, 0.1, 0.2],
    'max_depth': [3, 5, 7]
}
\`\`\``,
    
    'evaluation': `# Model Evaluation

## Performance Metrics

| Model | RMSE | MAE | R² | Training Time (s) |
|-------|------|-----|----|--------------------|
| Gradient Boosting | 2.06 | 1.49 | 0.76 | 1.24 |
| Random Forest | 2.25 | 1.62 | 0.53 | 0.87 |
| XGBoost | 2.11 | 1.52 | 0.74 | 0.95 |
| Linear Regression | 2.35 | 1.70 | 0.49 | 0.02 |
| Neural Network | 2.29 | 1.65 | 0.51 | 3.45 |

## Feature Importance

1. Weight (0.42)
2. Diameter (0.28)
3. Height (0.15)
4. Length (0.10)
5. Sex (0.05)`,
    
    'gpt-summary': `# GPT Summary

## Executive Overview

The analysis of the abalone dataset reveals that physical measurements, particularly weight-related features, are strong predictors of age. The Gradient Boosting model outperformed other approaches, achieving 76% accuracy in age prediction.

## Key Insights

* Weight is the dominant predictor of abalone age
* Feature engineering significantly improved model performance
* The relationship between physical measurements and age is non-linear
* Sex has minimal impact on age prediction accuracy

## Business Recommendations

1. Implement the Gradient Boosting model for production use
2. Focus data collection efforts on weight measurements for cost efficiency
3. Consider ensemble approaches for further accuracy improvements
4. Establish a quarterly retraining schedule as new data becomes available`,
  };
  
  // Simulate download
  const handleDownload = (type: 'md' | 'pdf' | 'visuals') => {
    setDownloadType(type);
    
    // Simulate download completion after 1.5 seconds
    setTimeout(() => {
      setDownloadType(null);
    }, 1500);
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Insight Viewer</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isLoading ? 'Generating insights...' : 'Ready'}
          </span>
          {isLoading ? (
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse-slow"></div>
          ) : (
            <div className="w-3 h-3 rounded-full bg-success"></div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-border dark:border-dark-border mb-md overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab ${activeInsightTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveInsightTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content with fade transition */}
      <div className="flex-grow overflow-auto bg-card-alt dark:bg-dark-card-alt rounded-2xl p-lg mb-md h-96 transition-all duration-300 animate-fade-in">
        <div className="markdown">
          <ReactMarkdown>
            {tabContent[activeInsightTab as keyof typeof tabContent]}
          </ReactMarkdown>
        </div>
      </div>
      
      {/* Download buttons */}
      <div className="flex flex-wrap gap-sm justify-end">
        <button 
          className={`btn ${downloadType === 'md' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleDownload('md')}
          disabled={isLoading || downloadType !== null}
        >
          {downloadType === 'md' ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download .md
            </span>
          )}
        </button>
        
        <button 
          className={`btn ${downloadType === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleDownload('pdf')}
          disabled={isLoading || downloadType !== null}
        >
          {downloadType === 'pdf' ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download .pdf
            </span>
          )}
        </button>
        
        <button 
          className={`btn ${downloadType === 'visuals' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleDownload('visuals')}
          disabled={isLoading || downloadType !== null}
        >
          {downloadType === 'visuals' ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Downloading...
            </span>
          ) : (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Visuals
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default InsightViewer;
