#!/usr/bin/env python3
"""
Standalone Loading Processor for ETL Pipeline

This script is a standalone version that processes files in the data/enriched directory
without requiring the watchdog package. It contains all the necessary functionality
from loading_agent.py but without the file monitoring components.

It allows users to:
1. Load datasets from the /data/enriched folder
2. Load each file into a PostgreSQL-compatible database
3. Add a load_status column with "loaded" value and timestamp
4. Archive the file to /data/archived after successful load
5. Log each load operation in /logs/loading_log.csv
"""

import os
import sys
import json
import csv
import logging
import datetime
import shutil
from pathlib import Path
from typing import Dict, List, Any, Tuple
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('standalone_loader')

# Try to import required modules
try:
    import pandas as pd
    import sqlalchemy
    from sqlalchemy import create_engine, MetaData, Table, Column, String, DateTime, inspect
    from sqlalchemy.types import Integer, Float, Boolean, Text, Date
    from dotenv import load_dotenv
except ImportError as e:
    logger.error(f"Error: Required package not found: {e}")
    logger.error("\nThis script requires the following packages:")
    logger.error("  - pandas: For data manipulation")
    logger.error("  - sqlalchemy: For database interactions")
    logger.error("  - python-dotenv: For loading environment variables")
    logger.error("\nPlease install them using:")
    logger.error("  pip install pandas sqlalchemy python-dotenv")
    sys.exit(1)

# Define constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENRICHED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'enriched')
ARCHIVED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'archived')
LOGS_DIR = os.path.join(SCRIPT_DIR, 'logs')
LOADING_LOG_PATH = os.path.join(LOGS_DIR, 'loading_log.csv')

# Load environment variables
load_dotenv()

# Import the loading agent modules
try:
    from loading_agent import (
        DatabaseManager,
        SchemaInferrer,
        DataLoader,
        FileArchiver,
        LoadingLogger
    )
except ImportError as e:
    logger.error(f"Error importing from loading_agent: {e}")
    logger.error("Make sure loading_agent.py is in the same directory as this script")
    
    # Define the classes here if the import fails
    # This makes the script self-contained and able to run without loading_agent.py
    
    class DatabaseManager:
        """
        Handles database connections and operations.
        """
        
        def __init__(self):
            """
            Initialize the database manager with connection details from environment variables.
            """
            self.db_url = self._get_database_url()
            self.engine = None
            self.metadata = None
        
        def _get_database_url(self) -> str:
            """
            Construct the database URL from environment variables.
            
            Returns:
                str: Database connection URL
            
            Raises:
                ValueError: If required environment variables are missing
            """
            # Get database connection details from environment variables
            db_host = os.getenv('DB_HOST')
            db_port = os.getenv('DB_PORT', '5432')
            db_name = os.getenv('DB_NAME')
            db_user = os.getenv('DB_USER')
            db_password = os.getenv('DB_PASSWORD')
            
            # Check if required variables are set
            if not all([db_host, db_name, db_user, db_password]):
                missing = []
                if not db_host: missing.append('DB_HOST')
                if not db_name: missing.append('DB_NAME')
                if not db_user: missing.append('DB_USER')
                if not db_password: missing.append('DB_PASSWORD')
                
                raise ValueError(f"Missing required environment variables: {', '.join(missing)}")
            
            # Construct the database URL
            return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
        
        def connect(self):
            """
            Establish a connection to the database.
            
            Raises:
                Exception: If connection fails
            """
            logger.info("Connecting to database")
            try:
                self.engine = create_engine(self.db_url)
                self.metadata = MetaData()
                self.metadata.bind = self.engine
                
                # Test the connection
                with self.engine.connect() as conn:
                    logger.info("Database connection successful")
            except Exception as e:
                logger.error(f"Database connection failed: {e}")
                raise
        
        def disconnect(self):
            """
            Close the database connection.
            """
            if self.engine:
                self.engine.dispose()
                logger.info("Database connection closed")
        
        def table_exists(self, table_name: str) -> bool:
            """
            Check if a table exists in the database.
            
            Args:
                table_name: Name of the table to check
                
            Returns:
                bool: True if the table exists, False otherwise
            """
            if not self.engine:
                self.connect()
            
            return inspect(self.engine).has_table(table_name)
        
        def create_table(self, table_name: str, columns: Dict[str, Any]):
            """
            Create a new table in the database.
            
            Args:
                table_name: Name of the table to create
                columns: Dictionary mapping column names to SQLAlchemy column types
                
            Raises:
                Exception: If table creation fails
            """
            logger.info(f"Creating table: {table_name}")
            try:
                # Create a list of columns
                column_list = []
                for col_name, col_type in columns.items():
                    column_list.append(Column(col_name, col_type))
                
                # Add the load_status and load_timestamp columns
                column_list.append(Column('load_status', String(50)))
                column_list.append(Column('load_timestamp', DateTime))
                
                # Create the table
                table = Table(table_name, self.metadata, *column_list)
                table.create(self.engine)
                
                logger.info(f"Table {table_name} created successfully")
            except Exception as e:
                logger.error(f"Error creating table {table_name}: {e}")
                raise
        
        def load_data(self, table_name: str, data: List[Dict[str, Any]]) -> int:
            """
            Load data into a table.
            
            Args:
                table_name: Name of the table to load data into
                data: List of dictionaries containing the data to load
                
            Returns:
                int: Number of rows loaded
                
            Raises:
                Exception: If data loading fails
            """
            logger.info(f"Loading data into table: {table_name}")
            try:
                # Add load_status and load_timestamp to each row
                now = datetime.now()
                for row in data:
                    row['load_status'] = 'loaded'
                    row['load_timestamp'] = now
                
                # Load the data
                with self.engine.connect() as conn:
                    result = conn.execute(
                        Table(table_name, self.metadata, autoload_with=self.engine).insert(),
                        data
                    )
                    
                    logger.info(f"Loaded {len(data)} rows into table {table_name}")
                    return len(data)
            except Exception as e:
                logger.error(f"Error loading data into table {table_name}: {e}")
                raise
    
    
    class SchemaInferrer:
        """
        Handles schema inference from CSV files.
        """
        
        @staticmethod
        def infer_schema(df: pd.DataFrame) -> Dict[str, Any]:
            """
            Infer the database schema from a pandas DataFrame.
            
            Args:
                df: DataFrame containing the data
                
            Returns:
                Dictionary mapping column names to SQLAlchemy column types
            """
            logger.info("Inferring schema from DataFrame")
            
            schema = {}
            
            for column in df.columns:
                # Get the pandas dtype
                dtype = df[column].dtype
                
                # Map pandas dtypes to SQLAlchemy types
                if pd.api.types.is_integer_dtype(dtype):
                    schema[column] = Integer
                elif pd.api.types.is_float_dtype(dtype):
                    schema[column] = Float
                elif pd.api.types.is_bool_dtype(dtype):
                    schema[column] = Boolean
                elif pd.api.types.is_datetime64_dtype(dtype):
                    schema[column] = DateTime
                elif pd.api.types.is_string_dtype(dtype):
                    # Check if it's a date string
                    try:
                        if df[column].str.match(r'^\d{4}-\d{2}-\d{2}$').all():
                            schema[column] = Date
                        else:
                            # Check the max length to determine if it should be Text or String
                            max_length = df[column].str.len().max()
                            if max_length > 255:
                                schema[column] = Text
                            else:
                                schema[column] = String(max_length)
                    except:
                        # Default to Text for any string-like column that can't be analyzed
                        schema[column] = Text
                else:
                    # Default to Text for any other type
                    schema[column] = Text
            
            return schema
    
    
    class DataLoader:
        """
        Handles loading data from enriched files.
        """
        
        @staticmethod
        def load_from_file(file_path: str) -> Tuple[pd.DataFrame, Dict[str, Any]]:
            """
            Load data from an enriched file.
            
            Args:
                file_path: Path to the file to load
                
            Returns:
                tuple: (DataFrame containing the data, metadata dictionary)
                
            Raises:
                ValueError: If the file format is not supported
            """
            file_extension = os.path.splitext(file_path)[1].lower()
            
            if file_extension == '.json':
                return DataLoader._load_from_json(file_path)
            elif file_extension == '.csv':
                return DataLoader._load_from_csv(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
        
        @staticmethod
        def _load_from_json(file_path: str) -> Tuple[pd.DataFrame, Dict[str, Any]]:
            """
            Load data from a JSON file.
            
            Args:
                file_path: Path to the JSON file
                
            Returns:
                tuple: (DataFrame containing the data, metadata dictionary)
            """
            logger.info(f"Loading data from JSON file: {file_path}")
            try:
                with open(file_path, 'r') as f:
                    content = json.load(f)
                
                # Extract data and metadata
                if isinstance(content, dict) and 'data' in content and 'metadata' in content:
                    # File follows the expected structure
                    metadata = content['metadata']
                    data = content['data']
                    df = pd.DataFrame(data)
                    return df, metadata
                else:
                    # Try to handle as a direct data structure
                    df = pd.DataFrame(content)
                    metadata = {
                        'filename': os.path.basename(file_path),
                        'timestamp': datetime.now().isoformat(),
                        'source_format': 'json',
                        'row_count': len(df),
                        'column_count': len(df.columns),
                        'columns': list(df.columns)
                    }
                    return df, metadata
                    
            except Exception as e:
                logger.error(f"Error loading data from JSON file: {e}")
                raise
        
        @staticmethod
        def _load_from_csv(file_path: str) -> Tuple[pd.DataFrame, Dict[str, Any]]:
            """
            Load data from a CSV file.
            
            Args:
                file_path: Path to the CSV file
                
            Returns:
                tuple: (DataFrame containing the data, metadata dictionary)
            """
            logger.info(f"Loading data from CSV file: {file_path}")
            try:
                # Read CSV file into a pandas DataFrame
                df = pd.read_csv(file_path)
                
                # Create metadata
                metadata = {
                    'filename': os.path.basename(file_path),
                    'timestamp': datetime.now().isoformat(),
                    'source_format': 'csv',
                    'row_count': len(df),
                    'column_count': len(df.columns),
                    'columns': list(df.columns)
                }
                
                return df, metadata
            except Exception as e:
                logger.error(f"Error loading data from CSV file: {e}")
                raise
    
    
    class FileArchiver:
        """
        Handles archiving of processed files.
        """
        
        @staticmethod
        def archive_file(file_path: str) -> str:
            """
            Archive a file by moving it to the archived directory.
            
            Args:
                file_path: Path to the file to archive
                
            Returns:
                str: Path to the archived file
                
            Raises:
                Exception: If archiving fails
            """
            logger.info(f"Archiving file: {file_path}")
            
            # Ensure the archived directory exists
            os.makedirs(ARCHIVED_DATA_DIR, exist_ok=True)
            
            # Get the filename
            filename = os.path.basename(file_path)
            
            # Create the destination path
            dest_path = os.path.join(ARCHIVED_DATA_DIR, filename)
            
            # If a file with the same name already exists in the archive,
            # add a timestamp to make the filename unique
            if os.path.exists(dest_path):
                base_name, extension = os.path.splitext(filename)
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
                dest_path = os.path.join(ARCHIVED_DATA_DIR, f"{base_name}_{timestamp}{extension}")
            
            try:
                # Move the file to the archived directory
                shutil.move(file_path, dest_path)
                logger.info(f"File archived to: {dest_path}")
                return dest_path
            except Exception as e:
                logger.error(f"Error archiving file {file_path}: {e}")
                raise
    
    
    class LoadingLogger:
        """
        Handles logging of loading operations.
        """
        
        @staticmethod
        def initialize_log():
            """
            Initialize the loading log file if it doesn't exist.
            """
            # Ensure the logs directory exists
            os.makedirs(LOGS_DIR, exist_ok=True)
            
            # Check if the log file exists
            if not os.path.exists(LOADING_LOG_PATH):
                logger.info(f"Creating loading log file: {LOADING_LOG_PATH}")
                
                # Create the log file with headers
                with open(LOADING_LOG_PATH, 'w', newline='') as f:
                    writer = csv.writer(f)
                    writer.writerow([
                        'timestamp',
                        'filename',
                        'table_name',
                        'row_count',
                        'status',
                        'archived_path'
                    ])
        
        @staticmethod
        def log_loading(
            filename: str,
            table_name: str,
            row_count: int,
            status: str,
            archived_path: str
        ):
            """
            Log a loading operation to the loading log file.
            
            Args:
                filename: Name of the processed file
                table_name: Name of the table data was loaded into
                row_count: Number of rows loaded
                status: Status of the loading operation (success or error message)
                archived_path: Path to the archived file
            """
            # Ensure the log file exists
            LoadingLogger.initialize_log()
            
            # Log the loading operation
            with open(LOADING_LOG_PATH, 'a', newline='') as f:
                writer = csv.writer(f)
                writer.writerow([
                    datetime.now().isoformat(),
                    filename,
                    table_name,
                    row_count,
                    status,
                    archived_path
                ])


def process_file(file_path: str) -> bool:
    """
    Process a single file using the loading components.
    
    Args:
        file_path: Path to the file to process
        
    Returns:
        bool: True if processing was successful, False otherwise
    """
    try:
        logger.info(f"Processing file: {file_path}")
        
        # Initialize the database manager
        db_manager = DatabaseManager()
        
        # Connect to the database
        db_manager.connect()
        
        try:
            # Load data from the file
            df, metadata = DataLoader.load_from_file(file_path)
            
            # Get the table name from the filename
            table_name = os.path.splitext(os.path.basename(file_path))[0]
            
            # Check if the table exists
            if not db_manager.table_exists(table_name):
                # Infer the schema
                schema = SchemaInferrer.infer_schema(df)
                
                # Create the table
                db_manager.create_table(table_name, schema)
            
            # Load the data
            row_count = db_manager.load_data(table_name, df.to_dict(orient='records'))
            
            # Archive the file
            archived_path = FileArchiver.archive_file(file_path)
            
            # Log the loading operation
            LoadingLogger.log_loading(
                os.path.basename(file_path),
                table_name,
                row_count,
                'success',
                archived_path
            )
            
            logger.info(f"File processed successfully: {file_path} -> {table_name}")
            return True
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            
            # Log the error
            try:
                LoadingLogger.log_loading(
                    os.path.basename(file_path),
                    table_name if 'table_name' in locals() else '',
                    0,
                    f'error: {str(e)}',
                    ''
                )
            except Exception as log_error:
                logger.error(f"Error logging loading operation: {log_error}")
            
            return False
        
        finally:
            # Disconnect from the database
            db_manager.disconnect()
            
    except Exception as e:
        logger.error(f"Error initializing processing for file {file_path}: {e}")
        return False


def main():
    """Process all CSV and JSON files in the enriched data directory."""
    logger.info(f"Looking for files in: {ENRICHED_DATA_DIR}")
    
    # Ensure the necessary directories exist
    os.makedirs(ENRICHED_DATA_DIR, exist_ok=True)
    os.makedirs(ARCHIVED_DATA_DIR, exist_ok=True)
    os.makedirs(LOGS_DIR, exist_ok=True)
    
    # Initialize the loading log
    LoadingLogger.initialize_log()
    
    # Get all CSV and JSON files in the enriched directory
    files_to_process = []
    for filename in os.listdir(ENRICHED_DATA_DIR):
        file_path = os.path.join(ENRICHED_DATA_DIR, filename)
        
        # Only process files (not directories)
        if os.path.isfile(file_path):
            file_extension = os.path.splitext(file_path)[1].lower()
            
            # Only process CSV and JSON files
            if file_extension in ['.csv', '.json']:
                files_to_process.append(file_path)
    
    if not files_to_process:
        logger.info(f"No CSV or JSON files found in {ENRICHED_DATA_DIR}")
        return
    
    logger.info(f"Found {len(files_to_process)} files to process")
    
    # Process each file
    success_count = 0
    for file_path in files_to_process:
        if process_file(file_path):
            success_count += 1
    
    logger.info(f"Processing complete. {success_count}/{len(files_to_process)} files processed successfully.")
    
    # Show the archived files
    archived_files = os.listdir(ARCHIVED_DATA_DIR)
    if archived_files:
        logger.info(f"Archived files in {ARCHIVED_DATA_DIR}:")
        for filename in archived_files:
            logger.info(f"  - {filename}")


if __name__ == "__main__":
    main()
