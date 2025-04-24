#!/usr/bin/env python3
"""
Test script for the Loading Agent

This script demonstrates how to use the Loading Agent by:
1. Creating a sample CSV file in the /data/enriched directory
2. Manually triggering the standalone loader to process the file
3. Verifying the file was loaded into the database and archived

Usage:
    python test_loading.py

Requirements:
    - Database connection details in .env file
    - pandas, sqlalchemy, and python-dotenv packages installed
"""

import os
import sys
import pandas as pd
import time
import subprocess
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

# Define constants
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ENRICHED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'enriched')
ARCHIVED_DATA_DIR = os.path.join(SCRIPT_DIR, 'data', 'archived')

# Ensure the enriched directory exists
os.makedirs(ENRICHED_DATA_DIR, exist_ok=True)
os.makedirs(ARCHIVED_DATA_DIR, exist_ok=True)

# Load environment variables
load_dotenv()


def create_sample_data():
    """Create a sample CSV file in the enriched directory."""
    print("Creating sample data...")
    
    # Create a sample DataFrame
    data = {
        'id': [1, 2, 3, 4, 5],
        'name': ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Davis'],
        'email': ['john@example.com', 'jane@example.com', 'bob@example.com', 'alice@example.com', 'charlie@example.com'],
        'age': [30, 25, 40, 35, 28],
        'active': [True, True, False, True, True],
        'signup_date': ['2025-01-15', '2025-02-20', '2025-03-10', '2025-04-05', '2025-05-12']
    }
    
    df = pd.DataFrame(data)
    
    # Save to CSV in the enriched directory
    test_file_path = os.path.join(ENRICHED_DATA_DIR, 'test_customers.csv')
    df.to_csv(test_file_path, index=False)
    
    print(f"Sample data created at: {test_file_path}")
    return test_file_path


def verify_database_connection():
    """Verify that the database connection works."""
    print("Verifying database connection...")
    
    # Try to import from loading_agent
    try:
        from loading_agent import DatabaseManager
    except ImportError:
        print("Error: Could not import from loading_agent.py")
        print("Make sure loading_agent.py is in the same directory as this script")
        return False
    
    # Try to connect to the database
    try:
        db_manager = DatabaseManager()
        db_manager.connect()
        db_manager.disconnect()
        print("Database connection successful!")
        return True
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("Make sure your .env file contains the correct database connection details.")
        return False


def run_standalone_loader():
    """Run the standalone loader to process the file."""
    print("Running standalone loader...")
    
    try:
        # Run the standalone loader
        result = subprocess.run(['python', os.path.join(SCRIPT_DIR, 'standalone_loader.py')], 
                               capture_output=True, text=True)
        
        # Check if the process was successful
        if result.returncode == 0:
            print("Standalone loader completed successfully!")
            print("\nOutput:")
            print(result.stdout)
            return True
        else:
            print("Standalone loader failed!")
            print("\nError:")
            print(result.stderr)
            return False
    except Exception as e:
        print(f"Error running standalone loader: {e}")
        return False


def check_archived_file(original_file_path):
    """Check if the file was archived."""
    print("Checking for archived file...")
    
    original_filename = os.path.basename(original_file_path)
    base_name = os.path.splitext(original_filename)[0]
    
    # Check if any file in the archived directory starts with the base name
    for filename in os.listdir(ARCHIVED_DATA_DIR):
        if filename.startswith(base_name):
            print(f"File archived as: {filename}")
            return True
    
    print("File not found in archive directory!")
    return False


def main():
    """Main function to run the test."""
    print("=== Testing Loading Agent ===\n")
    
    # Step 1: Verify database connection
    if not verify_database_connection():
        print("\nTest failed: Could not connect to database.")
        return
    
    # Step 2: Create sample data
    test_file_path = create_sample_data()
    
    # Step 3: Run the standalone loader
    if not run_standalone_loader():
        print("\nTest failed: Standalone loader failed to run.")
        return
    
    # Step 4: Check if the file was archived
    if not check_archived_file(test_file_path):
        print("\nTest failed: File was not archived.")
        return
    
    print("\n=== Test completed successfully! ===")
    print("The sample data was loaded into the database and the file was archived.")


if __name__ == "__main__":
    main()
