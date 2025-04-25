import axios from 'axios';

/**
 * Axios instance with base URL configuration for API requests
 * Uses environment variable VITE_API_URL for the base URL
 * Default timeout of 30 seconds for all requests
 */
const api = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for logging and handling requests
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and handling responses
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`API Error: ${error.response.status} ${error.response.statusText}`);
      console.error('Error Data:', error.response.data);
    } else if (error.request) {
      console.error('API Error: No response received', error.request);
    } else {
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * API endpoints for the Insight Agent
 */
export const endpoints = {
  uploadAssignment: '/upload-assignment',
  uploadAssignmentFiles: '/upload-assignment-files',
  runEda: '/run-eda',
  runFullPipeline: '/run-full-pipeline',
  runModelTraining: '/run-model-training',
  getModelLeaderboard: '/model-leaderboard',
  getFinalReport: '/final-report',
  getDataPreview: '/data-preview',
  downloadVisuals: '/download-visuals',
  generatePdf: '/generate-pdf'
};

export default api;
