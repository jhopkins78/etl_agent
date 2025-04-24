import React from 'react';
import { useDropzone } from 'react-dropzone';
import { useDashboard } from '../../context/DashboardContext';

const AssignmentDropzone: React.FC = () => {
  const { setAssignmentFile, isLoading } = useDashboard();
  
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setAssignmentFile(acceptedFiles[0]);
    }
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
      'application/json': ['.json'],
    },
    disabled: isLoading,
    multiple: false,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Assignment Upload</h2>
      
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary bg-opacity-5' : 'border-slate-300 hover:border-primary'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        <p className="text-center text-slate-600 mb-1">
          {isDragActive ? 'Drop the file here' : 'Drag & drop your data file here'}
        </p>
        <p className="text-center text-slate-500 text-sm">
          or <span className="text-primary">browse files</span>
        </p>
        <p className="text-center text-slate-400 text-xs mt-2">
          Supported formats: CSV, Excel, JSON
        </p>
      </div>
    </div>
  );
};

export default AssignmentDropzone;
