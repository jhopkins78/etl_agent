# Full Pipeline API

This document describes the `/run-full-pipeline` API endpoint that runs the complete Insight Agent pipeline after files have been uploaded and routed by the file_router_agent.

## Overview

The Full Pipeline API automates the execution of the entire data analysis workflow in a single request. It is designed to be triggered after files have been successfully uploaded and routed using the `/upload-assignment-files` endpoint.

The pipeline performs the following steps in sequence:

1. Finds the most recent dataset in the `/data/raw/` directory
2. Runs Exploratory Data Analysis (EDA)
3. Trains machine learning models (Linear Regression & KNN)
4. Evaluates model performance
5. Generates a comprehensive final report

## API Endpoint

### POST /run-full-pipeline

This endpoint triggers the full Insight Agent pipeline with no required parameters. It automatically uses the most recently uploaded dataset and any available assignment.md file.

#### Request

- **Method**: POST
- **Content-Type**: application/json
- **Body**: Empty (no parameters required)

#### Example Request

```javascript
// Using Axios in JavaScript/React
import axios from 'axios';

const runFullPipeline = async () => {
  try {
    const response = await axios.post('http://localhost:5000/run-full-pipeline');
    return response.data;
  } catch (error) {
    console.error('Error running pipeline:', error);
    throw error;
  }
};
```

#### Response

The API returns a JSON response with the following structure:

```json
{
  "success": true,
  "message": "Full pipeline completed successfully",
  "report_path": "/path/to/reports/final_report.md",
  "log_path": "/path/to/logs/workflow_log.txt"
}
```

#### Error Responses

- **500 Internal Server Error**: An error occurred while running the pipeline
  ```json
  {
    "success": false,
    "message": "Pipeline failed at EDA step",
    "error": "Dataset not found: /path/to/data/raw/dataset.csv"
  }
  ```

## Implementation Details

The endpoint performs several checks and operations:

1. **Dataset Selection**: Automatically finds the most recent CSV or Excel file in the `/data/raw/` directory
2. **Data Readiness Check**: Verifies that the dataset is ready for analysis
3. **EDA Execution**: Runs exploratory data analysis on the dataset
4. **Model Training**: Trains machine learning models using the dataset
5. **Report Generation**: Compiles all analysis results into a final report

## Frontend Integration

This API endpoint is designed to be called after the `/upload-assignment-files` endpoint has successfully processed the uploaded files. The typical workflow is:

1. User uploads files using the AssignmentDropzone component
2. Frontend receives successful response from `/upload-assignment-files`
3. Frontend automatically triggers `/run-full-pipeline`
4. Frontend displays a loading indicator while the pipeline runs
5. On completion, frontend displays a link to the final report

## Error Handling

The endpoint includes comprehensive error handling:

- If no dataset is found, the pipeline fails with an appropriate error message
- If the dataset is not ready for analysis, the pipeline fails with details
- Each step (EDA, Model Training, Report Generation) has individual error handling
- All errors are logged and returned in the response

## Security Considerations

- The endpoint does not accept any user input, reducing the risk of injection attacks
- All file paths are validated before use
- The endpoint uses the same authentication and authorization mechanisms as the rest of the API
