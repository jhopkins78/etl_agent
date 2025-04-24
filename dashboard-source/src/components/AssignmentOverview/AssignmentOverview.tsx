import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import api, { endpoints } from '../../api';

const AssignmentOverview: React.FC = () => {
  const { 
    assignmentFile: file, 
    setAssignmentFile: setFile, 
    tasks,
    setTasks,
    isLoading,
    setIsLoading
  } = useDashboard();
  
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadAssignment = async (fileToUpload: File) => {
    setUploadError(null);
    setUploadSuccess(false);
    setIsLoading(true);
    
    try {
      // Create form data for multipart/form-data upload
      const formData = new FormData();
      formData.append('assignment', fileToUpload);
      
      // Upload the file to the backend
      const response = await api.post(endpoints.uploadAssignment, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Handle successful response
      console.log('Assignment uploaded successfully:', response.data);
      setUploadSuccess(true);
      
      // If the backend returns parsed tasks, update them
      if (response.data && response.data.tasks) {
        setTasks(response.data.tasks);
      }
      
      setFile(fileToUpload);
    } catch (error) {
      console.error('Error uploading assignment:', error);
      setUploadError('Failed to upload assignment. Please try again.');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.md')) {
        uploadAssignment(droppedFile);
      } else {
        setUploadError('Please upload a markdown (.md) file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.md')) {
        uploadAssignment(selectedFile);
      } else {
        setUploadError('Please upload a markdown (.md) file');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full">
      <h2 className="text-lg font-semibold mb-4">Assignment Overview</h2>
      
      {/* Error message */}
      {uploadError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>{uploadError}</span>
          <button 
            onClick={() => setUploadError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Success message */}
      {uploadSuccess && !isLoading && file && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
          <span>Assignment uploaded successfully!</span>
          <button 
            onClick={() => setUploadSuccess(false)}
            className="text-green-500 hover:text-green-700"
          >
            ✕
          </button>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="rounded-full bg-slate-200 h-12 w-12 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : !file ? (
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-primary bg-slate-50' : 'border-slate-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <div className="text-4xl text-slate-400 mb-2">📄</div>
          <p className="text-slate-600 mb-2">Drag & drop your problem description</p>
          <p className="text-slate-500 text-sm mb-3">or click to browse</p>
          <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-md text-sm hover:bg-slate-200 transition-colors">
            Upload .md file
          </button>
          <input 
            id="file-upload" 
            type="file" 
            accept=".md" 
            className="hidden" 
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <>
          <div className="bg-slate-50 p-3 rounded-md mb-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-slate-500">Uploaded {new Date().toLocaleString()}</p>
            </div>
            <button 
              className="text-sm text-slate-500 hover:text-error"
              onClick={() => setFile(null)}
            >
              Remove
            </button>
          </div>
          
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Parsed Tasks</h3>
            <ul className="space-y-2">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center">
                  {task.status === 'completed' && (
                    <span className="text-success mr-2">✅</span>
                  )}
                  {task.status === 'in-progress' && (
                    <span className="text-pending mr-2">⏳</span>
                  )}
                  {task.status === 'pending' && (
                    <span className="text-slate-300 mr-2">⚪</span>
                  )}
                  <span className={task.status === 'completed' ? 'line-through text-slate-500' : ''}>
                    {task.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentOverview;
