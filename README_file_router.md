# File Router Agent

The File Router Agent is responsible for scanning an uploaded directory or list of files and routing each file to the appropriate agent within the Insight Agent system.

## Overview

The File Router Agent inspects file extensions and routes files to the appropriate locations:

- `.csv`, `.xlsx`, `.xls` → move to `/data/raw/`, then run Extraction Agent
- `.md`, `.txt` → copy to `/assignment.md`, parsed by Insight Agent
- `.pdf` → place in `/docs/` and optionally flag for parsing (future extension)

All routing activities are logged to `logs/router_log.csv` for tracking and auditing purposes.

## Usage

### Command Line

You can use the File Router Agent directly from the command line:

```bash
# Route files from a specific folder
python -m insight_agent.insight_agent --route-files /path/to/assignment/folder

# Using the run_pipeline.sh script
./run_pipeline.sh --route-files /path/to/assignment/folder
```

### Python API

You can also use the File Router Agent programmatically in your Python code:

```python
from insight_agent.tasks import route_files_from_folder, route_file

# Route all files in a folder
results = route_files_from_folder('/path/to/assignment/folder')
print(f"Successfully routed {results['successful_files']} files")

# Route a single file
result = route_file('/path/to/file.csv')
print(f"Status: {result['status']}")
```

## Return Values

The `route_files_from_folder` function returns a dictionary with the following keys:

- `status`: Overall status of the operation ('success', 'partial_success', or 'failed')
- `processed_files`: Total number of files processed
- `successful_files`: Number of files successfully routed
- `failed_files`: Number of files that failed to route
- `skipped_files`: Number of files skipped due to unsupported file types
- `details`: List of dictionaries with details for each file processed

The `route_file` function returns a dictionary with the following keys:

- `status`: Status of the operation ('success', 'failed', or 'skipped')
- `source`: Source file path
- `destination`: Destination file path (if successful)
- `type`: Type of file ('data', 'assignment', 'document', or 'unknown')
- `message`: Human-readable message describing the result
- `error`: Error message (if failed)

## Logging

All routing activities are logged to `logs/router_log.csv` with the following columns:

- `timestamp`: Date and time of the operation
- `action`: Action performed (e.g., 'copy', 'move')
- `source`: Source file path
- `destination`: Destination file path
- `status`: Status of the operation (e.g., 'success', 'failed')

## Example

```python
from insight_agent import InsightAgent

# Initialize the agent
agent = InsightAgent()

# Route files from a folder
results = agent.route_files('/path/to/assignment/folder')

# Check results
if results['status'] == 'success':
    print(f"Successfully routed {results['successful_files']} files")
elif results['status'] == 'partial_success':
    print(f"Partially successful: {results['successful_files']} succeeded, {results['failed_files']} failed")
else:
    print(f"Failed to route files: {results.get('error', 'Unknown error')}")
```

## Future Extensions

The File Router Agent is designed to be extensible for future file types and processing needs:

- PDF parsing capability for extracting text and metadata
- Support for additional file formats (e.g., JSON, XML, etc.)
- Integration with external data sources
- Automatic detection of file types based on content rather than extension
