"""
File Router Agent

This module is responsible for scanning an uploaded directory or list of files
and routing each file to the appropriate agent within the Insight Agent system.

The agent inspects file extensions and routes files to the appropriate locations:
- .csv, .xlsx → move to /data/raw/, then run Extraction Agent
- .md, .txt → copy to /assignment.md, parsed by Insight Agent
- .pdf → place in /docs/ and optionally flag for parsing (future extension)

All routing activities are logged to logs/router_log.csv
"""

import os
import shutil
import csv
import logging
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional, Union, Tuple

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
DATA_RAW_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'raw')
DOCS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')
ASSIGNMENT_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'assignment.md')
LOG_FILE = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs', 'router_log.csv')

# Ensure directories exist
os.makedirs(DATA_RAW_DIR, exist_ok=True)
os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

# Initialize log file if it doesn't exist
if not os.path.exists(LOG_FILE):
    with open(LOG_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['timestamp', 'action', 'source', 'destination', 'status'])


def log_activity(action: str, source: str, destination: str, status: str) -> None:
    """
    Log routing activity to logs/router_log.csv
    
    Args:
        action: The action performed (e.g., 'copy', 'move')
        source: Source file path
        destination: Destination file path
        status: Status of the operation (e.g., 'success', 'failed')
    """
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Log to file
    with open(LOG_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, action, source, destination, status])
    
    # Also log to console
    logger.info(f"{action}: {source} -> {destination} ({status})")


def handle_csv(file_path: str) -> Dict[str, Any]:
    """
    Handle CSV and Excel files by moving to data/raw/
    
    Args:
        file_path: Path to the CSV or Excel file
        
    Returns:
        Dictionary with operation results
    """
    try:
        # Get the filename from the path
        filename = os.path.basename(file_path)
        destination = os.path.join(DATA_RAW_DIR, filename)
        
        # Copy the file to the data/raw directory
        shutil.copy2(file_path, destination)
        
        log_activity('copy', file_path, destination, 'success')
        return {
            'status': 'success',
            'source': file_path,
            'destination': destination,
            'type': 'data',
            'message': f"Copied {filename} to data/raw/ directory"
        }
    except Exception as e:
        log_activity('copy', file_path, DATA_RAW_DIR, f'failed: {str(e)}')
        return {
            'status': 'failed',
            'source': file_path,
            'error': str(e),
            'type': 'data',
            'message': f"Failed to copy {os.path.basename(file_path)} to data/raw/ directory"
        }


def handle_md(file_path: str) -> Dict[str, Any]:
    """
    Handle markdown and text files by copying to assignment.md
    
    Args:
        file_path: Path to the markdown or text file
        
    Returns:
        Dictionary with operation results
    """
    try:
        # Copy the file to assignment.md
        shutil.copy2(file_path, ASSIGNMENT_PATH)
        
        log_activity('copy', file_path, ASSIGNMENT_PATH, 'success')
        return {
            'status': 'success',
            'source': file_path,
            'destination': ASSIGNMENT_PATH,
            'type': 'assignment',
            'message': f"Copied {os.path.basename(file_path)} to assignment.md"
        }
    except Exception as e:
        log_activity('copy', file_path, ASSIGNMENT_PATH, f'failed: {str(e)}')
        return {
            'status': 'failed',
            'source': file_path,
            'error': str(e),
            'type': 'assignment',
            'message': f"Failed to copy {os.path.basename(file_path)} to assignment.md"
        }


def handle_pdf(file_path: str) -> Dict[str, Any]:
    """
    Handle PDF files by placing in docs/ folder
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Dictionary with operation results
    """
    try:
        # Get the filename from the path
        filename = os.path.basename(file_path)
        destination = os.path.join(DOCS_DIR, filename)
        
        # Copy the file to the docs directory
        shutil.copy2(file_path, destination)
        
        log_activity('copy', file_path, destination, 'success')
        return {
            'status': 'success',
            'source': file_path,
            'destination': destination,
            'type': 'document',
            'message': f"Copied {filename} to docs/ directory",
            'parse_flag': True  # Flag for future PDF parsing capability
        }
    except Exception as e:
        log_activity('copy', file_path, DOCS_DIR, f'failed: {str(e)}')
        return {
            'status': 'failed',
            'source': file_path,
            'error': str(e),
            'type': 'document',
            'message': f"Failed to copy {os.path.basename(file_path)} to docs/ directory"
        }


def route_file(file_path: str) -> Dict[str, Any]:
    """
    Route a single file based on its extension
    
    Args:
        file_path: Path to the file to route
        
    Returns:
        Dictionary with routing results
    """
    # Check if file exists
    if not os.path.isfile(file_path):
        return {
            'status': 'failed',
            'source': file_path,
            'error': 'File does not exist',
            'message': f"File {file_path} does not exist"
        }
    
    # Get file extension
    _, ext = os.path.splitext(file_path.lower())
    
    # Route based on extension
    if ext in ['.csv', '.xlsx', '.xls']:
        return handle_csv(file_path)
    elif ext in ['.md', '.txt']:
        return handle_md(file_path)
    elif ext == '.pdf':
        return handle_pdf(file_path)
    else:
        log_activity('skip', file_path, '', f'unsupported file type: {ext}')
        return {
            'status': 'skipped',
            'source': file_path,
            'type': 'unknown',
            'message': f"Skipped file with unsupported extension: {ext}"
        }


def route_files_from_folder(folder_path: str) -> Dict[str, Any]:
    """
    Walk through all files in the folder, classify and route based on type.
    
    Args:
        folder_path: Path to the folder containing files to route
        
    Returns:
        Dictionary with routing results
    """
    results = {
        'status': 'success',
        'processed_files': 0,
        'successful_files': 0,
        'failed_files': 0,
        'skipped_files': 0,
        'details': []
    }
    
    # Check if folder exists
    if not os.path.isdir(folder_path):
        results['status'] = 'failed'
        results['error'] = f"Folder {folder_path} does not exist"
        return results
    
    # Walk through all files in the folder
    for root, _, files in os.walk(folder_path):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Route the file
            result = route_file(file_path)
            results['details'].append(result)
            results['processed_files'] += 1
            
            # Update counters
            if result['status'] == 'success':
                results['successful_files'] += 1
            elif result['status'] == 'failed':
                results['failed_files'] += 1
            elif result['status'] == 'skipped':
                results['skipped_files'] += 1
    
    # Set status to failed if any files failed
    if results['failed_files'] > 0:
        results['status'] = 'partial_success' if results['successful_files'] > 0 else 'failed'
    
    return results


def route_files(file_paths: List[str]) -> Dict[str, Any]:
    """
    Route a list of files based on their extensions
    
    Args:
        file_paths: List of file paths to route
        
    Returns:
        Dictionary with routing results
    """
    results = {
        'status': 'success',
        'processed_files': 0,
        'successful_files': 0,
        'failed_files': 0,
        'skipped_files': 0,
        'details': []
    }
    
    for file_path in file_paths:
        # Route the file
        result = route_file(file_path)
        results['details'].append(result)
        results['processed_files'] += 1
        
        # Update counters
        if result['status'] == 'success':
            results['successful_files'] += 1
        elif result['status'] == 'failed':
            results['failed_files'] += 1
        elif result['status'] == 'skipped':
            results['skipped_files'] += 1
    
    # Set status to failed if any files failed
    if results['failed_files'] > 0:
        results['status'] = 'partial_success' if results['successful_files'] > 0 else 'failed'
    
    return results


if __name__ == "__main__":
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python file_router_agent.py <folder_path_or_file_path>")
        sys.exit(1)
    
    path = sys.argv[1]
    
    if os.path.isdir(path):
        result = route_files_from_folder(path)
    elif os.path.isfile(path):
        result = route_file(path)
    else:
        print(f"Error: {path} is not a valid file or directory")
        sys.exit(1)
    
    print(f"Processed {result.get('processed_files', 1)} files")
    print(f"Successful: {result.get('successful_files', 0 if result['status'] != 'success' else 1)}")
    print(f"Failed: {result.get('failed_files', 0 if result['status'] == 'success' else 1)}")
    print(f"Skipped: {result.get('skipped_files', 0)}")
