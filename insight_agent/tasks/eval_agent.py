#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Evaluation Agent Module

This module provides functionality for evaluating the performance of trained machine
learning models based on their predictions and ground truth labels. It computes
various evaluation metrics and generates formatted reports.

The agent accepts prediction DataFrames from different models, calculates performance
metrics, and outputs a comparative analysis in Markdown format.
"""

import os
import sys
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
import logging
from datetime import datetime
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('eval_agent')

class EvalAgent:
    """
    Agent for evaluating machine learning model performance.
    
    This class provides methods to compute evaluation metrics for regression models
    and generate comprehensive comparison reports.
    """
    
    def __init__(self, report_path: str = None):
        """
        Initialize the Evaluation Agent.
        
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
        logger.info(f"Evaluation Agent initialized with report path: {self.report_path}")
    
    def ensure_report_dir(self) -> None:
        """Ensure the reports directory exists."""
        os.makedirs(os.path.dirname(self.report_path), exist_ok=True)
    
    def evaluate_models(self, predictions_dict: Dict[str, pd.DataFrame]) -> Dict[str, Dict[str, float]]:
        """
        Evaluate multiple models based on their predictions.
        
        Args:
            predictions_dict (Dict[str, pd.DataFrame]): Dictionary mapping model names to DataFrames
                containing 'actual' and 'predicted' columns.
                
        Returns:
            Dict[str, Dict[str, float]]: Dictionary of evaluation metrics for each model.
        """
        logger.info(f"Evaluating {len(predictions_dict)} models")
        
        # Validate input
        for model_name, df in predictions_dict.items():
            if 'actual' not in df.columns or 'predicted' not in df.columns:
                logger.error(f"DataFrame for {model_name} missing required columns 'actual' and/or 'predicted'")
                return {}
        
        # Calculate metrics for each model
        metrics = {}
        for model_name, df in predictions_dict.items():
            logger.info(f"Calculating metrics for {model_name}")
            
            y_true = df['actual']
            y_pred = df['predicted']
            
            # Calculate metrics
            r2 = r2_score(y_true, y_pred)
            rmse = np.sqrt(mean_squared_error(y_true, y_pred))
            mae = mean_absolute_error(y_true, y_pred)
            
            metrics[model_name] = {
                'r2': r2,
                'rmse': rmse,
                'mae': mae
            }
            
            logger.info(f"Metrics for {model_name}: R² = {r2:.4f}, RMSE = {rmse:.4f}, MAE = {mae:.4f}")
        
        # Generate and append report
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        report = self._generate_report(metrics, timestamp)
        
        with open(self.report_path, 'a') as f:
            f.write(report)
        
        logger.info(f"Evaluation report successfully appended to {self.report_path}")
        return metrics
    
    def _generate_report(self, metrics: Dict[str, Dict[str, float]], timestamp: str) -> str:
        """
        Generate a Markdown report comparing model performance.
        
        Args:
            metrics (Dict[str, Dict[str, float]]): Dictionary of evaluation metrics for each model.
            timestamp (str): Timestamp for the report.
            
        Returns:
            str: Markdown formatted report.
        """
        # Create metrics table
        metrics_df = pd.DataFrame({
            'Model': [],
            'R² Score': [],
            'RMSE': [],
            'MAE': []
        })
        
        for model_name, model_metrics in metrics.items():
            metrics_df = pd.concat([metrics_df, pd.DataFrame({
                'Model': [model_name],
                'R² Score': [model_metrics['r2']],
                'RMSE': [model_metrics['rmse']],
                'MAE': [model_metrics['mae']]
            })], ignore_index=True)
        
        # Determine best model based on R² score
        best_model = metrics_df.loc[metrics_df['R² Score'].idxmax()]['Model']
        best_r2 = metrics_df.loc[metrics_df['R² Score'].idxmax()]['R² Score']
        
        # Generate the report
        report = f"""

# Model Evaluation Report

**Generated on:** {timestamp}

This report compares the performance of different regression models based on their predictions.

---

## Model Performance Comparison

The table below shows the performance metrics for each model:

{metrics_df.to_markdown(index=False, floatfmt='.4f')}

### Metrics Explanation

- **R² Score (Coefficient of Determination)**: Measures the proportion of variance in the dependent variable that is predictable from the independent variables. 
  - Range: -∞ to 1.0 (higher is better)
  - A value of 1.0 indicates perfect prediction
  - A value of 0.0 indicates that the model predicts no better than the mean of the data
  - Negative values indicate the model performs worse than simply predicting the mean

- **RMSE (Root Mean Squared Error)**: Measures the square root of the average squared differences between predicted and actual values.
  - Units: Same as the target variable
  - Range: 0 to ∞ (lower is better)
  - Penalizes large errors more heavily than small ones
  - Useful when large errors are particularly undesirable

- **MAE (Mean Absolute Error)**: Measures the average absolute differences between predicted and actual values.
  - Units: Same as the target variable
  - Range: 0 to ∞ (lower is better)
  - Treats all error sizes equally
  - More robust to outliers than RMSE

## Conclusion

Based on the performance metrics, the **{best_model}** model shows the best overall performance with an R² score of {best_r2:.4f}, indicating that it explains approximately {best_r2 * 100:.1f}% of the variance in the target variable.

"""
        
        # Add more detailed comparison if we have exactly linear and knn models
        if 'linear' in metrics and 'knn' in metrics:
            linear_metrics = metrics['linear']
            knn_metrics = metrics['knn']
            
            # Compare R² scores
            r2_diff = abs(linear_metrics['r2'] - knn_metrics['r2'])
            r2_comparison = f"The difference in R² scores between the models is {r2_diff:.4f}."
            
            if linear_metrics['r2'] > knn_metrics['r2']:
                r2_winner = "Linear Regression outperforms KNN"
            elif knn_metrics['r2'] > linear_metrics['r2']:
                r2_winner = "KNN outperforms Linear Regression"
            else:
                r2_winner = "Both models perform equally well"
            
            # Compare error metrics
            rmse_comparison = ""
            if linear_metrics['rmse'] < knn_metrics['rmse']:
                rmse_comparison = "Linear Regression has a lower RMSE, indicating better prediction accuracy overall."
            elif knn_metrics['rmse'] < linear_metrics['rmse']:
                rmse_comparison = "KNN has a lower RMSE, indicating better prediction accuracy overall."
            
            mae_comparison = ""
            if linear_metrics['mae'] < knn_metrics['mae']:
                mae_comparison = "Linear Regression has a lower MAE, suggesting it makes fewer extreme errors."
            elif knn_metrics['mae'] < linear_metrics['mae']:
                mae_comparison = "KNN has a lower MAE, suggesting it makes fewer extreme errors."
            
            # Add detailed comparison to report
            report += f"""
### Linear Regression vs. KNN Comparison

{r2_comparison} {r2_winner} in terms of variance explained.

{rmse_comparison}

{mae_comparison}

"""
            
            # Add model-specific insights
            report += """
### Model-Specific Insights

**Linear Regression:**
- Assumes a linear relationship between features and target
- Generally faster to train and predict
- More interpretable (coefficients represent feature importance)
- May underperform when relationships are non-linear

**K-Nearest Neighbors:**
- Non-parametric, makes no assumptions about data distribution
- Can capture complex, non-linear patterns
- Performance depends heavily on feature scaling and the choice of k
- May struggle with high-dimensional data (curse of dimensionality)

### Recommendations

Based on this evaluation:
"""
            
            # Add recommendations based on results
            if best_model == 'linear':
                report += """
- The linear model's superior performance suggests the relationship between features and target is predominantly linear
- Consider feature engineering to further improve the linear model
- For production use, the linear model would be preferred for its combination of accuracy and efficiency
"""
            else:  # KNN is better
                report += """
- The KNN model's superior performance suggests non-linear patterns in the data
- Consider tuning the KNN hyperparameters (especially k) to further improve performance
- Explore other non-linear models like Random Forest or Gradient Boosting
- Ensure features are properly scaled when using the KNN model in production
"""
        
        report += """
---
"""
        return report


def evaluate_models(predictions_dict: Dict[str, pd.DataFrame]) -> Dict[str, Dict[str, float]]:
    """
    Evaluate machine learning models based on their predictions.
    
    This is the main function to be called from external modules.
    
    Args:
        predictions_dict (Dict[str, pd.DataFrame]): Dictionary mapping model names to DataFrames
            containing 'actual' and 'predicted' columns.
            Example:
            {
                "linear": linear_df,  # DataFrame with 'actual' and 'predicted' columns
                "knn": knn_df         # DataFrame with 'actual' and 'predicted' columns
            }
            
    Returns:
        Dict[str, Dict[str, float]]: Dictionary of evaluation metrics for each model.
    """
    agent = EvalAgent()
    return agent.evaluate_models(predictions_dict)


if __name__ == "__main__":
    # Example usage when run as a script
    print("This module is intended to be imported and used by other modules.")
    print("Example usage:")
    print("from insight_agent.tasks.eval_agent import evaluate_models")
    print("")
    print("# Create prediction DataFrames with 'actual' and 'predicted' columns")
    print("linear_df = pd.DataFrame({'actual': y_test, 'predicted': linear_predictions})")
    print("knn_df = pd.DataFrame({'actual': y_test, 'predicted': knn_predictions})")
    print("")
    print("# Evaluate models")
    print("predictions_dict = {'linear': linear_df, 'knn': knn_df}")
    print("metrics = evaluate_models(predictions_dict)")
