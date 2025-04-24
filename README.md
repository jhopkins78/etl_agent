# Insight Agent

A comprehensive data analysis pipeline for exploratory data analysis, modeling, evaluation, and report generation.

## Project Overview

Insight Agent is a modular Python framework designed to automate the data science workflow. It provides a structured approach to analyzing datasets, training machine learning models, evaluating their performance, and generating professional reports.

The pipeline consists of five main phases:

1. **File Routing**: Scans uploaded directories and routes files to appropriate locations based on file types.
2. **Exploratory Data Analysis (EDA)**: Analyzes dataset structure, distributions, missing values, and relationships between variables.
3. **Model Training**: Trains machine learning models on the dataset using various algorithms.
4. **Model Evaluation**: Evaluates model performance using metrics like R², RMSE, and MAE.
5. **Report Generation**: Compiles all analysis phases into a cohesive, professional Markdown report.

## Directory Structure

```
etl_agent/
├── data/                      # Data directory
│   ├── raw/                   # Raw data files
│   └── enriched/              # Processed/cleaned data files
├── etl_agents_venv/           # Virtual environment (created during setup)
├── docs/                      # Documentation files and PDFs
├── insight_agent/             # Main package
│   ├── tasks/                 # Task modules
│   │   ├── eda_agent.py       # Exploratory Data Analysis
│   │   ├── model_agent.py     # Model Training
│   │   ├── eval_agent.py      # Model Evaluation
│   │   ├── report_agent.py    # Report Generation
│   │   └── file_router_agent.py # File Routing and Classification
│   └── utils/                 # Utility modules
│       └── db_connector.py    # Database connection utilities
├── logs/                      # Log files
├── reports/                   # Generated reports
├── requirements.txt           # Project dependencies
├── setup.py                   # Package installation script
└── run_pipeline.sh            # Shell script to run the full pipeline
```

## Setup Instructions

### Creating a Virtual Environment

```bash
# Create a virtual environment
python3 -m venv etl_agents_venv

# Activate the virtual environment
# On macOS/Linux:
source etl_agents_venv/bin/activate
# On Windows:
# etl_agents_venv\Scripts\activate
```

### Installing Dependencies

```bash
# Install required packages
pip install -r requirements.txt

# Install the package in development mode
pip install -e .
```

### Database Setup (Optional)

If you need database connectivity for loading or retrieving data:

1. Copy the example environment file:
   ```bash
   cp insight_agent/utils/.env.example insight_agent/utils/.env
   ```

2. Edit the `.env` file with your database credentials:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

## Usage

### Automated Pipeline Execution

The easiest way to run the full Insight Agent pipeline is using the provided shell script:

```bash
./run_pipeline.sh --dataset data/enriched/your_dataset.csv --target target_column --assignment assignment.md
```

Parameters:
- `--dataset`: Path to the cleaned CSV file (required)
- `--target`: Target column name for modeling (required)
- `--assignment`: Path to assignment metadata file (optional)

### Manual CLI Execution

You can also run individual components of the pipeline manually:

#### 1. File Routing

```bash
# Route files from a specific folder
python -m insight_agent.insight_agent --route-files /path/to/assignment/folder

# Using the run_pipeline.sh script
./run_pipeline.sh --route-files /path/to/assignment/folder
```

The File Router Agent will:
- Move `.csv`, `.xlsx`, `.xls` files to `/data/raw/`
- Copy `.md`, `.txt` files to `/assignment.md`
- Place `.pdf` files in `/docs/`
- Log all activities to `/logs/router_log.csv`

For more details, see [README_file_router.md](README_file_router.md).

#### 2. Exploratory Data Analysis

```bash
python -m insight_agent.insight_agent --dataset data/enriched/your_dataset.csv
```

#### 3. Model Training

```bash
python -m insight_agent.insight_agent --dataset data/enriched/your_dataset.csv --train-models --target-column target_column
```

#### 4. Report Generation

```bash
python -m insight_agent.insight_agent --generate-report --assignment assignment.md
```

## Example Workflows

### Complete Analysis Pipeline

Here's a complete example of analyzing a dataset:

```bash
# Activate the virtual environment
source etl_agents_venv/bin/activate

# Run the full pipeline
./run_pipeline.sh --dataset data/enriched/abalone_clean.csv --target age --assignment assignment.md

# The final report will be available at reports/final_report.md
```

### File Routing and Analysis

Here's an example workflow that starts with file routing:

```bash
# Activate the virtual environment
source etl_agents_venv/bin/activate

# Step 1: Route files from an assignment folder
./run_pipeline.sh --route-files /path/to/assignment/folder

# Step 2: Run the analysis pipeline on the routed data
./run_pipeline.sh --dataset data/raw/dataset.csv --target target_column

# The final report will be available at reports/final_report.md
```

### Demo Script

You can also run the demo script to see the file router in action:

```bash
# Activate the virtual environment
source etl_agents_venv/bin/activate

# Run the demo script
python demo_file_router.py
```

This will create a sample folder structure with various file types and demonstrate how the file router processes them.

## Contributing

To contribute to the Insight Agent project:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure functionality
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
