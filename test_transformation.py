#!/usr/bin/env python3
"""
Test Script for the Transformation Agent

This script demonstrates the functionality of the Transformation Agent by:
1. Creating the necessary directory structure if it doesn't exist
2. Copying a sample file from /data/raw to /data/processed (simulating the Extraction Agent)
3. Processing the file using the standalone transformer
4. Displaying the results

Usage:
    python test_transformation.py
"""

import os
import sys
import json
import shutil
import logging
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('test_transformation')

# Try to import required modules
try:
    import pandas as pd
    import yaml
except ImportError as e:
    logger.error(f"Error: Required package not found: {e}")
    logger.error("\nThis script requires the following packages:")
    logger.error("  - pandas: For data manipulation")
    logger.error("  - pyyaml: For YAML file parsing")
    logger.error("\nPlease install them using:")
    logger.error("  pip install pandas pyyaml")
    sys.exit(1)

# Define constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
RAW_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'raw')
PROCESSED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'processed')
ENRICHED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'enriched')
LOGS_DIR = os.path.join(SCRIPT_DIR, 'logs')
CONFIG_DIR = os.path.join(SCRIPT_DIR, 'config')
TAGS_CONFIG_PATH = os.path.join(CONFIG_DIR, 'tags.yaml')

def setup_directories():
    """Create the necessary directory structure if it doesn't exist."""
    logger.info("Setting up directory structure")
    
    # Create directories
    os.makedirs(RAW_DATA_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DATA_DIR, exist_ok=True)
    os.makedirs(ENRICHED_DATA_DIR, exist_ok=True)
    os.makedirs(LOGS_DIR, exist_ok=True)
    os.makedirs(CONFIG_DIR, exist_ok=True)
    
    # Check if tags.yaml exists
    if not os.path.exists(TAGS_CONFIG_PATH):
        logger.error(f"Tags configuration file not found: {TAGS_CONFIG_PATH}")
        logger.error("Please create the tags.yaml file in the config directory")
        sys.exit(1)

def simulate_extraction_agent(sample_file=None):
    """
    Simulate the Extraction Agent by processing a sample file.
    
    Args:
        sample_file: Path to a sample file to process. If None, use a default sample.
    
    Returns:
        Path to the processed file
    """
    logger.info("Simulating Extraction Agent")
    
    # If no sample file is provided, use a default sample
    if sample_file is None:
        # Check if sample_customers.csv exists
        sample_customers_path = os.path.join(RAW_DATA_DIR, 'sample_customers.csv')
        if os.path.exists(sample_customers_path):
            sample_file = sample_customers_path
        else:
            # Check if sample_products.json exists
            sample_products_path = os.path.join(RAW_DATA_DIR, 'sample_products.json')
            if os.path.exists(sample_products_path):
                sample_file = sample_products_path
            else:
                logger.error("No sample files found in the raw data directory")
                logger.error("Please place a sample CSV or JSON file in the data/raw directory")
                sys.exit(1)
    
    # Get the file extension
    file_extension = os.path.splitext(sample_file)[1].lower()
    
    # Process the file based on its extension
    if file_extension == '.csv':
        return process_csv_file(sample_file)
    elif file_extension == '.json':
        return process_json_file(sample_file)
    else:
        logger.error(f"Unsupported file format: {file_extension}")
        logger.error("Please provide a CSV or JSON file")
        sys.exit(1)

def process_csv_file(file_path):
    """
    Process a CSV file to simulate the Extraction Agent.
    
    Args:
        file_path: Path to the CSV file
        
    Returns:
        Path to the processed file
    """
    logger.info(f"Processing CSV file: {file_path}")
    
    try:
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Create metadata
        metadata = {
            'filename': os.path.basename(file_path),
            'timestamp': pd.Timestamp.now().isoformat(),
            'source_format': 'csv',
            'row_count': len(df),
            'column_count': len(df.columns),
            'columns': list(df.columns)
        }
        
        # Create payload
        payload = {
            'metadata': metadata,
            'data': df.to_dict(orient='records')
        }
        
        # Save to processed directory
        base_filename = os.path.splitext(os.path.basename(file_path))[0]
        output_path = os.path.join(PROCESSED_DATA_DIR, f"{base_filename}.json")
        
        with open(output_path, 'w') as f:
            json.dump(payload, f, indent=2)
        
        logger.info(f"Saved processed file to: {output_path}")
        
        return output_path
    
    except Exception as e:
        logger.error(f"Error processing CSV file: {e}")
        sys.exit(1)

def process_json_file(file_path):
    """
    Process a JSON file to simulate the Extraction Agent.
    
    Args:
        file_path: Path to the JSON file
        
    Returns:
        Path to the processed file
    """
    logger.info(f"Processing JSON file: {file_path}")
    
    try:
        # Read the JSON file
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        # Convert to DataFrame
        if isinstance(data, list):
            df = pd.DataFrame(data)
        elif isinstance(data, dict):
            if all(isinstance(data[key], dict) for key in data):
                df = pd.DataFrame.from_dict(data, orient='index')
            else:
                df = pd.DataFrame([data])
        else:
            logger.error(f"Unsupported JSON structure in {file_path}")
            sys.exit(1)
        
        # Create metadata
        metadata = {
            'filename': os.path.basename(file_path),
            'timestamp': pd.Timestamp.now().isoformat(),
            'source_format': 'json',
            'row_count': len(df),
            'column_count': len(df.columns),
            'columns': list(df.columns)
        }
        
        # Create payload
        payload = {
            'metadata': metadata,
            'data': df.to_dict(orient='records')
        }
        
        # Save to processed directory
        base_filename = os.path.splitext(os.path.basename(file_path))[0]
        output_path = os.path.join(PROCESSED_DATA_DIR, f"{base_filename}.json")
        
        with open(output_path, 'w') as f:
            json.dump(payload, f, indent=2)
        
        logger.info(f"Saved processed file to: {output_path}")
        
        return output_path
    
    except Exception as e:
        logger.error(f"Error processing JSON file: {e}")
        sys.exit(1)

def run_transformation_agent(processed_file):
    """
    Run the Transformation Agent on a processed file.
    
    Args:
        processed_file: Path to the processed file
    """
    logger.info("Running Transformation Agent")
    
    try:
        # Import the standalone transformer
        sys.path.append(SCRIPT_DIR)
        from standalone_transformer import process_file
        
        # Process the file
        success = process_file(processed_file)
        
        if success:
            logger.info("Transformation completed successfully")
            
            # Get the base filename
            base_filename = os.path.splitext(os.path.basename(processed_file))[0]
            
            # Check if the enriched file exists
            enriched_file = os.path.join(ENRICHED_DATA_DIR, f"{base_filename}.json")
            
            if os.path.exists(enriched_file):
                logger.info(f"Enriched file created: {enriched_file}")
                
                # Display the enriched file
                display_enriched_file(enriched_file)
            else:
                logger.error(f"Enriched file not found: {enriched_file}")
        else:
            logger.error("Transformation failed")
    
    except ImportError:
        logger.error("Error importing standalone_transformer.py")
        logger.error("Make sure standalone_transformer.py is in the same directory as this script")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Error running Transformation Agent: {e}")
        sys.exit(1)

def display_enriched_file(file_path):
    """
    Display the contents of an enriched file.
    
    Args:
        file_path: Path to the enriched file
    """
    logger.info(f"Displaying enriched file: {file_path}")
    
    try:
        # Read the enriched file
        with open(file_path, 'r') as f:
            enriched_data = json.load(f)
        
        # Display metadata
        print("\n=== Enriched File Metadata ===")
        metadata = enriched_data.get('metadata', {})
        
        print(f"Filename: {metadata.get('filename', 'Unknown')}")
        print(f"Original Format: {metadata.get('source_format', 'Unknown')}")
        print(f"Rows: {metadata.get('row_count', 0)}")
        print(f"Columns: {metadata.get('column_count', 0)}")
        
        # Display field tags
        print("\n=== Field Tags ===")
        field_tags = metadata.get('field_tags', {})
        
        for field, tags in field_tags.items():
            if tags:
                print(f"{field}: {', '.join(tags)}")
        
        # Display transformations
        print("\n=== Applied Transformations ===")
        transformations = metadata.get('transformations', {})
        applied_transformations = transformations.get('applied_transformations', {})
        
        for transform_name, transform_data in applied_transformations.items():
            transformed_columns = transform_data.get('transformed_columns', [])
            if transformed_columns:
                print(f"{transform_name}: {', '.join(transformed_columns)}")
        
        # Display sample data
        print("\n=== Sample Data (first 2 records) ===")
        data = enriched_data.get('data', [])
        
        for i, record in enumerate(data[:2]):
            print(f"\nRecord {i+1}:")
            for field, value in record.items():
                print(f"  {field}: {value}")
        
        print("\n=== Transformation Test Complete ===")
        print(f"Full enriched file saved to: {file_path}")
    
    except Exception as e:
        logger.error(f"Error displaying enriched file: {e}")

def main():
    """Main entry point for the test script."""
    logger.info("Starting Transformation Agent Test")
    
    # Setup directories
    setup_directories()
    
    # Simulate the Extraction Agent
    processed_file = simulate_extraction_agent()
    
    # Run the Transformation Agent
    run_transformation_agent(processed_file)
    
    logger.info("Test completed")

if __name__ == "__main__":
    main()
