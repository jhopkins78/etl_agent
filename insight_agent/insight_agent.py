#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Insight Agent Module

This module serves as the main entry point for the Insight Agent functionality.
It coordinates various data analysis tasks including exploratory data analysis,
model building, evaluation, and report generation.

The Insight Agent orchestrates the execution of specialized task agents to
provide comprehensive data insights.
"""

import os
import sys
import logging
import argparse
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any, Optional, Union

# Import task agents
from .tasks.eda_agent import run_eda
from .tasks.model_agent import train_models
from .tasks.eval_agent import evaluate_models
from .tasks.report_agent import generate_report
from .tasks.file_router_agent import route_files_from_folder, route_file

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('insight_agent')

class InsightAgent:
    """
    Main Insight Agent class that orchestrates data analysis tasks.
    
    This agent coordinates the execution of specialized task agents to
    provide comprehensive data insights.
    """
    
    def __init__(self, base_dir: str = "."):
        """
        Initialize the Insight Agent.
        
        Args:
            base_dir (str): Base directory for relative path resolution.
        """
        self.base_dir = base_dir
        self.data_dir = os.path.join(base_dir, "data")
        self.reports_dir = os.path.join(base_dir, "reports")
        self.ensure_directories()
        logger.info(f"Insight Agent initialized with base directory: {base_dir}")
    
    def ensure_directories(self) -> None:
        """Ensure required directories exist."""
        os.makedirs(self.data_dir, exist_ok=True)
        os.makedirs(os.path.join(self.data_dir, "enriched"), exist_ok=True)
        os.makedirs(self.reports_dir, exist_ok=True)
        logger.info("Directory structure verified")
    
    def run_exploratory_analysis(self, dataset_path: str) -> bool:
        """
        Run exploratory data analysis on the specified dataset.
        
        Args:
            dataset_path (str): Path to the CSV dataset to analyze.
            
        Returns:
            bool: True if analysis was successful, False otherwise.
        """
        logger.info(f"Starting exploratory data analysis on {dataset_path}")
        
        # Resolve path if it's relative
        if not os.path.isabs(dataset_path):
            # Check if the path already includes the base_dir
            if not dataset_path.startswith(self.base_dir):
                dataset_path = os.path.join(self.base_dir, dataset_path)
        
        # Validate dataset exists
        if not os.path.exists(dataset_path):
            logger.error(f"Dataset not found: {dataset_path}")
            return False
        
        # Set report path
        report_path = os.path.join(self.reports_dir, "final_report.md")
        
        # Run EDA
        success = run_eda(dataset_path)
        
        if success:
            logger.info(f"Exploratory data analysis completed successfully")
            logger.info(f"Report saved to {report_path}")
        else:
            logger.error(f"Exploratory data analysis failed")
        
        return success
    
    def run_model_training(self, dataset_path: str, target_column: str) -> bool:
        """
        Train machine learning models on the specified dataset.
        
        Args:
            dataset_path (str): Path to the CSV dataset to analyze.
            target_column (str): Name of the column to use as the target variable.
            
        Returns:
            bool: True if model training was successful, False otherwise.
        """
        logger.info(f"Starting model training on {dataset_path} with target column '{target_column}'")
        
        # Resolve path if it's relative
        if not os.path.isabs(dataset_path):
            # Check if the path already includes the base_dir
            if not dataset_path.startswith(self.base_dir):
                dataset_path = os.path.join(self.base_dir, dataset_path)
        
        # Validate dataset exists
        if not os.path.exists(dataset_path):
            logger.error(f"Dataset not found: {dataset_path}")
            return False
        
        # Train models
        try:
            models, predictions, metrics = train_models(dataset_path, target_column)
            
            if not models:
                logger.error("Model training failed")
                return False
                
            logger.info(f"Model training completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            return False
    
    def evaluate_trained_models(self, predictions_dict: Dict[str, pd.DataFrame]) -> bool:
        """
        Evaluate trained models based on their predictions.
        
        Args:
            predictions_dict (Dict[str, pd.DataFrame]): Dictionary mapping model names to DataFrames
                containing 'actual' and 'predicted' columns.
                
        Returns:
            bool: True if evaluation was successful, False otherwise.
        """
        logger.info(f"Starting model evaluation for {len(predictions_dict)} models")
        
        try:
            # Evaluate models
            metrics = evaluate_models(predictions_dict)
            
            if not metrics:
                logger.error("Model evaluation failed")
                return False
                
            logger.info(f"Model evaluation completed successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error during model evaluation: {str(e)}")
            return False
    
    def generate_final_report(self, assignment_path: str = None) -> bool:
        """
        Generate a comprehensive final report by combining all analysis phases.
        
        Args:
            assignment_path (str, optional): Path to the assignment metadata file.
                If provided, assignment details will be included in the introduction.
                
        Returns:
            bool: True if report generation was successful, False otherwise.
        """
        logger.info("Starting final report generation")
        
        # Resolve assignment path if it's relative and provided
        if assignment_path and not os.path.isabs(assignment_path):
            # Check if the path already includes the base_dir
            if not assignment_path.startswith(self.base_dir):
                assignment_path = os.path.join(self.base_dir, assignment_path)
        
        # Generate the report
        try:
            success = generate_report(assignment_path)
            
            if success:
                report_path = os.path.join(self.reports_dir, "final_report.md")
                logger.info(f"Final report successfully generated at {report_path}")
            else:
                logger.error("Final report generation failed")
            
            return success
            
        except Exception as e:
            logger.error(f"Error during report generation: {str(e)}")
            return False
    
    def route_files(self, folder_path: str) -> Dict[str, Any]:
        """
        Route files from a folder to appropriate locations based on file types.
        
        Args:
            folder_path (str): Path to the folder containing files to route.
            
        Returns:
            Dict[str, Any]: Dictionary with routing results.
        """
        logger.info(f"Starting file routing for folder: {folder_path}")
        
        # Resolve path if it's relative
        if not os.path.isabs(folder_path):
            # Check if the path already includes the base_dir
            if not folder_path.startswith(self.base_dir):
                folder_path = os.path.join(self.base_dir, folder_path)
        
        # Validate folder exists
        if not os.path.exists(folder_path):
            logger.error(f"Folder not found: {folder_path}")
            return {
                'status': 'failed',
                'error': f"Folder {folder_path} does not exist"
            }
        
        # Route files
        try:
            results = route_files_from_folder(folder_path)
            
            # Log summary
            logger.info(f"Processed {results['processed_files']} files:")
            logger.info(f"  - {results['successful_files']} succeeded")
            logger.info(f"  - {results['failed_files']} failed")
            logger.info(f"  - {results['skipped_files']} skipped")
            
            return results
            
        except Exception as e:
            logger.error(f"Error during file routing: {str(e)}")
            return {
                'status': 'failed',
                'error': str(e)
            }
    
    def process_enriched_data(self) -> List[bool]:
        """
        Process all CSV files in the enriched data directory.
        
        Returns:
            List[bool]: List of success/failure results for each file processed.
        """
        enriched_dir = os.path.join(self.data_dir, "enriched")
        logger.info(f"Processing all CSV files in {enriched_dir}")
        
        # Get all CSV files in the enriched directory
        csv_files = [
            os.path.join(enriched_dir, f) 
            for f in os.listdir(enriched_dir) 
            if f.lower().endswith('.csv')
        ]
        
        if not csv_files:
            logger.warning(f"No CSV files found in {enriched_dir}")
            return []
        
        # Process each file
        results = []
        for csv_file in csv_files:
            logger.info(f"Processing {csv_file}")
            success = self.run_exploratory_analysis(csv_file)
            results.append(success)
        
        # Log summary
        success_count = sum(results)
        logger.info(f"Processed {len(results)} files: {success_count} succeeded, {len(results) - success_count} failed")
        
        return results


def main():
    """Main entry point for the Insight Agent."""
    parser = argparse.ArgumentParser(description='Insight Agent for data analysis')
    parser.add_argument('--base-dir', type=str, default=".", 
                        help='Base directory for relative path resolution')
    parser.add_argument('--dataset', type=str, 
                        help='Path to a specific dataset to analyze')
    parser.add_argument('--process-all', action='store_true',
                        help='Process all CSV files in the enriched data directory')
    parser.add_argument('--train-models', action='store_true',
                        help='Train machine learning models on the dataset')
    parser.add_argument('--target-column', type=str,
                        help='Target column for model training (required with --train-models)')
    parser.add_argument('--generate-report', action='store_true',
                        help='Generate a comprehensive final report')
    parser.add_argument('--assignment', type=str,
                        help='Path to assignment metadata file to include in the report')
    parser.add_argument('--route-files', type=str, metavar='FOLDER_PATH',
                        help='Route files from a folder to appropriate locations based on file types')
    
    args = parser.parse_args()
    
    # Initialize the agent
    agent = InsightAgent(base_dir=args.base_dir)
    
    # Process based on arguments
    if args.route_files:
        results = agent.route_files(args.route_files)
        if results['status'] == 'success':
            print(f"Successfully routed {results['successful_files']} files.")
            if results['skipped_files'] > 0:
                print(f"Skipped {results['skipped_files']} unsupported files.")
            return 0
        elif results['status'] == 'partial_success':
            print(f"Partially successful: {results['successful_files']} succeeded, {results['failed_files']} failed.")
            return 1
        else:
            print(f"Failed to route files: {results.get('error', 'Unknown error')}")
            return 1
    elif args.generate_report:
        success = agent.generate_final_report(args.assignment)
        if success:
            print("Final report generated successfully.")
            return 0
        else:
            print("Failed to generate final report.")
            return 1
    elif args.process_all:
        results = agent.process_enriched_data()
        if not results:
            print("No files were processed.")
            return 1
        elif all(results):
            print("All files were processed successfully.")
            return 0
        else:
            print(f"{sum(results)}/{len(results)} files were processed successfully.")
            return 1
    elif args.dataset:
        # Run EDA
        success = agent.run_exploratory_analysis(args.dataset)
        if not success:
            print(f"Failed to analyze dataset {args.dataset}.")
            return 1
        
        # Train models if requested
        if args.train_models:
            if not args.target_column:
                print("Error: --target-column is required when using --train-models")
                return 1
                
            success = agent.run_model_training(args.dataset, args.target_column)
            if not success:
                print(f"Failed to train models on dataset {args.dataset}.")
                return 1
            else:
                print(f"Models trained successfully on dataset {args.dataset}.")
        
        print(f"Dataset {args.dataset} was processed successfully.")
        return 0
    else:
        parser.print_help()
        return 1


if __name__ == "__main__":
    sys.exit(main())
