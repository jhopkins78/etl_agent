#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EDA Agent Module

This module provides functionality for automated exploratory data analysis (EDA)
on structured CSV datasets. It generates comprehensive reports with visualizations
and statistical insights.

The agent reads CSV files, performs analysis, and outputs findings in Markdown format.
"""

import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import missingno as msno
from datetime import datetime
import logging
from typing import List, Dict, Any, Optional, Tuple, Union

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('eda_agent')

class EdaAgent:
    """
    Agent for performing exploratory data analysis on structured datasets.
    
    This class provides methods to analyze CSV data and generate comprehensive
    reports with visualizations and statistical insights.
    """
    
    def __init__(self, report_path: str = None):
        """
        Initialize the EDA Agent.
        
        Args:
            report_path (str, optional): Path to the output report file.
                If not provided, defaults to "reports/final_report.md" in the etl_agents directory.
        """
        if report_path is None:
            # Use absolute path based on the etl_agents directory
            base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
            self.report_path = os.path.join(base_dir, "reports", "final_report.md")
        else:
            self.report_path = report_path
            
        self.ensure_report_dir()
        logger.info(f"EDA Agent initialized with report path: {self.report_path}")
    
    def ensure_report_dir(self) -> None:
        """Ensure the reports directory exists."""
        os.makedirs(os.path.dirname(self.report_path), exist_ok=True)
    
    def run_eda(self, dataset_path: str) -> bool:
        """
        Run exploratory data analysis on the specified dataset.
        
        Args:
            dataset_path (str): Path to the CSV dataset to analyze.
            
        Returns:
            bool: True if analysis was successful, False otherwise.
        """
        try:
            # Validate file exists and is CSV
            if not os.path.exists(dataset_path):
                logger.error(f"Dataset not found: {dataset_path}")
                return False
            
            if not dataset_path.lower().endswith('.csv'):
                logger.error(f"File is not a CSV: {dataset_path}")
                return False
            
            # Read the dataset
            logger.info(f"Reading dataset: {dataset_path}")
            df = pd.read_csv(dataset_path)
            
            # Generate timestamp for the report
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Create report sections
            report_sections = [
                self._generate_header(dataset_path, timestamp),
                self._analyze_basic_info(df),
                self._analyze_missing_values(df),
                self._analyze_numeric_data(df),
                self._analyze_categorical_data(df),
                self._generate_visualizations(df)
            ]
            
            # Write report to file
            with open(self.report_path, 'a') as f:
                f.write('\n\n'.join(report_sections))
            
            logger.info(f"EDA report successfully appended to {self.report_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error during EDA: {str(e)}")
            return False
    
    def _generate_header(self, dataset_path: str, timestamp: str) -> str:
        """Generate the report header section."""
        filename = os.path.basename(dataset_path)
        return f"""
# Exploratory Data Analysis Report: {filename}

**Generated on:** {timestamp}

This report contains an automated exploratory data analysis of the dataset `{filename}`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---
"""
    
    def _analyze_basic_info(self, df: pd.DataFrame) -> str:
        """Analyze and report basic dataset information."""
        # Get basic info
        rows, cols = df.shape
        dtypes = df.dtypes.value_counts().to_dict()
        dtype_str = ", ".join([f"{count} {dtype} columns" for dtype, count in dtypes.items()])
        
        # Create code block for shape and dtypes
        code_block = f"""```python
# Dataset Shape
df.shape
# Output: ({rows}, {cols})

# Data Types
df.dtypes.value_counts()
# Output: 
{df.dtypes.value_counts().to_string()}
```"""
        
        # Create summary statistics code block
        stats_code = """```python
# Summary Statistics
df.describe().T
```"""
        
        # Generate the section
        section = f"""
## Basic Dataset Information

The dataset contains **{rows} rows** and **{cols} columns**. It includes {dtype_str}.

{code_block}

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

{stats_code}

{df.describe().T.to_markdown()}

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.
"""
        return section
    
    def _analyze_missing_values(self, df: pd.DataFrame) -> str:
        """Analyze and report on missing values in the dataset."""
        # Calculate missing values
        missing = df.isnull().sum()
        missing_percent = (missing / len(df)) * 100
        missing_df = pd.DataFrame({
            'Missing Values': missing,
            'Percentage': missing_percent
        })
        missing_df = missing_df[missing_df['Missing Values'] > 0].sort_values('Missing Values', ascending=False)
        
        # Create code block
        code_block = """```python
# Missing Values Analysis
missing = df.isnull().sum()
missing_percent = (missing / len(df)) * 100
missing_df = pd.DataFrame({
    'Missing Values': missing,
    'Percentage': missing_percent
})
missing_df = missing_df[missing_df['Missing Values'] > 0].sort_values('Missing Values', ascending=False)
```"""
        
        # Generate the section
        if len(missing_df) > 0:
            section = f"""
## Missing Values Analysis

The dataset contains missing values in {len(missing_df)} columns. The table below shows the count and percentage of missing values:

{code_block}

{missing_df.to_markdown()}

Understanding missing values is crucial as they can significantly impact analysis results and model performance.
"""
        else:
            section = """
## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```
"""
        return section
    
    def _analyze_numeric_data(self, df: pd.DataFrame) -> str:
        """Analyze and report on numeric columns in the dataset."""
        # Identify numeric columns
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        
        if not numeric_cols:
            return """
## Numeric Data Analysis

The dataset does not contain any numeric columns for analysis.
"""
        
        # Create correlation code block
        corr_code = """```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```"""
        
        # Generate the section
        section = f"""
## Numeric Data Analysis

The dataset contains **{len(numeric_cols)} numeric columns**: {', '.join([f'`{col}`' for col in numeric_cols])}.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

{corr_code}

A correlation matrix heatmap visualization is included in the Visualizations section.
"""
        return section
    
    def _analyze_categorical_data(self, df: pd.DataFrame) -> str:
        """Analyze and report on categorical columns in the dataset."""
        # Identify categorical columns
        categorical_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
        
        if not categorical_cols:
            return """
## Categorical Data Analysis

The dataset does not contain any categorical columns for analysis.
"""
        
        # Create value counts code block
        value_counts_code = """```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\\n{col}:\\n{df[col].value_counts().head(10)}")
```"""
        
        # Generate the section with sample value counts for first categorical column
        section = f"""
## Categorical Data Analysis

The dataset contains **{len(categorical_cols)} categorical columns**: {', '.join([f'`{col}`' for col in categorical_cols])}.

### Value Distributions

Below is a sample of value counts for categorical variables:

{value_counts_code}

"""
        # Add sample value counts for up to 3 categorical columns
        for col in categorical_cols[:3]:
            section += f"""
#### {col}

```
{df[col].value_counts().head(10).to_string()}
```
"""
        
        return section
    
    def _generate_visualizations(self, df: pd.DataFrame) -> str:
        """Generate visualization code blocks for the report."""
        # Identify numeric and categorical columns
        numeric_cols = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'category', 'bool']).columns.tolist()
        
        # Create visualization code blocks
        missing_viz_code = """```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```"""
        
        hist_code = """```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```"""
        
        corr_heatmap_code = """```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```"""
        
        boxplot_code = """```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```"""
        
        pairplot_code = """```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```"""
        
        cat_count_code = """```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```"""
        
        # Generate the section
        section = f"""
## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

{missing_viz_code}

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

{hist_code}

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

{corr_heatmap_code}

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

{boxplot_code}

### Pairplot

Pairplots show relationships between pairs of numeric features:

{pairplot_code}

### Categorical Features

Bar charts show the distribution of categorical features:

{cat_count_code}
"""
        return section


def run_eda(dataset_path: str) -> bool:
    """
    Run exploratory data analysis on the specified dataset.
    
    This is the main function to be called from external modules.
    
    Args:
        dataset_path (str): Path to the CSV dataset to analyze.
        
    Returns:
        bool: True if analysis was successful, False otherwise.
    """
    agent = EdaAgent()
    return agent.run_eda(dataset_path)


if __name__ == "__main__":
    # If run as a script, accept dataset path as command line argument
    if len(sys.argv) != 2:
        print("Usage: python eda_agent.py <dataset_path>")
        sys.exit(1)
    
    dataset_path = sys.argv[1]
    success = run_eda(dataset_path)
    
    if success:
        print(f"EDA completed successfully. Report saved to ./reports/final_report.md")
    else:
        print(f"EDA failed. Check logs for details.")
        sys.exit(1)
