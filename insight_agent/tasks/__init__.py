"""
Insight Agent Tasks Package

This package contains specialized task agents for data analysis and reporting.
Each module provides specific functionality for analyzing data and generating insights.

Available modules:
- eda_agent: Exploratory Data Analysis
- model_agent: Machine Learning Model Training
- eval_agent: Model Evaluation and Comparison
- report_agent: Report Generation and Compilation
- file_router_agent: File Routing and Classification
"""

from .eda_agent import run_eda
from .model_agent import train_models
from .eval_agent import evaluate_models
from .report_agent import generate_report
from .file_router_agent import route_files_from_folder, route_files, route_file

__all__ = [
    'run_eda', 
    'train_models', 
    'evaluate_models', 
    'generate_report',
    'route_files_from_folder',
    'route_files',
    'route_file'
]
