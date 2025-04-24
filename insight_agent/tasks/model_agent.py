#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Model Agent Module

This module provides functionality for training and evaluating machine learning models
on structured CSV datasets. It handles supervised learning problems, specifically
regression tasks, using multiple algorithms.

The agent reads CSV files, trains models, evaluates performance, generates visualizations,
and outputs findings in Markdown format along with a model leaderboard.
It also supports hyperparameter tuning using GridSearchCV or Optuna (Bayesian optimization).
"""

import os
import sys
import time
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Optional, Tuple, Union
import logging
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split, GridSearchCV, learning_curve
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.svm import SVR
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.preprocessing import StandardScaler

# Try to import XGBoost (optional)
try:
    import xgboost as xgb
    XGBOOST_AVAILABLE = True
except ImportError:
    XGBOOST_AVAILABLE = False
    logging.warning("XGBoost not available. Install with 'pip install xgboost' to use XGBoostRegressor.")

# Try to import Optuna (optional)
try:
    import optuna
    OPTUNA_AVAILABLE = True
except ImportError:
    OPTUNA_AVAILABLE = False
    logging.warning("Optuna not available. Install with 'pip install optuna' to use Bayesian optimization.")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('model_agent')

class ModelAgent:
    """
    Agent for training and evaluating machine learning models on structured datasets.
    
    This class provides methods to train regression models on CSV data, generate
    comprehensive reports with model performance metrics, predictions, and visualizations.
    It also supports hyperparameter tuning using GridSearchCV or Optuna.
    """
    
    def __init__(self, report_path: str = None):
        """
        Initialize the Model Agent.
        
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
            
        # Set up paths for additional outputs
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.visuals_dir = os.path.join(self.base_dir, "reports", "visuals")
        self.leaderboard_path = os.path.join(self.base_dir, "reports", "model_leaderboard.csv")
        self.recommendation_path = os.path.join(self.base_dir, "reports", "model_recommendation.md")
        
        self.ensure_dirs()
        logger.info(f"Model Agent initialized with report path: {self.report_path}")
        
        # Initialize model storage
        self.models = {}
        self.predictions = {}
        self.metrics = {}
        self.best_model = None
        self.dataset_name = None
        self.tuning_results = {}
        
        # Set plot style
        plt.style.use('seaborn-v0_8-whitegrid')
        
        # Define hyperparameter grids for tuning
        self._define_param_grids()
        
    def ensure_dirs(self) -> None:
        """Ensure the required directories exist."""
        os.makedirs(os.path.dirname(self.report_path), exist_ok=True)
        os.makedirs(self.visuals_dir, exist_ok=True)
    
    def _define_param_grids(self) -> None:
        """Define hyperparameter grids for each model."""
        self.param_grids = {
            'KNN': {
                'n_neighbors': [3, 5, 7, 9, 11],
                'weights': ['uniform', 'distance'],
                'p': [1, 2]  # 1 for Manhattan, 2 for Euclidean
            },
            'SVR': {
                'C': [0.1, 1.0, 10.0],
                'epsilon': [0.01, 0.1, 0.2],
                'kernel': ['linear', 'rbf', 'poly']
            },
            'DecisionTree': {
                'max_depth': [None, 5, 10, 15, 20],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'RandomForest': {
                'n_estimators': [50, 100, 200],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10]
            },
            'GradientBoosting': {
                'learning_rate': [0.01, 0.05, 0.1],
                'n_estimators': [50, 100, 200],
                'subsample': [0.8, 0.9, 1.0],
                'max_depth': [3, 5, 7]
            },
            'Ridge': {
                'alpha': [0.01, 0.1, 1.0, 10.0],
                'solver': ['auto', 'svd', 'cholesky']
            },
            'Lasso': {
                'alpha': [0.001, 0.01, 0.1, 1.0],
                'selection': ['cyclic', 'random']
            },
            'ElasticNet': {
                'alpha': [0.001, 0.01, 0.1, 1.0],
                'l1_ratio': [0.1, 0.5, 0.7, 0.9]
            }
        }
        
        # Add XGBoost parameters if available
        if XGBOOST_AVAILABLE:
            self.param_grids['XGBoost'] = {
                'n_estimators': [50, 100, 200],
                'learning_rate': [0.01, 0.05, 0.1],
                'max_depth': [3, 5, 7],
                'subsample': [0.8, 0.9, 1.0],
                'colsample_bytree': [0.8, 0.9, 1.0]
            }
    
    def _reduce_param_grid(self, param_grid: Dict) -> Dict:
        """
        Reduce the parameter grid for large datasets to reduce computation time.
        
        Args:
            param_grid (Dict): Original parameter grid.
            
        Returns:
            Dict: Reduced parameter grid.
        """
        reduced_grid = {}
        
        for param, values in param_grid.items():
            if isinstance(values, list) and len(values) > 3:
                # Take first, middle, and last values to reduce the grid
                reduced_grid[param] = [values[0], values[len(values) // 2], values[-1]]
            else:
                reduced_grid[param] = values
        
        return reduced_grid
    
    def train_and_evaluate(
        self, 
        dataset_path: str, 
        target_column: str,
        tune_models: bool = False,
        use_bayesian_optimization: bool = False,
        n_jobs: int = -1,
        cv: int = 5
    ) -> Tuple[Dict, Dict, Dict]:
        """
        Train models and evaluate their performance on the specified dataset.
        
        Args:
            dataset_path (str): Path to the CSV dataset to analyze.
            target_column (str): Name of the column to use as the target variable.
            tune_models (bool, optional): Whether to perform hyperparameter tuning. Defaults to False.
            use_bayesian_optimization (bool, optional): Whether to use Bayesian optimization (Optuna) 
                instead of grid search. Defaults to False.
            n_jobs (int, optional): Number of parallel jobs for tuning. Defaults to -1 (all cores).
            cv (int, optional): Number of cross-validation folds. Defaults to 5.
            
        Returns:
            Tuple[Dict, Dict, Dict]: Trained models, predictions, and performance metrics.
        """
        try:
            # Check if Bayesian optimization is requested but not available
            if use_bayesian_optimization and not OPTUNA_AVAILABLE:
                logger.warning("Optuna is not available. Falling back to GridSearchCV.")
                use_bayesian_optimization = False
            
            # Validate file exists and is CSV
            if not os.path.exists(dataset_path):
                logger.error(f"Dataset not found: {dataset_path}")
                return {}, {}, {}
            
            if not dataset_path.lower().endswith('.csv'):
                logger.error(f"File is not a CSV: {dataset_path}")
                return {}, {}, {}
            
            # Read the dataset
            logger.info(f"Reading dataset: {dataset_path}")
            df = pd.read_csv(dataset_path)
            self.dataset_name = os.path.basename(dataset_path)
            
            # Validate target column exists
            if target_column not in df.columns:
                logger.error(f"Target column '{target_column}' not found in dataset")
                return {}, {}, {}
            
            # Prepare data for modeling
            X = df.drop(columns=[target_column])
            y = df[target_column]
            
            # Handle non-numeric columns (one-hot encoding)
            X = pd.get_dummies(X, drop_first=True)
            
            # Split data into training and testing sets (80/20)
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42
            )
            
            logger.info(f"Data split into training ({len(X_train)} samples) and testing ({len(X_test)} samples) sets")
            
            # Scale features for models that benefit from scaling
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Store original data for models that don't need scaling
            X_train_original = X_train.copy()
            X_test_original = X_test.copy()
            
            # Train models (with or without tuning)
            if tune_models:
                logger.info(f"Hyperparameter tuning enabled. Method: {'Bayesian optimization' if use_bayesian_optimization else 'Grid search'}")
                models = self._tune_models(
                    X_train_original, 
                    X_train_scaled, 
                    y_train, 
                    use_bayesian_optimization,
                    n_jobs,
                    cv
                )
            else:
                logger.info("Training models with default parameters")
                models = self._train_models(X_train_original, X_train_scaled, y_train)
            
            # Generate predictions
            predictions = self._generate_predictions(models, X_test_original, X_test_scaled)
            
            # Calculate metrics
            metrics = self._calculate_metrics(predictions, y_test)
            
            # Store results
            self.models = models
            self.predictions = predictions
            self.metrics = metrics
            
            # Determine the best model based on RMSE
            self._determine_best_model()
            
            # Generate visualizations
            self._generate_visualizations(predictions, y_test)
            
            # Create leaderboard
            self._create_leaderboard(tune_models)
            
            # Create model recommendation
            self._create_recommendation(target_column, tune_models, use_bayesian_optimization)
            
            # Generate timestamp for the report
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Generate and append report
            report = self._generate_report(
                dataset_path, 
                target_column, 
                X.columns.tolist(), 
                metrics, 
                predictions, 
                y_test, 
                timestamp,
                tune_models,
                use_bayesian_optimization
            )
            
            with open(self.report_path, 'a') as f:
                f.write(report)
            
            logger.info(f"Model training report successfully appended to {self.report_path}")
            return models, predictions, metrics
            
        except Exception as e:
            logger.error(f"Error during model training: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            return {}, {}, {}
    
    def _train_models(self, X_train: pd.DataFrame, X_train_scaled: np.ndarray, y_train: pd.Series) -> Dict:
        """
        Train multiple regression models on the training data.
        
        Args:
            X_train (pd.DataFrame): Original training features.
            X_train_scaled (np.ndarray): Scaled training features.
            y_train (pd.Series): Training target values.
            
        Returns:
            Dict: Dictionary of trained models.
        """
        models = {}
        
        # Models that don't require scaling
        unscaled_models = {
            'LinearRegression': LinearRegression(),
            'DecisionTree': DecisionTreeRegressor(random_state=42),
            'RandomForest': RandomForestRegressor(n_estimators=100, random_state=42),
            'GradientBoosting': GradientBoostingRegressor(n_estimators=100, random_state=42),
            'KNN': KNeighborsRegressor(n_neighbors=7)
        }
        
        # Models that benefit from scaling
        scaled_models = {
            'Ridge': Ridge(alpha=1.0, random_state=42),
            'Lasso': Lasso(alpha=0.1, random_state=42),
            'ElasticNet': ElasticNet(alpha=0.1, l1_ratio=0.5, random_state=42),
            'SVR': SVR(kernel='rbf', C=1.0, epsilon=0.1)
        }
        
        # Add XGBoost if available
        if XGBOOST_AVAILABLE:
            unscaled_models['XGBoost'] = xgb.XGBRegressor(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=5,
                random_state=42
            )
        
        # Train unscaled models
        for name, model in unscaled_models.items():
            logger.info(f"Training {name} model")
            start_time = time.time()
            model.fit(X_train, y_train)
            training_time = time.time() - start_time
            models[name] = {
                'model': model,
                'training_time': training_time,
                'requires_scaling': False,
                'is_tuned': False,
                'best_params': None
            }
        
        # Train scaled models
        for name, model in scaled_models.items():
            logger.info(f"Training {name} model")
            start_time = time.time()
            model.fit(X_train_scaled, y_train)
            training_time = time.time() - start_time
            models[name] = {
                'model': model,
                'training_time': training_time,
                'requires_scaling': True,
                'is_tuned': False,
                'best_params': None
            }
        
        return models
    
    def _tune_models(
        self, 
        X_train: pd.DataFrame, 
        X_train_scaled: np.ndarray, 
        y_train: pd.Series,
        use_bayesian_optimization: bool = False,
        n_jobs: int = -1,
        cv: int = 5
    ) -> Dict:
        """
        Tune hyperparameters for multiple regression models.
        
        Args:
            X_train (pd.DataFrame): Original training features.
            X_train_scaled (np.ndarray): Scaled training features.
            y_train (pd.Series): Training target values.
            use_bayesian_optimization (bool): Whether to use Bayesian optimization (Optuna).
            n_jobs (int): Number of parallel jobs for tuning.
            cv (int): Number of cross-validation folds.
            
        Returns:
            Dict: Dictionary of tuned models.
        """
        models = {}
        self.tuning_results = {}
        
        # Models that don't require scaling
        unscaled_models = {
            'LinearRegression': LinearRegression(),  # No hyperparameters to tune
            'DecisionTree': DecisionTreeRegressor(random_state=42),
            'RandomForest': RandomForestRegressor(random_state=42),
            'GradientBoosting': GradientBoostingRegressor(random_state=42),
            'KNN': KNeighborsRegressor()
        }
        
        # Models that benefit from scaling
        scaled_models = {
            'Ridge': Ridge(random_state=42),
            'Lasso': Lasso(random_state=42),
            'ElasticNet': ElasticNet(random_state=42),
            'SVR': SVR()
        }
        
        # Add XGBoost if available
        if XGBOOST_AVAILABLE:
            unscaled_models['XGBoost'] = xgb.XGBRegressor(random_state=42)
        
        # Train and tune unscaled models
        for name, model in unscaled_models.items():
            # LinearRegression has no hyperparameters to tune
            if name == 'LinearRegression':
                logger.info(f"Training {name} model (no hyperparameters to tune)")
                start_time = time.time()
                model.fit(X_train, y_train)
                training_time = time.time() - start_time
                models[name] = {
                    'model': model,
                    'training_time': training_time,
                    'requires_scaling': False,
                    'is_tuned': False,
                    'best_params': None
                }
                continue
            
            # For other models, perform hyperparameter tuning
            logger.info(f"Tuning hyperparameters for {name} model")
            start_time = time.time()
            
            try:
                if use_bayesian_optimization and OPTUNA_AVAILABLE:
                    best_model, best_params, best_score = self._tune_with_optuna(
                        name, model, X_train, y_train, cv
                    )
                else:
                    best_model, best_params, best_score = self._tune_with_grid_search(
                        name, model, X_train, y_train, n_jobs, cv
                    )
                
                training_time = time.time() - start_time
                
                models[name] = {
                    'model': best_model,
                    'training_time': training_time,
                    'requires_scaling': False,
                    'is_tuned': True,
                    'best_params': best_params,
                    'cv_score': best_score
                }
                
                self.tuning_results[name] = {
                    'best_params': best_params,
                    'cv_score': best_score,
                    'tuning_time': training_time
                }
                
                logger.info(f"Best parameters for {name}: {best_params}")
                logger.info(f"Cross-validation score: {best_score:.4f}")
                
            except Exception as e:
                logger.error(f"Error tuning {name} model: {str(e)}")
                logger.warning(f"Falling back to default parameters for {name}")
                
                # Fall back to default model
                start_time = time.time()
                model.fit(X_train, y_train)
                training_time = time.time() - start_time
                
                models[name] = {
                    'model': model,
                    'training_time': training_time,
                    'requires_scaling': False,
                    'is_tuned': False,
                    'best_params': None
                }
        
        # Train and tune scaled models
        for name, model in scaled_models.items():
            logger.info(f"Tuning hyperparameters for {name} model")
            start_time = time.time()
            
            try:
                if use_bayesian_optimization and OPTUNA_AVAILABLE:
                    best_model, best_params, best_score = self._tune_with_optuna(
                        name, model, X_train_scaled, y_train, cv
                    )
                else:
                    best_model, best_params, best_score = self._tune_with_grid_search(
                        name, model, X_train_scaled, y_train, n_jobs, cv
                    )
                
                training_time = time.time() - start_time
                
                models[name] = {
                    'model': best_model,
                    'training_time': training_time,
                    'requires_scaling': True,
                    'is_tuned': True,
                    'best_params': best_params,
                    'cv_score': best_score
                }
                
                self.tuning_results[name] = {
                    'best_params': best_params,
                    'cv_score': best_score,
                    'tuning_time': training_time
                }
                
                logger.info(f"Best parameters for {name}: {best_params}")
                logger.info(f"Cross-validation score: {best_score:.4f}")
                
            except Exception as e:
                logger.error(f"Error tuning {name} model: {str(e)}")
                logger.warning(f"Falling back to default parameters for {name}")
                
                # Fall back to default model
                start_time = time.time()
                model.fit(X_train_scaled, y_train)
                training_time = time.time() - start_time
                
                models[name] = {
                    'model': model,
                    'training_time': training_time,
                    'requires_scaling': True,
                    'is_tuned': False,
                    'best_params': None
                }
        
        return models
    
    def _tune_with_grid_search(
        self, 
        model_name: str, 
        model: Any, 
        X_train: Union[pd.DataFrame, np.ndarray], 
        y_train: pd.Series,
        n_jobs: int,
        cv: int
    ) -> Tuple[Any, Dict, float]:
        """
        Tune model hyperparameters using GridSearchCV.
        
        Args:
            model_name (str): Name of the model.
            model (Any): Model instance.
            X_train (Union[pd.DataFrame, np.ndarray]): Training features.
            y_train (pd.Series): Training target values.
            n_jobs (int): Number of parallel jobs.
            cv (int): Number of cross-validation folds.
            
        Returns:
            Tuple[Any, Dict, float]: Best model, best parameters, and best score.
        """
        if model_name not in self.param_grids:
            logger.warning(f"No parameter grid defined for {model_name}. Using default parameters.")
            model.fit(X_train, y_train)
            return model, {}, 0.0
        
        param_grid = self.param_grids[model_name]
        
        # Create a smaller grid for large datasets to reduce computation time
        if len(X_train) > 10000:
            logger.info(f"Large dataset detected. Using reduced parameter grid for {model_name}.")
            param_grid = self._reduce_param_grid(param_grid)
        
        grid_search = GridSearchCV(
            model,
            param_grid,
            scoring='neg_root_mean_squared_error',
            cv=cv,
            n_jobs=n_jobs,
            verbose=1
        )
        
        grid_search.fit(X_train, y_train)
        
        return grid_search.best_estimator_, grid_search.best_params_, -grid_search.best_score_
    
    def _tune_with_optuna(
        self, 
        model_name: str, 
        model: Any, 
        X_train: Union[pd.DataFrame, np.ndarray], 
        y_train: pd.Series,
        cv: int
    ) -> Tuple[Any, Dict, float]:
        """
        Tune model hyperparameters using Optuna (Bayesian optimization).
        
        Args:
            model_name (str): Name of the model.
            model (Any): Model instance.
            X_train (Union[pd.DataFrame, np.ndarray]): Training features.
            y_train (pd.Series): Training target values.
            cv (int): Number of cross-validation folds.
            
        Returns:
            Tuple[Any, Dict, float]: Best model, best parameters, and best score.
        """
        if not OPTUNA_AVAILABLE:
            raise ImportError("Optuna is not available. Install with 'pip install optuna'.")
        
        if model_name not in self.param_grids:
            logger.warning(f"No parameter grid defined for {model_name}. Using default parameters.")
            model.fit(X_train, y_train)
            return model, {}, 0.0
        
        # Define the objective function for Optuna
        def objective(trial):
            params = {}
            
            # KNN parameters
            if model_name == 'KNN':
                params = {
                    'n_neighbors': trial.suggest_int('n_neighbors', 3, 15),
                    'weights': trial.suggest_categorical('weights', ['uniform', 'distance']),
                    'p': trial.suggest_int('p', 1, 2)
                }
            
            # SVR parameters
            elif model_name == 'SVR':
                params = {
                    'C': trial.suggest_float('C', 0.01, 100.0, log=True),
                    'epsilon': trial.suggest_float('epsilon', 0.01, 1.0),
                    'kernel': trial.suggest_categorical('kernel', ['linear', 'rbf', 'poly'])
                }
            
            # DecisionTree parameters
            elif model_name == 'DecisionTree':
                params = {
                    'max_depth': trial.suggest_int('max_depth', 3, 30),
                    'min_samples_split': trial.suggest_int('min_samples_split', 2, 20),
                    'min_samples_leaf': trial.suggest_int('min_samples_leaf', 1, 10)
                }
            
            # RandomForest parameters
            elif model_name == 'RandomForest':
                params = {
                    'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                    'max_depth': trial.suggest_int('max_depth', 5, 30),
                    'min_samples_split': trial.suggest_int('min_samples_split', 2, 20)
                }
            
            # GradientBoosting parameters
            elif model_name == 'GradientBoosting':
                params = {
                    'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                    'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                    'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                    'max_depth': trial.suggest_int('max_depth', 3, 10)
                }
            
            # Ridge parameters
            elif model_name == 'Ridge':
                params = {
                    'alpha': trial.suggest_float('alpha', 0.01, 10.0, log=True),
                    'solver': trial.suggest_categorical('solver', ['auto', 'svd', 'cholesky'])
                }
            
            # Lasso parameters
            elif model_name == 'Lasso':
                params = {
                    'alpha': trial.suggest_float('alpha', 0.001, 1.0, log=True),
                    'selection': trial.suggest_categorical('selection', ['cyclic', 'random'])
                }
            
            # ElasticNet parameters
            elif model_name == 'ElasticNet':
                params = {
                    'alpha': trial.suggest_float('alpha', 0.001, 1.0, log=True),
                    'l1_ratio': trial.suggest_float('l1_ratio', 0.1, 0.9)
                }
            
            # XGBoost parameters
            elif model_name == 'XGBoost' and XGBOOST_AVAILABLE:
                params = {
                    'n_estimators': trial.suggest_int('n_estimators', 50, 300),
                    'learning_rate': trial.suggest_float('learning_rate', 0.01, 0.3),
                    'max_depth': trial.suggest_int('max_depth', 3, 10),
                    'subsample': trial.suggest_float('subsample', 0.6, 1.0),
                    'colsample_bytree': trial.suggest_float('colsample_bytree', 0.6, 1.0)
                }
            
            # Create a new model instance with the trial parameters
            model_instance = type(model)(**params, random_state=42 if 'random_state' in model.get_params() else None)
            
            # Use cross-validation to evaluate the model
            from sklearn.model_selection import cross_val_score
            scores = cross_val_score(
                model_instance,
                X_train,
                y_train,
                scoring='neg_root_mean_squared_error',
                cv=cv,
                n_jobs=-1
            )
            
            # Return the mean negative RMSE (Optuna minimizes the objective)
            return -scores.mean()
        
        # Create and run the Optuna study
        study = optuna.create_study(direction='minimize')
        study.optimize(objective, n_trials=50, show_progress_bar=True)
        
        # Get the best parameters
        best_params = study.best_params
        best_score = -study.best_value  # Convert back to positive RMSE
        
        # Create and fit the best model
        best_model = type(model)(**best_params, random_state=42 if 'random_state' in model.get_params() else None)
        best_model.fit(X_train, y_train)
        
        return best_model, best_params, best_score
    
    def _generate_predictions(self, models: Dict, X_test: pd.DataFrame, X_test_scaled: np.ndarray) -> Dict:
        """
        Generate predictions for each model on the test data.
        
        Args:
            models (Dict): Dictionary of trained models.
            X_test (pd.DataFrame): Original test features.
            X_test_scaled (np.ndarray): Scaled test features.
            
        Returns:
            Dict: Dictionary of model predictions.
        """
        predictions = {}
        
        for model_name, model_info in models.items():
            logger.info(f"Generating predictions for {model_name}")
            model = model_info['model']
            
            # Use scaled or unscaled data based on model requirements
            if model_info['requires_scaling']:
                predictions[model_name] = model.predict(X_test_scaled)
            else:
                predictions[model_name] = model.predict(X_test)
            
        return predictions
    
    def _calculate_metrics(self, predictions: Dict, y_test: pd.Series) -> Dict:
        """
        Calculate performance metrics for each model.
        
        Args:
            predictions (Dict): Dictionary of model predictions.
            y_test (pd.Series): Test target values.
            
        Returns:
            Dict: Dictionary of performance metrics for each model.
        """
        metrics = {}
        
        for model_name, y_pred in predictions.items():
            metrics[model_name] = {
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'mae': mean_absolute_error(y_test, y_pred),
                'r2': r2_score(y_test, y_pred)
            }
            
            logger.info(f"Metrics for {model_name}: {metrics[model_name]}")
            
        return metrics
    
    def _determine_best_model(self) -> None:
        """
        Determine the best model based on RMSE.
        """
        if not self.metrics:
            return
        
        # Find model with lowest RMSE
        best_model_name = min(self.metrics, key=lambda x: self.metrics[x]['rmse'])
        self.best_model = {
            'name': best_model_name,
            'metrics': self.metrics[best_model_name],
            'model': self.models[best_model_name]['model'],
            'is_tuned': self.models[best_model_name]['is_tuned'],
            'best_params': self.models[best_model_name]['best_params']
        }
        
        logger.info(f"Best model: {best_model_name} with RMSE: {self.best_model['metrics']['rmse']:.4f}")
    
    def _generate_visualizations(self, predictions: Dict, y_test: pd.Series) -> None:
        """
        Generate visualizations for model performance.
        
        Args:
            predictions (Dict): Dictionary of model predictions.
            y_test (pd.Series): Test target values.
        """
        # Create a timestamp for unique filenames
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        dataset_prefix = self.dataset_name.replace('.csv', '').replace('.', '_')
        
        # Generate actual vs predicted plots for each model
        for model_name, y_pred in predictions.items():
            self._create_actual_vs_predicted_plot(
                y_test, 
                y_pred, 
                model_name, 
                f"{dataset_prefix}_{model_name}_actual_vs_predicted_{timestamp}.png"
            )
            
            self._create_residual_plot(
                y_test, 
                y_pred, 
                model_name, 
                f"{dataset_prefix}_{model_name}_residuals_{timestamp}.png"
            )
        
        # Generate learning curves for top models
        # Get top 2 models based on RMSE
        if self.metrics:
            sorted_models = sorted(self.metrics.items(), key=lambda x: x[1]['rmse'])
            top_models = [model_name for model_name, _ in sorted_models[:2]]
            
            for model_name in top_models:
                if model_name in self.models:
                    model_info = self.models[model_name]
                    model = model_info['model']
                    requires_scaling = model_info['requires_scaling']
                    
                    try:
                        self._generate_learning_curve(
                            model,
                            model_name,
                            requires_scaling,
                            f"{model_name}_learning_curve.png"
                        )
                    except Exception as e:
                        logger.error(f"Error generating learning curve for {model_name}: {str(e)}")
                        logger.warning(f"Skipping learning curve for {model_name}")
    
    def _generate_learning_curve(self, model: Any, model_name: str, requires_scaling: bool, filename: str) -> str:
        """
        Generate and save a learning curve plot for a model.
        
        Args:
            model (Any): The trained model.
            model_name (str): Name of the model.
            requires_scaling (bool): Whether the model requires scaled features.
            filename (str): Filename for the saved plot.
            
        Returns:
            str: Path to the saved plot.
        """
        logger.info(f"Generating learning curve for {model_name}")
        
        # Create directory for learning curves if it doesn't exist
        learning_curves_dir = os.path.join(self.visuals_dir, "learning_curves")
        os.makedirs(learning_curves_dir, exist_ok=True)
        
        # Define train sizes
        train_sizes = np.linspace(0.1, 1.0, 10)
        
        # Get the training data
        X = None
        y = None
        
        # Use the dataset path that was passed to train_and_evaluate
        dataset_path = os.path.join(os.getcwd(), "abalone", "abalone.csv")
        if os.path.exists(dataset_path):
            df = pd.read_csv(dataset_path)
            target_column = "Rings"  # Use the target column from the abalone dataset
            X_full = df.drop(columns=[target_column])
            y_full = df[target_column]
        else:
            # Fallback to the original approach
            try:
                df = pd.read_csv(os.path.join(self.base_dir, self.dataset_name))
                target_column = next(col for col in df.columns if df[col].equals(df[col].astype(float)))
                X_full = df.drop(columns=[target_column])
                y_full = df[target_column]
            except Exception as e:
                logger.error(f"Error reading dataset for learning curve: {str(e)}")
                raise
        
        # Handle non-numeric columns (one-hot encoding)
        X_full = pd.get_dummies(X_full, drop_first=True)
        
        # Scale features if required
        if requires_scaling:
            scaler = StandardScaler()
            X = scaler.fit_transform(X_full)
        else:
            X = X_full
        
        y = y_full
        
        try:
            # Calculate learning curve
            train_sizes, train_scores, test_scores = learning_curve(
                model, X, y, 
                train_sizes=train_sizes,
                cv=5, 
                scoring='neg_mean_squared_error',
                n_jobs=-1,
                shuffle=True,
                random_state=42
            )
            
            # Convert MSE to RMSE and make positive
            train_scores = np.sqrt(-train_scores)
            test_scores = np.sqrt(-test_scores)
            
            # Calculate mean and std for train and test scores
            train_mean = np.mean(train_scores, axis=1)
            train_std = np.std(train_scores, axis=1)
            test_mean = np.mean(test_scores, axis=1)
            test_std = np.std(test_scores, axis=1)
            
            # Create plot
            plt.figure(figsize=(10, 6))
            
            # Plot training and test scores
            plt.plot(train_sizes, train_mean, 'o-', color='r', label='Training score')
            plt.plot(train_sizes, test_mean, 'o-', color='g', label='Cross-validation score')
            
            # Plot standard deviation bands
            plt.fill_between(train_sizes, train_mean - train_std, train_mean + train_std, alpha=0.1, color='r')
            plt.fill_between(train_sizes, test_mean - test_std, test_mean + test_std, alpha=0.1, color='g')
            
            # Add labels and title
            plt.xlabel('Number of training examples')
            plt.ylabel('RMSE')
            plt.title(f'Learning Curve: {model_name}')
            plt.legend(loc='best')
            plt.grid(True)
            
            # Add analysis of overfitting/underfitting
            fit_status = self._analyze_learning_curve(train_mean, test_mean)
            plt.annotate(f'Model Status: {fit_status}', 
                        xy=(0.05, 0.05), xycoords='axes fraction',
                        bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="gray", alpha=0.8))
            
            # Save the plot
            plot_path = os.path.join(learning_curves_dir, filename)
            plt.tight_layout()
            plt.savefig(plot_path, dpi=300)
            plt.close()
            
            logger.info(f"Saved learning curve for {model_name} to {plot_path}")
            
            # Store the fit status for the model
            if model_name in self.models:
                self.models[model_name]['fit_status'] = fit_status
            
            return plot_path
            
        except Exception as e:
            logger.error(f"Error generating learning curve: {str(e)}")
            import traceback
            logger.error(traceback.format_exc())
            raise
    
    def _analyze_learning_curve(self, train_scores: np.ndarray, test_scores: np.ndarray) -> str:
        """
        Analyze learning curve to detect overfitting or underfitting.
        
        Args:
            train_scores (np.ndarray): Training scores.
            test_scores (np.ndarray): Test scores.
            
        Returns:
            str: Analysis result ('Underfitting', 'Overfitting', or 'Good Fit').
        """
        # Get final scores
        final_train_score = train_scores[-1]
        final_test_score = test_scores[-1]
        
        # Calculate the gap between train and test scores
        score_gap = final_train_score - final_test_score
        
        # Check if the model is underfitting
        if final_train_score > 0.5:  # High RMSE on training data
            return "Underfitting"
        
        # Check if the model is overfitting
        elif abs(score_gap) > 0.2 * final_test_score:  # Large gap between train and test scores
            return "Overfitting"
        
        # Otherwise, it's a good fit
        else:
            return "Good Fit"
    
    def _create_actual_vs_predicted_plot(self, y_true: pd.Series, y_pred: np.ndarray, 
                                         model_name: str, filename: str) -> str:
        """
        Create and save an actual vs predicted values scatter plot.
        
        Args:
            y_true (pd.Series): Actual target values.
            y_pred (np.ndarray): Predicted target values.
            model_name (str): Name of the model.
            filename (str): Filename for the saved plot.
            
        Returns:
            str: Path to the saved plot.
        """
        plt.figure(figsize=(10, 6))
        
        # Create scatter plot
        plt.scatter(y_true, y_pred, alpha=0.5)
        
        # Add perfect prediction line
        min_val = min(y_true.min(), y_pred.min())
        max_val = max(y_true.max(), y_pred.max())
        plt.plot([min_val, max_val], [min_val, max_val], 'r--', lw=2)
        
        # Add labels and title
        plt.xlabel('Actual Values')
        plt.ylabel('Predicted Values')
        plt.title(f'{model_name}: Actual vs Predicted Values')
        
        # Add metrics as text
        r2 = r2_score(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        plt.annotate(f'R² = {r2:.4f}\nRMSE = {rmse:.4f}', 
                     xy=(0.05, 0.95), xycoords='axes fraction',
                     bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="gray", alpha=0.8))
        
        # Add tuned badge if applicable
        if model_name in self.models and self.models[model_name]['is_tuned']:
            plt.annotate('Tuned', xy=(0.95, 0.05), xycoords='axes fraction',
                         ha='right', va='bottom',
                         bbox=dict(boxstyle="round,pad=0.3", fc="green", ec="gray", alpha=0.8))
        
        # Save the plot
        plot_path = os.path.join(self.visuals_dir, filename)
        plt.tight_layout()
        plt.savefig(plot_path, dpi=300)
        plt.close()
        
        logger.info(f"Saved actual vs predicted plot for {model_name} to {plot_path}")
        return plot_path
    
    def _create_residual_plot(self, y_true: pd.Series, y_pred: np.ndarray, 
                              model_name: str, filename: str) -> str:
        """
        Create and save a residual plot.
        
        Args:
            y_true (pd.Series): Actual target values.
            y_pred (np.ndarray): Predicted target values.
            model_name (str): Name of the model.
            filename (str): Filename for the saved plot.
            
        Returns:
            str: Path to the saved plot.
        """
        residuals = y_true - y_pred
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(10, 10))
        
        # Residuals vs Predicted values
        ax1.scatter(y_pred, residuals, alpha=0.5)
        ax1.axhline(y=0, color='r', linestyle='--')
        ax1.set_xlabel('Predicted Values')
        ax1.set_ylabel('Residuals')
        ax1.set_title(f'{model_name}: Residuals vs Predicted Values')
        
        # Residual distribution
        sns.histplot(residuals, kde=True, ax=ax2)
        ax2.axvline(x=0, color='r', linestyle='--')
        ax2.set_xlabel('Residual Value')
        ax2.set_ylabel('Frequency')
        ax2.set_title(f'{model_name}: Residual Distribution')
        
        # Add metrics
        mean_residual = np.mean(residuals)
        std_residual = np.std(residuals)
        ax2.annotate(f'Mean = {mean_residual:.4f}\nStd Dev = {std_residual:.4f}', 
                     xy=(0.05, 0.95), xycoords='axes fraction',
                     bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="gray", alpha=0.8))
        
        # Add tuned badge if applicable
        if model_name in self.models and self.models[model_name]['is_tuned']:
            ax1.annotate('Tuned', xy=(0.95, 0.05), xycoords='axes fraction',
                         ha='right', va='bottom',
                         bbox=dict(boxstyle="round,pad=0.3", fc="green", ec="gray", alpha=0.8))
        
        # Save the plot
        plt.tight_layout()
        plot_path = os.path.join(self.visuals_dir, filename)
        plt.savefig(plot_path, dpi=300)
        plt.close()
        
        logger.info(f"Saved residual plot for {model_name} to {plot_path}")
        return plot_path
    
    def _create_leaderboard(self, include_tuning_info: bool = False) -> None:
        """
        Create and save a CSV leaderboard of model performance.
        
        Args:
            include_tuning_info (bool): Whether to include hyperparameter tuning information.
        """
        if not self.metrics:
            return
        
        # Create DataFrame for leaderboard
        if include_tuning_info:
            leaderboard = pd.DataFrame({
                'Model': [],
                'RMSE': [],
                'MAE': [],
                'R²': [],
                'Training Time (s)': [],
                'Tuned': [],
                'Best Parameters': []
            })
            
            for model_name, model_metrics in self.metrics.items():
                # Convert boolean to string to avoid formatting issues
                is_tuned_str = "Yes" if self.models[model_name]['is_tuned'] else "No"
                
                leaderboard = pd.concat([leaderboard, pd.DataFrame({
                    'Model': [model_name],
                    'RMSE': [model_metrics['rmse']],
                    'MAE': [model_metrics['mae']],
                    'R²': [model_metrics['r2']],
                    'Training Time (s)': [self.models[model_name]['training_time']],
                    'Tuned': [is_tuned_str],
                    'Best Parameters': [str(self.models[model_name]['best_params']) if self.models[model_name]['best_params'] else 'N/A']
                })], ignore_index=True)
        else:
            leaderboard = pd.DataFrame({
                'Model': [],
                'RMSE': [],
                'MAE': [],
                'R²': [],
                'Training Time (s)': []
            })
            
            for model_name, model_metrics in self.metrics.items():
                leaderboard = pd.concat([leaderboard, pd.DataFrame({
                    'Model': [model_name],
                    'RMSE': [model_metrics['rmse']],
                    'MAE': [model_metrics['mae']],
                    'R²': [model_metrics['r2']],
                    'Training Time (s)': [self.models[model_name]['training_time']]
                })], ignore_index=True)
        
        # Sort by RMSE (ascending)
        leaderboard = leaderboard.sort_values('RMSE')
        
        # Save to CSV
        leaderboard.to_csv(self.leaderboard_path, index=False)
        logger.info(f"Saved model leaderboard to {self.leaderboard_path}")
    
    def _create_recommendation(self, target_column: str, include_tuning_info: bool = False, 
                              used_bayesian_optimization: bool = False) -> None:
        """
        Create and save a Markdown recommendation document.
        
        Args:
            target_column (str): Name of the target column.
            include_tuning_info (bool): Whether to include hyperparameter tuning information.
            used_bayesian_optimization (bool): Whether Bayesian optimization was used.
        """
        if not self.best_model:
            return
        
        # Get timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Create leaderboard table
        leaderboard = pd.read_csv(self.leaderboard_path)
        
        # Format the recommendation markdown
        recommendation = f"""
# Model Recommendation Report

**Generated on:** {timestamp}

## Dataset Information
- **Dataset:** `{self.dataset_name}`
- **Target Variable:** `{target_column}`
"""

        if include_tuning_info:
            recommendation += f"""
## Hyperparameter Tuning
- **Tuning Method:** {"Bayesian Optimization (Optuna)" if used_bayesian_optimization else "Grid Search (GridSearchCV)"}
- **Models Tuned:** {sum(1 for model in self.models.values() if model['is_tuned'])} out of {len(self.models)}
"""

        recommendation += f"""
## Model Leaderboard

The following table ranks all models by their Root Mean Squared Error (RMSE):

{leaderboard.to_markdown(index=False, floatfmt='.4f')}

## Recommended Model

Based on the performance metrics, the **{self.best_model['name']}** model is recommended for this dataset.

### Performance Metrics
- **RMSE:** {self.best_model['metrics']['rmse']:.4f}
- **MAE:** {self.best_model['metrics']['mae']:.4f}
- **R²:** {self.best_model['metrics']['r2']:.4f}
"""

        if include_tuning_info and self.best_model['is_tuned']:
            recommendation += f"""
### Best Hyperparameters
```
{self.best_model['best_params']}
```
"""

        recommendation += f"""
### Justification

The {self.best_model['name']} model achieved the lowest RMSE of {self.best_model['metrics']['rmse']:.4f}, indicating it has the best predictive accuracy among all models tested. 

The R² value of {self.best_model['metrics']['r2']:.4f} indicates that the model explains approximately {self.best_model['metrics']['r2'] * 100:.1f}% of the variance in the target variable.

### Model Characteristics

{self._get_model_description(self.best_model['name'])}

## Learning Curve Analysis

Learning curves help visualize how model performance evolves with increasing training data size, allowing us to detect underfitting, overfitting, and variance issues.

"""
        # Add learning curve images for top models
        if self.metrics:
            sorted_models = sorted(self.metrics.items(), key=lambda x: x[1]['rmse'])
            top_models = [model_name for model_name, _ in sorted_models[:2]]
            
            for model_name in top_models:
                if model_name in self.models and 'fit_status' in self.models[model_name]:
                    fit_status = self.models[model_name]['fit_status']
                    recommendation += f"""
### {model_name} Learning Curve

![Learning Curve](./visuals/learning_curves/{model_name}_learning_curve.png)

**Model Status:** {fit_status}

"""
                    if fit_status == "Underfitting":
                        recommendation += """
This model is **underfitting** the data, which means it's too simple to capture the underlying patterns. Consider:
- Using a more complex model
- Adding more features
- Reducing regularization strength
"""
                    elif fit_status == "Overfitting":
                        recommendation += """
This model is **overfitting** the data, which means it's too complex and capturing noise. Consider:
- Increasing regularization
- Using early stopping
- Collecting more training data
- Feature selection to reduce dimensionality
"""
                    else:  # Good Fit
                        recommendation += """
This model shows a **good fit** to the data, with a good balance between bias and variance.
"""

        recommendation += f"""
## Visualization Links

Additional visualizations for all models can be found in the `reports/visuals/` directory.

## Next Steps

1. Consider {"further " if include_tuning_info else ""}hyperparameter tuning to improve the {self.best_model['name']} model
2. Evaluate the model on new data to ensure generalizability
3. Consider feature engineering to potentially improve performance
4. For production deployment, retrain the model on the full dataset
"""
        
        # Save recommendation to file
        with open(self.recommendation_path, 'w') as f:
            f.write(recommendation)
        
        logger.info(f"Saved model recommendation to {self.recommendation_path}")
    
    def _get_model_description(self, model_name: str) -> str:
        """
        Get a description of the model.
        
        Args:
            model_name (str): Name of the model.
            
        Returns:
            str: Description of the model.
        """
        descriptions = {
            'LinearRegression': "Linear Regression is a simple parametric model that assumes a linear relationship between features and the target. It's fast to train and interpret but may underfit complex relationships.",
            
            'Ridge': "Ridge Regression is a regularized version of linear regression that adds an L2 penalty to prevent overfitting. It's particularly useful when features are correlated.",
            
            'Lasso': "Lasso Regression adds an L1 penalty that can drive feature coefficients to zero, effectively performing feature selection. It's useful for high-dimensional datasets with many irrelevant features.",
            
            'ElasticNet': "ElasticNet combines L1 and L2 penalties, balancing the feature selection capability of Lasso with the stability of Ridge regression.",
            
            'KNN': "K-Nearest Neighbors is a non-parametric method that predicts based on the average of the k nearest training samples. It's flexible but can be computationally expensive for large datasets.",
            
            'DecisionTree': "Decision Tree creates a tree-like model of decisions. It's easy to interpret but prone to overfitting without proper pruning.",
            
            'RandomForest': "Random Forest is an ensemble of decision trees that reduces overfitting by averaging multiple trees trained on random subsets of data and features. It generally provides good performance with minimal tuning.",
            
            'GradientBoosting': "Gradient Boosting builds trees sequentially, with each tree correcting the errors of the previous ones. It often achieves state-of-the-art performance but requires careful tuning.",
            
            'SVR': "Support Vector Regressor uses kernel functions to map data to a higher-dimensional space where a linear relationship can be found. It's effective for non-linear relationships but can be slow on large datasets.",
            
            'XGBoost': "XGBoost is an optimized gradient boosting implementation known for its speed and performance. It includes regularization to prevent overfitting and handles missing values automatically."
        }
        
        return descriptions.get(model_name, "No description available for this model.")
    
    def _generate_report(
        self, 
        dataset_path: str, 
        target_column: str, 
        feature_columns: List[str],
        metrics: Dict, 
        predictions: Dict, 
        y_test: pd.Series,
        timestamp: str,
        include_tuning_info: bool = False,
        used_bayesian_optimization: bool = False
    ) -> str:
        """
        Generate a Markdown report of the modeling results.
        
        Args:
            dataset_path (str): Path to the dataset.
            target_column (str): Name of the target column.
            feature_columns (List[str]): List of feature column names.
            metrics (Dict): Dictionary of model performance metrics.
            predictions (Dict): Dictionary of model predictions.
            y_test (pd.Series): Test target values.
            timestamp (str): Timestamp for the report.
            include_tuning_info (bool): Whether to include hyperparameter tuning information.
            used_bayesian_optimization (bool): Whether Bayesian optimization was used.
            
        Returns:
            str: Markdown formatted report.
        """
        filename = os.path.basename(dataset_path)
        
        # Create metrics table
        metrics_df = pd.DataFrame({
            'Model': [],
            'RMSE': [],
            'MAE': [],
            'R²': [],
            'Training Time (s)': []
        })
        
        for model_name, model_metrics in metrics.items():
            metrics_df = pd.concat([metrics_df, pd.DataFrame({
                'Model': [model_name],
                'RMSE': [model_metrics['rmse']],
                'MAE': [model_metrics['mae']],
                'R²': [model_metrics['r2']],
                'Training Time (s)': [self.models[model_name]['training_time']]
            })], ignore_index=True)
        
        # Sort by RMSE
        metrics_df = metrics_df.sort_values('RMSE')
        
        # Create sample predictions table
        sample_size = min(5, len(y_test))
        predictions_df = pd.DataFrame({
            'Actual': y_test.iloc[:sample_size].values
        })
        
        # Add predictions for top 3 models only (to keep the table readable)
        top_models = metrics_df['Model'].iloc[:3].tolist()
        for model_name in top_models:
            predictions_df[f'{model_name} Prediction'] = predictions[model_name][:sample_size]
            predictions_df[f'{model_name} Error'] = abs(y_test.iloc[:sample_size].values - predictions[model_name][:sample_size])
        
        # Format feature list
        if len(feature_columns) > 10:
            feature_list = ', '.join([f'`{col}`' for col in feature_columns[:10]]) + f', and {len(feature_columns) - 10} more'
        else:
            feature_list = ', '.join([f'`{col}`' for col in feature_columns])
        
        # Generate the report
        report = f"""

# Machine Learning Model Training Report: {filename}

**Generated on:** {timestamp}

This report contains the results of training and evaluating machine learning models on the dataset `{filename}`.
The models were trained to predict the target variable `{target_column}` using supervised learning techniques.

---

## Model Training Overview

### Dataset Information
- **Target Variable:** `{target_column}`
- **Features Used:** {feature_list}
- **Training/Testing Split:** 80% training, 20% testing (random seed: 42)

### Preprocessing Steps
- Automatic handling of categorical variables using one-hot encoding
- Standard scaling applied to features for models that benefit from it
- Missing values were not explicitly handled (ensure data is clean before modeling)
"""

        if include_tuning_info:
            report += f"""
### Hyperparameter Tuning
- **Tuning Method:** {"Bayesian Optimization (Optuna)" if used_bayesian_optimization else "Grid Search (GridSearchCV)"}
- **Models Tuned:** {sum(1 for model in self.models.values() if model['is_tuned'])} out of {len(self.models)}
"""

        report += f"""
### Models Trained
1. **Linear Regression** - A parametric approach that models linear relationships
2. **Ridge Regression** - Linear regression with L2 regularization
3. **Lasso Regression** - Linear regression with L1 regularization
4. **ElasticNet** - Linear regression with both L1 and L2 regularization
5. **K-Nearest Neighbors** - Non-parametric approach using k=7 nearest samples
6. **Decision Tree** - Tree-based model that recursively splits the data
7. **Random Forest** - Ensemble of decision trees (100 estimators)
8. **Gradient Boosting** - Sequential ensemble of decision trees (100 estimators)
9. **Support Vector Regressor** - Kernel-based approach for non-linear relationships
{f"10. **XGBoost** - Optimized gradient boosting implementation" if XGBOOST_AVAILABLE else ""}

## Model Performance

The table below shows the performance metrics for each model on the test set, sorted by RMSE:

{metrics_df.to_markdown(index=False, floatfmt='.4f')}

### Metrics Explanation
- **RMSE (Root Mean Squared Error):** Square root of the average squared differences between predicted and actual values (lower is better)
- **MAE (Mean Absolute Error):** Average of absolute differences between predicted and actual values (lower is better)
- **R² (Coefficient of Determination):** Proportion of variance in the target that is predictable from the features (higher is better, 1.0 is perfect prediction)

## Sample Predictions

Below are sample predictions from the top 3 performing models compared to the actual values:

{predictions_df.to_markdown(index=False, floatfmt='.4f')}

## Visualizations

Visualizations for model performance have been generated and saved to the `reports/visuals/` directory. These include:

1. **Actual vs. Predicted Plots** - Scatter plots showing the relationship between actual and predicted values
2. **Residual Plots** - Visualizations of prediction errors to assess model assumptions
3. **Learning Curves** - Plots showing how model performance evolves with increasing training data size

### Learning Curve Analysis

Learning curves help detect underfitting, overfitting, and variance issues by showing how model performance changes with training set size. For the top models:
"""
        # Add learning curve analysis for top models
        if self.metrics:
            sorted_models = sorted(self.metrics.items(), key=lambda x: x[1]['rmse'])
            top_models = [model_name for model_name, _ in sorted_models[:2]]
            
            for model_name in top_models:
                if model_name in self.models and 'fit_status' in self.models[model_name]:
                    fit_status = self.models[model_name]['fit_status']
                    report += f"""
- **{model_name}**: {fit_status}
"""
                    if fit_status == "Underfitting":
                        report += """  - The model is too simple to capture the underlying patterns
  - Consider using a more complex model or adding more features
"""
                    elif fit_status == "Overfitting":
                        report += """  - The model is too complex and capturing noise
  - Consider increasing regularization or collecting more training data
"""
                    else:  # Good Fit
                        report += """  - The model shows a good balance between bias and variance
"""
        
        report += """
Learning curve visualizations can be found in the `reports/visuals/learning_curves/` directory.

## Model Recommendation

Based on the performance metrics, the **{self.best_model['name']}** model is recommended for this dataset.

The complete model leaderboard and detailed recommendation can be found in:
- `reports/model_leaderboard.csv` - CSV file with all model metrics
- `reports/model_recommendation.md` - Detailed recommendation with justification

## Next Steps
- Consider {"further " if include_tuning_info else ""}hyperparameter tuning to improve model performance
- Evaluate the best model on new data to ensure generalizability
- Consider feature engineering to potentially improve performance
- For production deployment, retrain the model on the full dataset

---
"""
        return report


def train_models(dataset_path: str, target_column: str, tune_models: bool = False, 
                use_bayesian_optimization: bool = False, n_jobs: int = -1, cv: int = 5) -> Tuple[Dict, Dict, Dict]:
    """
    Train machine learning models on the specified dataset.
    
    This is the main function to be called from external modules.
    
    Args:
        dataset_path (str): Path to the CSV dataset to analyze.
        target_column (str): Name of the column to use as the target variable.
        tune_models (bool, optional): Whether to perform hyperparameter tuning. Defaults to False.
        use_bayesian_optimization (bool, optional): Whether to use Bayesian optimization (Optuna) 
            instead of grid search. Defaults to False.
        n_jobs (int, optional): Number of parallel jobs for tuning. Defaults to -1 (all cores).
        cv (int, optional): Number of cross-validation folds. Defaults to 5.
        
    Returns:
        Tuple[Dict, Dict, Dict]: Trained models, predictions, and performance metrics.
    """
    agent = ModelAgent()
    return agent.train_and_evaluate(dataset_path, target_column, tune_models, use_bayesian_optimization, n_jobs, cv)


if __name__ == "__main__":
    # If run as a script, accept dataset path and target column as command line arguments
    import argparse
    
    parser = argparse.ArgumentParser(description='Train and evaluate machine learning models on a dataset.')
    parser.add_argument('dataset_path', type=str, help='Path to the CSV dataset')
    parser.add_argument('target_column', type=str, help='Name of the target column')
    parser.add_argument('--tune', action='store_true', help='Enable hyperparameter tuning')
    parser.add_argument('--bayesian', action='store_true', help='Use Bayesian optimization (requires Optuna)')
    parser.add_argument('--n_jobs', type=int, default=-1, help='Number of parallel jobs for tuning')
    parser.add_argument('--cv', type=int, default=5, help='Number of cross-validation folds')
    
    args = parser.parse_args()
    
    models, predictions, metrics = train_models(
        args.dataset_path, 
        args.target_column,
        args.tune,
        args.bayesian,
        args.n_jobs,
        args.cv
    )
    
    if models:
        print(f"Model training completed successfully. Reports saved to ./reports/ directory")
    else:
        print(f"Model training failed. Check logs for details.")
        sys.exit(1)
