#!/bin/bash
# run_pipeline.sh - Shell script to run the full Insight Agent workflow
# 
# This script automates the execution of the Insight Agent pipeline:
# 1. Exploratory Data Analysis (EDA)
# 2. Model Training
# 3. Model Evaluation
# 4. Report Generation
#
# Usage: ./run_pipeline.sh [--dataset <path> --target <column> --assignment <path>] [--route-files <folder>]

# Default values
DATASET=""
TARGET=""
ASSIGNMENT=""
ROUTE_FILES=""
VENV_DIR="etl_agents_venv"  # Default virtual environment directory

# Function to display usage information
usage() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --dataset <path>      Path to the cleaned CSV file (required for analysis pipeline)"
    echo "  --target <column>     Target column name for modeling (required for analysis pipeline)"
    echo "  --assignment <path>   Path to assignment.md file (optional)"
    echo "  --route-files <path>  Path to folder containing files to route"
    echo "  --help                Display this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --dataset data/enriched/abalone_clean.csv --target age --assignment assignment.md"
    echo "  $0 --route-files /path/to/assignment/folder"
    exit 1
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        --dataset)
            DATASET="$2"
            shift 2
            ;;
        --target)
            TARGET="$2"
            shift 2
            ;;
        --assignment)
            ASSIGNMENT="$2"
            shift 2
            ;;
        --route-files)
            ROUTE_FILES="$2"
            shift 2
            ;;
        --help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Validate parameters based on operation mode
if [ ! -z "$ROUTE_FILES" ]; then
    # File routing mode - no need to validate dataset and target
    :
elif [ -z "$DATASET" ] || [ -z "$TARGET" ]; then
    # Analysis pipeline mode - dataset and target are required
    if [ -z "$DATASET" ]; then
        echo "Error: --dataset parameter is required for analysis pipeline"
        usage
    fi
    
    if [ -z "$TARGET" ]; then
        echo "Error: --target parameter is required for analysis pipeline"
        usage
    fi
fi

# Determine the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Check if virtual environment exists
if [ ! -d "$VENV_DIR" ]; then
    echo "Virtual environment not found at $VENV_DIR"
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
    
    # Activate virtual environment
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source "$VENV_DIR/bin/activate"
    else
        echo "Error: Failed to create virtual environment"
        exit 1
    fi
    
    # Install dependencies
    echo "Installing dependencies..."
    pip install -r requirements.txt
    pip install -e .
else
    # Activate existing virtual environment
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source "$VENV_DIR/bin/activate"
    else
        echo "Error: Virtual environment activation script not found"
        exit 1
    fi
fi

# Check if we're in file routing mode or analysis pipeline mode
if [ ! -z "$ROUTE_FILES" ]; then
    # File routing mode
    echo "=============================================="
    echo "Starting File Router Agent"
    echo "=============================================="
    echo "Folder to route: $ROUTE_FILES"
    echo "=============================================="
    
    # Run file router
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Starting file routing..."
    python -m insight_agent.insight_agent --route-files "$ROUTE_FILES"
    if [ $? -ne 0 ]; then
        echo "Error: File routing failed"
        exit 1
    fi
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] File routing completed successfully"
    
    echo "=============================================="
    echo "File Router Agent Completed Successfully"
    echo "=============================================="
    echo "Files have been routed to their appropriate locations"
    echo "=============================================="
else
    # Analysis pipeline mode
    echo "=============================================="
    echo "Starting Insight Agent Pipeline"
    echo "=============================================="
    echo "Dataset: $DATASET"
    echo "Target Column: $TARGET"
    if [ ! -z "$ASSIGNMENT" ]; then
        echo "Assignment: $ASSIGNMENT"
    fi
    echo "=============================================="
    
    # Step 1: Run Exploratory Data Analysis
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Starting Exploratory Data Analysis..."
    python -m insight_agent.insight_agent --dataset "$DATASET"
    if [ $? -ne 0 ]; then
        echo "Error: Exploratory Data Analysis failed"
        exit 1
    fi
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Exploratory Data Analysis completed successfully"
    
    # Step 2: Run Model Training
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Starting Model Training..."
    python -m insight_agent.insight_agent --dataset "$DATASET" --train-models --target-column "$TARGET"
    if [ $? -ne 0 ]; then
        echo "Error: Model Training failed"
        exit 1
    fi
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Model Training completed successfully"
    
    # Step 3: Generate Final Report
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Generating Final Report..."
    if [ ! -z "$ASSIGNMENT" ]; then
        python -m insight_agent.insight_agent --generate-report --assignment "$ASSIGNMENT"
    else
        python -m insight_agent.insight_agent --generate-report
    fi
    if [ $? -ne 0 ]; then
        echo "Error: Report Generation failed"
        exit 1
    fi
    echo "[$(date +"%Y-%m-%d %H:%M:%S")] Final Report generated successfully"
    
    echo "=============================================="
    echo "Insight Agent Pipeline Completed Successfully"
    echo "=============================================="
    echo "Final report is available at: reports/final_report.md"
    echo "=============================================="
fi

# Deactivate virtual environment
deactivate

exit 0
