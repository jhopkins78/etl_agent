#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
File Router Agent Demo

This script demonstrates the functionality of the file_router_agent.py module
by creating a sample folder structure with various file types and then routing
them to the appropriate locations.
"""

import os
import shutil
import tempfile
from pathlib import Path
from insight_agent.tasks import route_files_from_folder, route_file

def create_sample_folder():
    """
    Create a sample folder structure with various file types for testing.
    
    Returns:
        str: Path to the created sample folder
    """
    # Create a temporary directory
    temp_dir = tempfile.mkdtemp(prefix="file_router_demo_")
    print(f"Created sample folder: {temp_dir}")
    
    # Create sample CSV file
    csv_content = "id,name,value\n1,Item 1,10.5\n2,Item 2,20.3\n3,Item 3,15.7"
    with open(os.path.join(temp_dir, "sample_data.csv"), "w") as f:
        f.write(csv_content)
    print("Created sample_data.csv")
    
    # Create sample Excel file (just a text file with .xlsx extension for demo purposes)
    with open(os.path.join(temp_dir, "sample_data.xlsx"), "w") as f:
        f.write("This is a mock Excel file for demonstration purposes.")
    print("Created sample_data.xlsx")
    
    # Create sample Markdown file
    md_content = """# Sample Assignment
    
## Objective
Analyze the provided dataset and build a predictive model.

## Tasks
1. Perform exploratory data analysis
2. Build a regression model
3. Evaluate model performance
4. Generate a comprehensive report
"""
    with open(os.path.join(temp_dir, "assignment.md"), "w") as f:
        f.write(md_content)
    print("Created assignment.md")
    
    # Create sample text file
    with open(os.path.join(temp_dir, "notes.txt"), "w") as f:
        f.write("These are some additional notes for the assignment.")
    print("Created notes.txt")
    
    # Create sample PDF file (just a text file with .pdf extension for demo purposes)
    with open(os.path.join(temp_dir, "reference.pdf"), "w") as f:
        f.write("This is a mock PDF file for demonstration purposes.")
    print("Created reference.pdf")
    
    # Create a subfolder with additional files
    subfolder = os.path.join(temp_dir, "additional_data")
    os.makedirs(subfolder)
    
    # Create another CSV file in the subfolder
    with open(os.path.join(subfolder, "more_data.csv"), "w") as f:
        f.write("id,category,amount\n1,A,100\n2,B,200\n3,C,300")
    print("Created additional_data/more_data.csv")
    
    # Create an unsupported file type
    with open(os.path.join(subfolder, "config.json"), "w") as f:
        f.write('{"setting1": "value1", "setting2": "value2"}')
    print("Created additional_data/config.json")
    
    return temp_dir

def cleanup_sample_folder(folder_path):
    """
    Clean up the sample folder after testing.
    
    Args:
        folder_path (str): Path to the sample folder to clean up
    """
    try:
        shutil.rmtree(folder_path)
        print(f"Cleaned up sample folder: {folder_path}")
    except Exception as e:
        print(f"Error cleaning up sample folder: {str(e)}")

def main():
    """Main function to demonstrate the file_router_agent.py functionality."""
    print("=" * 50)
    print("File Router Agent Demo")
    print("=" * 50)
    
    # Create sample folder structure
    sample_folder = create_sample_folder()
    
    try:
        # Display the sample folder structure
        print("\nSample folder structure:")
        for root, dirs, files in os.walk(sample_folder):
            level = root.replace(sample_folder, '').count(os.sep)
            indent = ' ' * 4 * level
            print(f"{indent}{os.path.basename(root)}/")
            sub_indent = ' ' * 4 * (level + 1)
            for file in files:
                print(f"{sub_indent}{file}")
        
        # Route files from the sample folder
        print("\nRouting files from sample folder...")
        results = route_files_from_folder(sample_folder)
        
        # Display routing results
        print("\nRouting results:")
        print(f"Status: {results['status']}")
        print(f"Processed: {results['processed_files']} files")
        print(f"Successful: {results['successful_files']}")
        print(f"Failed: {results['failed_files']}")
        print(f"Skipped: {results['skipped_files']}")
        
        # Display details for each file
        print("\nFile details:")
        for detail in results['details']:
            status = detail.get('status', 'Unknown')
            source = detail.get('source', 'Unknown')
            message = detail.get('message', 'No message')
            print(f"- {os.path.basename(source)}: {status} - {message}")
        
        # Display the log file
        log_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'logs', 'router_log.csv')
        if os.path.exists(log_file):
            print(f"\nLog file ({log_file}):")
            with open(log_file, 'r') as f:
                print(f.read())
        
        # Display the destination directories
        print("\nDestination directories:")
        data_raw_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'raw')
        docs_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'docs')
        assignment_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'assignment.md')
        
        print(f"\nData raw directory ({data_raw_dir}):")
        if os.path.exists(data_raw_dir):
            for file in os.listdir(data_raw_dir):
                print(f"- {file}")
        
        print(f"\nDocs directory ({docs_dir}):")
        if os.path.exists(docs_dir):
            for file in os.listdir(docs_dir):
                print(f"- {file}")
        
        print(f"\nAssignment file ({assignment_path}):")
        if os.path.exists(assignment_path):
            print("Assignment file exists")
        
    finally:
        # Clean up the sample folder
        cleanup_sample_folder(sample_folder)
    
    print("\n" + "=" * 50)
    print("Demo completed")
    print("=" * 50)

if __name__ == "__main__":
    main()
