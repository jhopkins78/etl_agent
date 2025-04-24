#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EDA Agent Test Script

This script tests the functionality of the EDA Agent by running it on a sample dataset.
It verifies that the agent can read a CSV file, perform analysis, and generate a report.
"""

import os
import sys
import argparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('test_eda_agent')

# Add the parent directory to the path to allow importing the modules
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

# Import the EDA agent directly
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'insight_agent', 'tasks'))
from eda_agent import run_eda


def test_eda_agent(dataset_path=None):
    """
    Test the EDA Agent functionality.
    
    Args:
        dataset_path (str, optional): Path to the dataset to analyze.
            If not provided, uses the sample customer data.
    
    Returns:
        bool: True if the test was successful, False otherwise.
    """
    # Use default dataset if none provided
    if dataset_path is None:
        dataset_path = os.path.join('data', 'enriched', 'sample_customer_data.csv')
    
    # Ensure the path is absolute
    if not os.path.isabs(dataset_path):
        dataset_path = os.path.join(os.path.dirname(__file__), dataset_path)
    
    logger.info(f"Testing EDA Agent with dataset: {dataset_path}")
    
    # Verify the dataset exists
    if not os.path.exists(dataset_path):
        logger.error(f"Dataset not found: {dataset_path}")
        return False
    
    # Run the EDA agent
    success = run_eda(dataset_path)
    
    if success:
        report_path = os.path.join(os.path.dirname(__file__), 'reports', 'final_report.md')
        logger.info(f"EDA Agent test completed successfully")
        logger.info(f"Report generated at: {report_path}")
        
        # Verify the report was created
        if os.path.exists(report_path):
            logger.info(f"Report file exists and is {os.path.getsize(report_path)} bytes")
        else:
            logger.error(f"Report file was not created")
            return False
    else:
        logger.error(f"EDA Agent test failed")
        return False
    
    return True


def main():
    """Main entry point for the test script."""
    parser = argparse.ArgumentParser(description='Test the EDA Agent functionality')
    parser.add_argument('--dataset', type=str, 
                        help='Path to a specific dataset to analyze')
    
    args = parser.parse_args()
    
    # Run the test
    success = test_eda_agent(args.dataset)
    
    if success:
        print("EDA Agent test completed successfully!")
        return 0
    else:
        print("EDA Agent test failed!")
        return 1


if __name__ == "__main__":
    sys.exit(main())
