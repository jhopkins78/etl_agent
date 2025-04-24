#!/usr/bin/env python3
"""
Test script for the ModelAgent class with the abalone dataset.
"""

import os
import sys
from insight_agent.tasks.model_agent import ModelAgent

def main():
    """
    Main function to test the ModelAgent with the abalone dataset.
    """
    # Path to the abalone dataset
    dataset_path = os.path.join(os.getcwd(), "abalone", "abalone.csv")
    
    # Target column
    target_column = "Rings"
    
    # Create a ModelAgent instance
    agent = ModelAgent()
    
    # Train and evaluate models with hyperparameter tuning and Bayesian optimization
    print(f"Training models on {dataset_path} with target column {target_column}...")
    models, predictions, metrics = agent.train_and_evaluate(
        dataset_path=dataset_path,
        target_column=target_column,
        tune_models=True,
        use_bayesian_optimization=True,
        n_jobs=-1,
        cv=5
    )
    
    # Print the results
    if models:
        print("Model training completed successfully.")
        print(f"Reports saved to {agent.report_path}")
        print(f"Leaderboard saved to {agent.leaderboard_path}")
        print(f"Recommendation saved to {agent.recommendation_path}")
        print(f"Visualizations saved to {agent.visuals_dir}")
    else:
        print("Model training failed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
