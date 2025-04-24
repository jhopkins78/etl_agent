"""
Test script for the file_router_agent module.

This script demonstrates how to use the file_router_agent to route files
based on their extensions to the appropriate locations.
"""

import os
import sys
from insight_agent.tasks import route_files_from_folder, route_file

def test_route_single_file():
    """Test routing a single file"""
    print("\n=== Testing Single File Routing ===")
    
    # Example file paths (replace with actual files for testing)
    csv_file = os.path.join('data', 'raw', 'sample_customers.csv')
    md_file = 'assignment.md'
    
    if os.path.exists(csv_file):
        print(f"\nRouting CSV file: {csv_file}")
        result = route_file(csv_file)
        print(f"Status: {result['status']}")
        print(f"Message: {result['message']}")
    else:
        print(f"File not found: {csv_file}")
    
    if os.path.exists(md_file):
        print(f"\nRouting Markdown file: {md_file}")
        result = route_file(md_file)
        print(f"Status: {result['status']}")
        print(f"Message: {result['message']}")
    else:
        print(f"File not found: {md_file}")


def test_route_folder():
    """Test routing all files in a folder"""
    print("\n=== Testing Folder Routing ===")
    
    # Example folder path (replace with actual folder for testing)
    folder_path = os.path.join('data', 'raw')
    
    if os.path.exists(folder_path):
        print(f"\nRouting all files in folder: {folder_path}")
        result = route_files_from_folder(folder_path)
        
        print(f"Status: {result['status']}")
        print(f"Processed: {result['processed_files']} files")
        print(f"Successful: {result['successful_files']}")
        print(f"Failed: {result['failed_files']}")
        print(f"Skipped: {result['skipped_files']}")
        
        # Print details for each file
        print("\nFile Details:")
        for detail in result['details']:
            print(f"- {detail.get('source', 'Unknown')}: {detail.get('status', 'Unknown')} - {detail.get('message', 'No message')}")
    else:
        print(f"Folder not found: {folder_path}")


if __name__ == "__main__":
    # Run tests
    test_route_single_file()
    test_route_folder()
    
    print("\nTests completed.")
