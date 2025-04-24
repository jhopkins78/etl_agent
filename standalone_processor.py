#!/usr/bin/env python3
"""
Standalone File Processor for ETL Extraction Agent

This script is a standalone version that processes files in the data/raw directory
without requiring the watchdog package. It contains all the necessary functionality
from etl_agent.py but without the file monitoring components.
"""

import os
import sys
import json
import csv
import logging
import datetime
import re
from pathlib import Path
from typing import Dict, List, Any, Union, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('standalone_processor')

# Try to import pandas
try:
    import pandas as pd
except ImportError:
    logger.error("Error: pandas package not found. Please install it using 'pip install pandas'")
    sys.exit(1)

# Define constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'raw')
PROCESSED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'processed')


class DataExtractor:
    """
    Handles the extraction and parsing of data from CSV and JSON files.
    """
    
    @staticmethod
    def extract_from_file(file_path: str) -> tuple[pd.DataFrame, str]:
        """
        Extract data from a file based on its extension.
        
        Args:
            file_path: Path to the file to extract data from
            
        Returns:
            tuple: (DataFrame containing the extracted data, source format)
            
        Raises:
            ValueError: If the file format is not supported
        """
        file_extension = os.path.splitext(file_path)[1].lower()
        
        if file_extension == '.csv':
            return DataExtractor._extract_from_csv(file_path), 'csv'
        elif file_extension == '.json':
            return DataExtractor._extract_from_json(file_path), 'json'
        else:
            raise ValueError(f"Unsupported file format: {file_extension}")
    
    @staticmethod
    def _extract_from_csv(file_path: str) -> pd.DataFrame:
        """
        Extract data from a CSV file.
        
        Args:
            file_path: Path to the CSV file
            
        Returns:
            DataFrame containing the extracted data
        """
        logger.info(f"Extracting data from CSV file: {file_path}")
        try:
            # Read CSV file into a pandas DataFrame
            df = pd.read_csv(file_path)
            return df
        except Exception as e:
            logger.error(f"Error extracting data from CSV file: {e}")
            raise
    
    @staticmethod
    def _extract_from_json(file_path: str) -> pd.DataFrame:
        """
        Extract data from a JSON file.
        
        Args:
            file_path: Path to the JSON file
            
        Returns:
            DataFrame containing the extracted data
        """
        logger.info(f"Extracting data from JSON file: {file_path}")
        try:
            # Read JSON file into a pandas DataFrame
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Handle different JSON structures
            if isinstance(data, list):
                # List of records
                df = pd.DataFrame(data)
            elif isinstance(data, dict):
                if all(isinstance(data[key], dict) for key in data):
                    # Dictionary of dictionaries
                    df = pd.DataFrame.from_dict(data, orient='index')
                else:
                    # Single record
                    df = pd.DataFrame([data])
            else:
                raise ValueError(f"Unsupported JSON structure in {file_path}")
                
            return df
        except Exception as e:
            logger.error(f"Error extracting data from JSON file: {e}")
            raise


class DataNormalizer:
    """
    Handles the normalization of data to a flat tabular format with snake_case field names.
    """
    
    @staticmethod
    def normalize(df: pd.DataFrame) -> pd.DataFrame:
        """
        Normalize a DataFrame to a flat tabular format with snake_case field names.
        
        Args:
            df: DataFrame to normalize
            
        Returns:
            Normalized DataFrame
        """
        logger.info("Normalizing data")
        
        # Convert column names to snake_case
        df = DataNormalizer._convert_columns_to_snake_case(df)
        
        # Flatten nested structures if present
        df = DataNormalizer._flatten_nested_structures(df)
        
        return df
    
    @staticmethod
    def _convert_columns_to_snake_case(df: pd.DataFrame) -> pd.DataFrame:
        """
        Convert column names to snake_case.
        
        Args:
            df: DataFrame with columns to convert
            
        Returns:
            DataFrame with snake_case column names
        """
        # Function to convert a string to snake_case
        def to_snake_case(name: str) -> str:
            # Replace spaces and hyphens with underscores
            s1 = re.sub(r'[-\s]', '_', name)
            # Insert underscore between camelCase
            s2 = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1)
            # Convert to lowercase
            return s2.lower()
        
        # Create a copy of the DataFrame with renamed columns
        df_copy = df.copy()
        df_copy.columns = [to_snake_case(col) for col in df.columns]
        
        return df_copy
    
    @staticmethod
    def _flatten_nested_structures(df: pd.DataFrame) -> pd.DataFrame:
        """
        Flatten nested structures (dicts, lists) in the DataFrame.
        
        Args:
            df: DataFrame with potentially nested structures
            
        Returns:
            Flattened DataFrame
        """
        # Check for columns with nested structures
        nested_columns = []
        for col in df.columns:
            if df[col].apply(lambda x: isinstance(x, (dict, list))).any():
                nested_columns.append(col)
        
        # If no nested structures, return the original DataFrame
        if not nested_columns:
            return df
        
        # Process each column with nested structures
        df_copy = df.copy()
        for col in nested_columns:
            # For columns with dictionaries
            if df[col].apply(lambda x: isinstance(x, dict)).any():
                # Convert the column to a DataFrame and add prefix
                nested_df = pd.json_normalize(df_copy[col].tolist())
                nested_df.columns = [f"{col}_{subcol}" for subcol in nested_df.columns]
                
                # Drop the original column and join with the new columns
                df_copy = df_copy.drop(columns=[col])
                df_copy = pd.concat([df_copy.reset_index(drop=True), nested_df], axis=1)
            
            # For columns with lists
            elif df[col].apply(lambda x: isinstance(x, list)).any():
                # Convert lists to string representation
                df_copy[col] = df_copy[col].apply(lambda x: json.dumps(x) if isinstance(x, list) else x)
        
        # Recursively flatten any newly created nested structures
        return DataNormalizer._flatten_nested_structures(df_copy)


class MetadataManager:
    """
    Handles the attachment of metadata to datasets.
    """
    
    @staticmethod
    def attach_metadata(df: pd.DataFrame, filename: str, source_format: str) -> Dict[str, Any]:
        """
        Attach metadata to a dataset.
        
        Args:
            df: DataFrame containing the data
            filename: Name of the source file
            source_format: Format of the source file (CSV or JSON)
            
        Returns:
            Dictionary containing the data and metadata
        """
        logger.info(f"Attaching metadata to dataset from {filename}")
        
        # Create metadata
        metadata = {
            'filename': filename,
            'timestamp': datetime.datetime.now().isoformat(),
            'source_format': source_format,
            'row_count': len(df),
            'column_count': len(df.columns),
            'columns': list(df.columns)
        }
        
        # Create payload with data and metadata
        payload = {
            'metadata': metadata,
            'data': df.to_dict(orient='records')
        }
        
        return payload


class DataForwarder:
    """
    Handles the forwarding (saving) of processed data to the destination.
    """
    
    @staticmethod
    def forward_to_processed(payload: Dict[str, Any], original_filename: str) -> str:
        """
        Forward the processed data to the processed directory.
        
        Args:
            payload: Dictionary containing the data and metadata
            original_filename: Name of the original source file
            
        Returns:
            Path to the saved file
        """
        # Ensure the processed directory exists
        os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
        
        # Get the base filename without extension
        base_filename = os.path.splitext(os.path.basename(original_filename))[0]
        
        # Create the output filename
        output_filename = os.path.join(PROCESSED_DATA_DIR, f"{base_filename}.json")
        
        logger.info(f"Forwarding processed data to {output_filename}")
        
        # Save the payload as JSON
        with open(output_filename, 'w') as f:
            json.dump(payload, f, indent=2)
        
        return output_filename


def process_file(file_path):
    """
    Process a single file using the ETL components.
    
    Args:
        file_path: Path to the file to process
    """
    try:
        logger.info(f"Processing file: {file_path}")
        
        # Extract data from the file
        df, source_format = DataExtractor.extract_from_file(file_path)
        
        # Normalize the data
        normalized_df = DataNormalizer.normalize(df)
        
        # Attach metadata
        payload = MetadataManager.attach_metadata(
            normalized_df, 
            os.path.basename(file_path),
            source_format
        )
        
        # Forward to processed directory
        output_path = DataForwarder.forward_to_processed(
            payload,
            os.path.basename(file_path)
        )
        
        logger.info(f"File processed successfully: {file_path} -> {output_path}")
        return True
        
    except Exception as e:
        logger.error(f"Error processing file {file_path}: {e}")
        return False


def main():
    """Process all CSV and JSON files in the raw data directory."""
    logger.info(f"Looking for files in: {RAW_DATA_DIR}")
    
    # Ensure the raw and processed directories exist
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    
    # Get all CSV and JSON files in the raw directory
    files_to_process = []
    for filename in os.listdir(RAW_DATA_DIR):
        file_path = os.path.join(RAW_DATA_DIR, filename)
        
        # Only process files (not directories)
        if os.path.isfile(file_path):
            file_extension = os.path.splitext(file_path)[1].lower()
            
            # Only process CSV and JSON files
            if file_extension in ['.csv', '.json']:
                files_to_process.append(file_path)
    
    if not files_to_process:
        logger.info(f"No CSV or JSON files found in {RAW_DATA_DIR}")
        return
    
    logger.info(f"Found {len(files_to_process)} files to process")
    
    # Process each file
    success_count = 0
    for file_path in files_to_process:
        if process_file(file_path):
            success_count += 1
    
    logger.info(f"Processing complete. {success_count}/{len(files_to_process)} files processed successfully.")
    
    # Show the processed files
    processed_files = os.listdir(PROCESSED_DATA_DIR)
    if processed_files:
        logger.info(f"Processed files in {PROCESSED_DATA_DIR}:")
        for filename in processed_files:
            logger.info(f"  - {filename}")


if __name__ == "__main__":
    main()
