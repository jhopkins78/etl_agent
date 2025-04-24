import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';

const VisualizationConsole: React.FC = () => {
  const { isLoading } = useDashboard();
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Visualization types with their icons and descriptions
  const visualizations = [
    {
      type: 'histogram',
      title: 'Histogram',
      description: 'Distribution of SalePrice',
      category: 'distribution'
    },
    {
      type: 'scatter',
      title: 'Scatter Plot',
      description: 'GrLivArea vs SalePrice',
      category: 'relationship'
    },
    {
      type: 'boxplot',
      title: 'Box Plot',
      description: 'SalePrice by Neighborhood',
      category: 'comparison'
    },
    {
      type: 'heatmap',
      title: 'Heat Map',
      description: 'Correlation Matrix',
      category: 'relationship'
    },
    {
      type: 'line',
      title: 'Line Chart',
      description: 'Price Trends by Year',
      category: 'trend'
    },
    {
      type: 'pairplot',
      title: 'Pair Plot',
      description: 'Key Feature Relationships',
      category: 'relationship'
    },
    {
      type: 'pie',
      title: 'Pie Chart',
      description: 'House Style Distribution',
      category: 'distribution'
    },
    {
      type: 'bar',
      title: 'Bar Chart',
      description: 'Average Price by Quality',
      category: 'comparison'
    },
    {
      type: 'violin',
      title: 'Violin Plot',
      description: 'Price Distribution by Type',
      category: 'distribution'
    }
  ];
  
  // Function to render visualization placeholder
  const renderVisualizationPlaceholder = (type: string, title: string, description: string) => {
    return (
      <div className="card-alt p-md h-full flex flex-col">
        <div className="flex items-center justify-between mb-sm">
          <h4 className="text-sm font-medium">{title}</h4>
          <div className="flex space-x-xs">
            <button className="p-1 rounded-md hover:bg-card dark:hover:bg-card-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </button>
            <button className="p-1 rounded-md hover:bg-card dark:hover:bg-card-dark transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center bg-card dark:bg-card-dark bg-opacity-50 dark:bg-opacity-50 rounded-xl">
          {renderVisualizationIcon(type)}
        </div>
        
        <p className="mt-sm text-xs text-text-secondary dark:text-text-secondary-dark">{description}</p>
      </div>
    );
  };
  
  // Function to render appropriate icon based on visualization type
  const renderVisualizationIcon = (type: string) => {
    switch(type) {
      case 'histogram':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'scatter':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success text-opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="8" cy="8" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="16" cy="6" r="2" />
            <circle cx="7" cy="14" r="2" />
            <circle cx="18" cy="15" r="2" />
            <circle cx="10" cy="17" r="2" />
            <circle cx="15" cy="11" r="2" />
          </svg>
        );
      case 'boxplot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-info text-opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="6" y="8" width="4" height="8" />
            <rect x="14" y="6" width="4" height="12" />
            <line x1="8" y1="4" x2="8" y2="8" />
            <line x1="8" y1="16" x2="8" y2="20" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="16" y1="18" x2="16" y2="22" />
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="14" y1="12" x2="18" y2="12" />
          </svg>
        );
      case 'heatmap':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-danger text-opacity-70" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="4" width="4" height="4" fill="currentColor" fillOpacity="0.9" />
            <rect x="10" y="4" width="4" height="4" fill="currentColor" fillOpacity="0.7" />
            <rect x="16" y="4" width="4" height="4" fill="currentColor" fillOpacity="0.3" />
            <rect x="4" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.5" />
            <rect x="10" y="10" width="4" height="4" fill="currentColor" fillOpacity="1" />
            <rect x="16" y="10" width="4" height="4" fill="currentColor" fillOpacity="0.6" />
            <rect x="4" y="16" width="4" height="4" fill="currentColor" fillOpacity="0.2" />
            <rect x="10" y="16" width="4" height="4" fill="currentColor" fillOpacity="0.4" />
            <rect x="16" y="16" width="4" height="4" fill="currentColor" fillOpacity="0.8" />
          </svg>
        );
      case 'line':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />
          </svg>
        );
      case 'pairplot':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-success text-opacity-70" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="4" height="4" stroke="currentColor" />
            <rect x="10" y="3" width="4" height="4" stroke="currentColor" />
            <rect x="17" y="3" width="4" height="4" stroke="currentColor" />
            <rect x="3" y="10" width="4" height="4" stroke="currentColor" />
            <rect x="10" y="10" width="4" height="4" stroke="currentColor" />
            <rect x="17" y="10" width="4" height="4" stroke="currentColor" />
            <rect x="3" y="17" width="4" height="4" stroke="currentColor" />
            <rect x="10" y="17" width="4" height="4" stroke="currentColor" />
            <rect x="17" y="17" width="4" height="4" stroke="currentColor" />
          </svg>
        );
      case 'pie':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-warning text-opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z" />
            <path d="M12 2v10l8.5 5" />
            <path d="M12 12l-8.5 5" />
          </svg>
        );
      case 'bar':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-info text-opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4v16" />
          </svg>
        );
      case 'violin':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-danger text-opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M12 3c-1.5 0-3 2-3 6s1.5 6 3 6 3-2 3-6-1.5-6-3-6z" />
            <path d="M12 15c-1.5 0-3 2-3 6h6c0-4-1.5-6-3-6z" />
            <path d="M12 9c-1.5 0-3-2-3-6h6c0 4-1.5 6-3 6z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-text-secondary dark:text-text-secondary-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Visualizations</h2>
        <div className="flex items-center space-x-sm">
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Custom
          </button>
          <button className="btn btn-secondary btn-sm flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export All
          </button>
        </div>
      </div>
      
      <div className="flex items-center space-x-sm mb-md overflow-x-auto pb-sm">
        <button 
          className={`px-md py-sm rounded-full text-sm whitespace-nowrap ${activeCategory === 'all' ? 'bg-primary text-white' : 'bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80'}`}
          onClick={() => setActiveCategory('all')}
        >
          All Visualizations
        </button>
        <button 
          className={`px-md py-sm rounded-full text-sm whitespace-nowrap ${activeCategory === 'distribution' ? 'bg-primary text-white' : 'bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80'}`}
          onClick={() => setActiveCategory('distribution')}
        >
          Distribution
        </button>
        <button 
          className={`px-md py-sm rounded-full text-sm whitespace-nowrap ${activeCategory === 'relationship' ? 'bg-primary text-white' : 'bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80'}`}
          onClick={() => setActiveCategory('relationship')}
        >
          Relationships
        </button>
        <button 
          className={`px-md py-sm rounded-full text-sm whitespace-nowrap ${activeCategory === 'comparison' ? 'bg-primary text-white' : 'bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80'}`}
          onClick={() => setActiveCategory('comparison')}
        >
          Comparisons
        </button>
        <button 
          className={`px-md py-sm rounded-full text-sm whitespace-nowrap ${activeCategory === 'trend' ? 'bg-primary text-white' : 'bg-card-alt dark:bg-card-alt-dark hover:bg-opacity-80'}`}
          onClick={() => setActiveCategory('trend')}
        >
          Trends
        </button>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-md text-text-secondary dark:text-text-secondary-dark">Loading visualizations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {visualizations
            .filter(viz => activeCategory === 'all' || viz.category === activeCategory)
            .map((viz, index) => (
              <div key={index} className="h-64">
                {renderVisualizationPlaceholder(viz.type, viz.title, viz.description)}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default VisualizationConsole;
