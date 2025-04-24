#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent Runner Module

This module provides functionality to run the Insight Agent as a subprocess.
It handles the execution of EDA tasks and other data analysis operations.
"""

import os
import glob
import subprocess
import logging
from typing import Dict, Any, Optional, Tuple, List

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('agent_runner')

def get_latest_data_file() -> Optional[str]:
    """
    Find the most recent CSV or Excel file in the data/raw directory.
    
    Returns:
        Optional[str]: Path to the most recent data file, or None if no files found.
    """
    try:
        # Get the project root directory
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        project_root = os.path.dirname(current_dir)
        
        # Path to data/raw directory
        data_raw_dir = os.path.join(project_root, 'data', 'raw')
        
        # Check if directory exists
        if not os.path.exists(data_raw_dir):
            logger.error(f"Data directory not found: {data_raw_dir}")
            return None
        
        # Find all CSV and Excel files
        csv_files = glob.glob(os.path.join(data_raw_dir, '*.csv'))
        xlsx_files = glob.glob(os.path.join(data_raw_dir, '*.xlsx'))
        xls_files = glob.glob(os.path.join(data_raw_dir, '*.xls'))
        
        # Combine all files
        all_files = csv_files + xlsx_files + xls_files
        
        if not all_files:
            logger.error("No data files found in data/raw directory")
            return None
        
        # Sort files by modification time (newest first)
        all_files.sort(key=os.path.getmtime, reverse=True)
        
        # Return the most recent file
        latest_file = all_files[0]
        logger.info(f"Found latest data file: {latest_file}")
        return latest_file
        
    except Exception as e:
        logger.error(f"Error finding latest data file: {str(e)}")
        return None

def check_data_readiness(dataset_path: str) -> Tuple[bool, str]:
    """
    Check if the dataset needs transformation before analysis.
    
    Args:
        dataset_path (str): Path to the dataset file.
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the data is ready for analysis, False otherwise.
            - str: Status message or error details.
    """
    try:
        # This is a placeholder for actual data readiness checking logic
        # In a real implementation, this would analyze the data and determine
        # if it needs cleaning, transformation, etc.
        
        # For now, we'll assume all data is ready
        logger.info(f"Data readiness check passed for {dataset_path}")
        return True, "Data is ready for analysis"
        
    except Exception as e:
        logger.error(f"Error checking data readiness: {str(e)}")
        return False, f"Error checking data readiness: {str(e)}"

def run_command(cmd: List[str], task_name: str) -> Tuple[bool, str]:
    """
    Run a command as a subprocess and return the result.
    
    Args:
        cmd (List[str]): Command to run as a list of strings.
        task_name (str): Name of the task for logging purposes.
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the command was successful, False otherwise.
            - str: Status message or error details.
    """
    try:
        logger.info(f"Running {task_name} command: {' '.join(cmd)}")
        
        # Run the command as a subprocess
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=False  # Don't raise exception on non-zero exit
        )
        
        # Check if the command was successful
        if result.returncode == 0:
            logger.info(f"{task_name} completed successfully")
            return True, f"{task_name} completed successfully"
        else:
            logger.error(f"{task_name} failed: {result.stderr}")
            return False, f"{task_name} failed: {result.stderr}"
            
    except Exception as e:
        logger.error(f"Error running {task_name}: {str(e)}")
        return False, f"Error running {task_name}: {str(e)}"

def run_eda_task(dataset_path: str) -> Tuple[bool, str]:
    """
    Run the Exploratory Data Analysis task using the Insight Agent.
    
    Args:
        dataset_path (str): Path to the CSV dataset to analyze.
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the task was successful, False otherwise.
            - str: Status message or error details.
    """
    try:
        # Get the absolute path to the etl_agents directory
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        project_root = os.path.dirname(current_dir)
        
        # Ensure the dataset path is absolute
        if not os.path.isabs(dataset_path):
            dataset_path = os.path.abspath(dataset_path)
        
        # Validate dataset exists
        if not os.path.exists(dataset_path):
            return False, f"Dataset not found: {dataset_path}"
        
        # Command to run the Insight Agent
        cmd = [
            "python", "-m", "insight_agent.insight_agent",
            "--dataset", dataset_path
        ]
        
        return run_command(cmd, "EDA task")
            
    except Exception as e:
        logger.error(f"Error running EDA task: {str(e)}")
        return False, f"Error running EDA task: {str(e)}"

def run_model_training(dataset_path: str, target_column: str) -> Tuple[bool, str]:
    """
    Run the Model Training task using the Insight Agent.
    
    Args:
        dataset_path (str): Path to the CSV dataset to analyze.
        target_column (str): Name of the target column for modeling.
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the task was successful, False otherwise.
            - str: Status message or error details.
    """
    try:
        # Ensure the dataset path is absolute
        if not os.path.isabs(dataset_path):
            dataset_path = os.path.abspath(dataset_path)
        
        # Validate dataset exists
        if not os.path.exists(dataset_path):
            return False, f"Dataset not found: {dataset_path}"
        
        # Command to run the Insight Agent for model training
        cmd = [
            "python", "-m", "insight_agent.insight_agent",
            "--dataset", dataset_path,
            "--train-models",
            "--target-column", target_column
        ]
        
        return run_command(cmd, "Model Training")
            
    except Exception as e:
        logger.error(f"Error running Model Training: {str(e)}")
        return False, f"Error running Model Training: {str(e)}"

def run_report_generation(assignment_path: Optional[str] = None) -> Tuple[bool, str]:
    """
    Run the Report Generation task using the Insight Agent.
    
    Args:
        assignment_path (Optional[str]): Path to the assignment.md file (optional).
        
    Returns:
        Tuple[bool, str]: A tuple containing:
            - bool: True if the task was successful, False otherwise.
            - str: Status message or error details.
    """
    try:
        # Command to run the Insight Agent for report generation
        cmd = [
            "python", "-m", "insight_agent.insight_agent",
            "--generate-report"
        ]
        
        # Add assignment path if provided
        if assignment_path:
            # Ensure the assignment path is absolute
            if not os.path.isabs(assignment_path):
                assignment_path = os.path.abspath(assignment_path)
            
            # Validate assignment exists
            if not os.path.exists(assignment_path):
                return False, f"Assignment file not found: {assignment_path}"
                
            cmd.extend(["--assignment", assignment_path])
        
        return run_command(cmd, "Report Generation")
            
    except Exception as e:
        logger.error(f"Error running Report Generation: {str(e)}")
        return False, f"Error running Report Generation: {str(e)}"

def run_full_pipeline() -> Dict[str, Any]:
    """
    Run the full Insight Agent pipeline:
    1. Find the most recent dataset
    2. Run EDA
    3. Train models
    4. Generate final report
    
    Returns:
        Dict[str, Any]: A dictionary containing:
            - status: 'success' or 'failure'
            - report_path: Path to the final report (if successful)
            - summary: Summary message
            - log_path: Path to the workflow log (if available)
            - error: Error message (if failed)
    """
    try:
        # Get the project root directory
        current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        project_root = os.path.dirname(current_dir)
        
        # Path to assignment.md
        assignment_path = os.path.join(project_root, 'assignment.md')
        
        # Path to reports directory
        reports_dir = os.path.join(project_root, 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        # Path to final report
        report_path = os.path.join(reports_dir, 'final_report.md')
        
        # Path to logs directory
        logs_dir = os.path.join(project_root, 'logs')
        os.makedirs(logs_dir, exist_ok=True)
        
        # Path to workflow log
        log_path = os.path.join(logs_dir, 'workflow_log.txt')
        
        # Find the most recent dataset
        dataset_path = get_latest_data_file()
        if not dataset_path:
            return {
                'status': 'failure',
                'error': 'No dataset found in data/raw directory',
                'summary': 'Pipeline failed: No dataset found'
            }
        
        # Check if the dataset is ready for analysis
        data_ready, data_message = check_data_readiness(dataset_path)
        if not data_ready:
            return {
                'status': 'failure',
                'error': data_message,
                'summary': 'Pipeline failed: Data not ready for analysis'
            }
        
        # Step 1: Run EDA
        eda_success, eda_message = run_eda_task(dataset_path)
        if not eda_success:
            return {
                'status': 'failure',
                'error': eda_message,
                'summary': 'Pipeline failed at EDA step'
            }
        
        # Step 2: Run Model Training
        # For simplicity, we'll use 'target' as the target column
        # In a real implementation, this would be determined from the data or user input
        target_column = 'target'
        training_success, training_message = run_model_training(dataset_path, target_column)
        if not training_success:
            return {
                'status': 'failure',
                'error': training_message,
                'summary': 'Pipeline failed at Model Training step'
            }
        
        # Step 3: Generate Final Report
        report_success, report_message = run_report_generation(
            assignment_path if os.path.exists(assignment_path) else None
        )
        if not report_success:
            return {
                'status': 'failure',
                'error': report_message,
                'summary': 'Pipeline failed at Report Generation step'
            }
        
        # All steps completed successfully
        return {
            'status': 'success',
            'report_path': report_path,
            'summary': 'Full pipeline completed successfully',
            'log_path': log_path if os.path.exists(log_path) else None
        }
        
    except Exception as e:
        logger.error(f"Error running full pipeline: {str(e)}")
        return {
            'status': 'failure',
            'error': f"Error running full pipeline: {str(e)}",
            'summary': 'Pipeline failed due to an unexpected error'
        }
