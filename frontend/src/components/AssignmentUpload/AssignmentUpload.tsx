import React from 'react';
import { useDashboard } from '../../context/DashboardContext';

const AssignmentUpload: React.FC = () => {
  const { isLoading } = useDashboard();
  
  return (
    <div className="card h-full">
      <div className="flex items-center justify-between mb-md">
        <h2 className="text-lg font-semibold">Assignment Upload</h2>
        <span className="badge badge-primary">Required</span>
      </div>
      
      <div className="border-2 border-dashed border-border dark:border-border-dark rounded-2xl p-xl flex flex-col items-center justify-center text-center transition-all hover:border-primary dark:hover:border-primary-light cursor-pointer">
        <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center mb-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-xs">Drop your dataset here</h3>
        <p className="text-text-secondary dark:text-text-secondary-dark mb-md">
          Supports CSV, Excel, or JSON files
        </p>
        <button className="btn btn-primary px-lg">
          Browse Files
        </button>
      </div>
      
      <div className="mt-md">
        <div className="flex items-center justify-between text-sm text-text-secondary dark:text-text-secondary-dark">
          <span>Maximum file size: 100MB</span>
          <span>Supported formats: .csv, .xlsx, .json</span>
        </div>
      </div>
      
      {/* Recent uploads section */}
      <div className="mt-xl">
        <h3 className="text-md font-medium mb-sm">Recent Uploads</h3>
        <div className="space-y-sm">
          <div className="flex items-center justify-between p-sm rounded-xl bg-card-alt dark:bg-card-alt-dark">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-sm">
                <p className="text-sm font-medium">housing_data.csv</p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">2.4 MB • 2 hours ago</p>
              </div>
            </div>
            <span className="badge badge-success">Processed</span>
          </div>
          
          <div className="flex items-center justify-between p-sm rounded-xl bg-card-alt dark:bg-card-alt-dark">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-10 dark:bg-opacity-20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary dark:text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-sm">
                <p className="text-sm font-medium">sales_forecast.xlsx</p>
                <p className="text-xs text-text-secondary dark:text-text-secondary-dark">5.7 MB • Yesterday</p>
              </div>
            </div>
            <span className="badge badge-success">Processed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentUpload;
