import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDashboard } from '../../context/DashboardContext';

const AssignmentUpload: React.FC = () => {
  const { setAssignmentFile, isLoading } = useDashboard();
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  
  // Simulate upload progress
  const simulateUpload = (file: File) => {
    setIsUploaded(false);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
    
    // Set the file in context
    setAssignmentFile(file);
  };
  
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      simulateUpload(acceptedFiles[0]);
    }
  };
  
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/json': ['.json'],
    },
    disabled: isLoading,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="card animate-fade-in">
      <div className="flex justify-between items-center mb-md">
        <h2 className="text-xl font-semibold">Assignment Upload</h2>
        <div className="flex items-center">
          <span className="text-sm text-text-secondary dark:text-dark-text-secondary mr-sm">
            {isUploaded ? 'File Ready' : 'Awaiting Data'}
          </span>
          <div className={`w-3 h-3 rounded-full ${isUploaded ? 'bg-success' : 'bg-text-tertiary dark:bg-dark-text-tertiary'}`}></div>
        </div>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`dropzone ${isDragActive ? 'dropzone-active' : ''} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} bg-gradient-neutral hover-scale`}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center py-xl">
          <div className="w-20 h-20 mb-md bg-card dark:bg-dark-card rounded-full flex items-center justify-center shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <p className="text-center font-medium mb-sm">
            {isDragActive ? 'Release to upload file' : 'Drag & drop your data file here'}
          </p>
          <p className="text-center text-text-secondary dark:text-dark-text-secondary mb-md">
            or <span className="text-primary font-medium cursor-pointer">browse files</span>
          </p>
          <div className="flex flex-wrap gap-sm justify-center">
            <span className="badge badge-info">CSV</span>
            <span className="badge badge-info">Excel</span>
            <span className="badge badge-info">JSON</span>
          </div>
        </div>
      </div>
      
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-md">
          <div className="flex justify-between text-sm mb-xs">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="progress-track">
            <div 
              className="progress-indicator" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {isUploaded && (
        <div className="mt-md p-md bg-success bg-opacity-5 rounded-xl border border-success border-opacity-20 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-success mr-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium text-success">File uploaded successfully</p>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Ready for analysis</p>
          </div>
        </div>
      )}
      
      <div className="mt-lg pt-md border-t border-border dark:border-dark-border">
        <div className="flex justify-between items-center">
          <div className="text-sm text-text-secondary dark:text-dark-text-secondary">
            <span>Supported formats: CSV, Excel, JSON</span>
          </div>
          <button className="btn btn-primary" disabled={!isUploaded || isLoading}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Process Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentUpload;
