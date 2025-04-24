# Multi-File Upload API

This document describes the multi-file upload API endpoint that allows users to upload multiple files (e.g., .csv, .xlsx, .md, .txt, .pdf) from the React frontend using drag-and-drop functionality.

## API Endpoint

### POST /upload-assignment-files

This endpoint accepts multiple files uploaded via multipart/form-data and routes them to appropriate locations using the file_router_agent.

#### Request

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Field Name**: files[]
- **Accepted File Types**: .csv, .xlsx, .md, .txt, .pdf

#### Example Request

```javascript
// Using Axios in JavaScript/React
import axios from 'axios';

const uploadFiles = async (files) => {
  const formData = new FormData();
  
  // Append all files to the formData
  files.forEach(file => {
    formData.append('files[]', file);
  });
  
  try {
    const response = await axios.post('http://localhost:5000/upload-assignment-files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw error;
  }
};
```

#### Response

The API returns a JSON response with the following structure:

```json
{
  "success": true,
  "message": "Successfully processed 3 of 3 files",
  "results": {
    "status": "success",
    "processed_files": 3,
    "successful_files": 3,
    "failed_files": 0,
    "skipped_files": 0,
    "details": [
      {
        "status": "success",
        "source": "/path/to/file1.csv",
        "destination": "/path/to/data/raw/file1.csv",
        "type": "data",
        "message": "Copied file1.csv to data/raw/ directory"
      },
      {
        "status": "success",
        "source": "/path/to/file2.md",
        "destination": "/path/to/assignment.md",
        "type": "assignment",
        "message": "Copied file2.md to assignment.md"
      },
      {
        "status": "success",
        "source": "/path/to/file3.pdf",
        "destination": "/path/to/docs/file3.pdf",
        "type": "document",
        "message": "Copied file3.pdf to docs/ directory"
      }
    ]
  }
}
```

#### Error Responses

- **400 Bad Request**: No files were uploaded or the uploaded files are invalid
- **500 Internal Server Error**: An error occurred while processing the files

## File Routing

The uploaded files are routed based on their file extensions:

- **.csv, .xlsx, .xls**: Moved to `/data/raw/` directory
- **.md, .txt**: Copied to `/assignment.md`
- **.pdf**: Placed in `/docs/` directory

All routing activities are logged to `/logs/router_log.csv` for tracking and auditing purposes.

## Implementation Details

1. Files are uploaded to a temporary directory in `/uploads/`
2. The file_router_agent processes the files and routes them to the appropriate locations
3. The temporary directory is cleaned up after processing
4. Detailed results are returned to the client

## Security Considerations

- File names are sanitized using Werkzeug's `secure_filename` function to prevent directory traversal attacks
- Maximum file size is limited to 16MB (configurable in app.py)
- CORS is enabled to allow cross-origin requests from the React frontend

## Frontend Integration

This API endpoint is designed to be used with the AssignmentDropzone.tsx component in the React frontend, which provides a drag-and-drop interface for uploading multiple files.
