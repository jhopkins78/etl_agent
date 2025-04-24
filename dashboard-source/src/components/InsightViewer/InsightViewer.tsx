import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import api, { endpoints } from '../../api';

const InsightViewer: React.FC = () => {
  const { activeInsightTab, setActiveInsightTab, isLoading, setIsLoading } = useDashboard();
  
  // State for report content
  const [reportContent, setReportContent] = useState<Record<string, string>>({
    'eda': '',
    'modeling': '',
    'evaluation': '',
    'full-report': '',
    'gpt-summary': ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  
  // Fetch report from backend
  const fetchReport = async () => {
    setError(null);
    setIsFetching(true);
    
    try {
      const response = await api.get(endpoints.getFinalReport);
      
      // Handle successful response
      console.log('Report fetched successfully:', response.data);
      
      // Update report content
      if (response.data) {
        // If the backend returns sections separately
        if (response.data.sections) {
          setReportContent({
            'eda': response.data.sections.eda || '',
            'modeling': response.data.sections.modeling || '',
            'evaluation': response.data.sections.evaluation || '',
            'full-report': response.data.fullReport || '',
            'gpt-summary': response.data.sections.gptSummary || 'GPT Summary will be available in Phase II.'
          });
        } 
        // If the backend returns just the full report as a string
        else if (typeof response.data === 'string') {
          setReportContent(prev => ({
            ...prev,
            'full-report': response.data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      setError('Failed to fetch report. Please try again.');
      
      // Set fallback content for demo purposes
      setReportContent({
        'eda': '# Exploratory Data Analysis\n\nNo data available yet. Run EDA first.',
        'modeling': '# Modeling Results\n\nNo data available yet. Run modeling first.',
        'evaluation': '# Model Evaluation\n\nNo data available yet. Run evaluation first.',
        'full-report': '# Report\n\nNo data available yet. Complete the analysis pipeline first.',
        'gpt-summary': '# GPT Summary\n\nThis feature will be available in Phase II.'
      });
    } finally {
      setIsFetching(false);
    }
  };
  
  // Fetch report when component mounts or when active tab changes
  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Insight Viewer</h2>
      
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeInsightTab === 'full-report' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveInsightTab('full-report')}
          disabled={isLoading}
        >
          Full Report
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeInsightTab === 'eda' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveInsightTab('eda')}
          disabled={isLoading}
        >
          EDA
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeInsightTab === 'modeling' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveInsightTab('modeling')}
          disabled={isLoading}
        >
          Modeling
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeInsightTab === 'evaluation' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveInsightTab('evaluation')}
          disabled={isLoading}
        >
          Evaluation
        </button>
        <button 
          className={`px-4 py-2 text-sm font-medium ${activeInsightTab === 'gpt-summary' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-primary'}`}
          onClick={() => setActiveInsightTab('gpt-summary')}
          disabled={isLoading}
        >
          GPT Summary
        </button>
      </div>
      
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
      
      {isLoading || isFetching ? (
        <div className="flex-grow overflow-auto bg-slate-50 p-4 rounded-md flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        </div>
      ) : (
        <div className="flex-grow overflow-auto bg-slate-50 p-4 rounded-md markdown-content">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {reportContent[activeInsightTab as keyof typeof reportContent]}
          </pre>
        </div>
      )}
      
      <div className="flex justify-end mt-4 space-x-2">
        <button 
          className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors flex items-center"
          onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${endpoints.getFinalReport}?format=md`, '_blank')}
          disabled={isLoading || isFetching}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .md
        </button>
        <button 
          className="px-3 py-1.5 text-sm bg-primary text-white rounded-md hover:bg-slate-600 transition-colors flex items-center"
          onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${endpoints.generatePdf}`, '_blank')}
          disabled={isLoading || isFetching}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download .pdf
        </button>
        <button 
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          onClick={() => window.open(`${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'}${endpoints.downloadVisuals}`, '_blank')}
          disabled={isLoading || isFetching}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download Visuals
        </button>
      </div>
    </div>
  );
};

export default InsightViewer;
