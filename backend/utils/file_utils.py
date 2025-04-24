#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File Utilities Module

This module provides helper functions for file operations such as saving uploaded files,
reading reports, and loading data previews.
"""

import os
import pandas as pd
from typing import Dict, List, Any, Optional, Tuple, Union
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('file_utils')

def save_uploaded_file(file_data: bytes, file_path: str) -> Tuple[bool, str]:
    """
    Save uploaded file data to the specified path.
    
    Args:
        file_data (bytes): The binary content of the uploaded file.
        file_path (str): The path where the file should be saved.
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the file was saved successfully, False otherwise.
            - str: Status message or error details.
    """
    try:
        # Ensure the directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        # Write the file
        with open(file_path, 'wb') as f:
            f.write(file_data)
        
        logger.info(f"File saved successfully to {file_path}")
        return True, f"File saved successfully to {file_path}"
        
    except Exception as e:
        logger.error(f"Error saving file: {str(e)}")
        return False, f"Error saving file: {str(e)}"

def read_markdown_file(file_path: str) -> Tuple[bool, Union[str, Dict[str, str]]]:
    """
    Read the content of a Markdown file.
    
    Args:
        file_path (str): The path to the Markdown file.
        
    Returns:
        Tuple[bool, Union[str, Dict[str, str]]]: A tuple containing:
            - bool: True if the file was read successfully, False otherwise.
            - Union[str, Dict[str, str]]: 
                - If successful: The content of the file as a string.
                - If failed: A dictionary with an error message.
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return False, {"error": f"File not found: {file_path}"}
        
        # Read the file
        with open(file_path, 'r') as f:
            content = f.read()
        
        logger.info(f"File read successfully: {file_path}")
        return True, content
        
    except Exception as e:
        logger.error(f"Error reading file: {str(e)}")
        return False, {"error": f"Error reading file: {str(e)}"}

def load_csv_preview(file_path: str, rows: int = 20) -> Tuple[bool, Union[Dict[str, Any], Dict[str, str]]]:
    """
    Load a preview of a CSV file, including column names and a specified number of rows.
    
    Args:
        file_path (str): The path to the CSV file.
        rows (int, optional): The number of rows to include in the preview. Defaults to 20.
        
    Returns:
        Tuple[bool, Union[Dict[str, Any], Dict[str, str]]]: A tuple containing:
            - bool: True if the file was loaded successfully, False otherwise.
            - Union[Dict[str, Any], Dict[str, str]]: 
                - If successful: A dictionary with 'columns' and 'data' keys.
                - If failed: A dictionary with an error message.
    """
    try:
        # Check if file exists
        if not os.path.exists(file_path):
            logger.error(f"File not found: {file_path}")
            return False, {"error": f"File not found: {file_path}"}
        
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Get column names and first N rows
        columns = df.columns.tolist()
        data = df.head(rows).to_dict(orient='records')
        
        logger.info(f"CSV preview loaded successfully: {file_path}")
        return True, {
            "columns": columns,
            "data": data
        }
        
    except Exception as e:
        logger.error(f"Error loading CSV preview: {str(e)}")
        return False, {"error": f"Error loading CSV preview: {str(e)}"}
