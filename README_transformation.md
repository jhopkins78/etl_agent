# ETL Transformation Agent

A Python-based Transformation Agent designed to operate as part of a multi-agent ETL pipeline.

## Features

- Monitors the `/data/processed` folder for new normalized CSV or JSON files
- Automatically loads each dataset and inspects column names and datatypes
- Applies a BIM-inspired tagging system to each field:
  - Assigns semantic tags (e.g., "identity", "temporal_reference", "entity_type") based on field names and data types
  - Uses a configurable `tags.yaml` file to define tagging rules
  - Appends a metadata block to each file describing the tags used and their meanings
- Applies data transformations based on tags:
  - Standardizes date formats for temporal fields
  - One-hot encodes categorical variables
  - Normalizes numeric ranges to 0-1
- Saves the transformed dataset into `/data/enriched` with the same base filename
- Maintains a transformation log in `/logs/transformation_log.csv`

## Requirements

- Python 3.6+
- Required packages:
  - pandas: For data manipulation
  - numpy: For numerical operations
  - pyyaml: For YAML file parsing
  - watchdog: For file monitoring

## Installation

```bash
# Install required packages
pip install pandas numpy pyyaml watchdog
```

## Directory Structure

```
etl_agent/
├── etl_agent.py                # Extraction Agent script
├── transformation_agent.py     # Transformation Agent script
├── process_files.py            # Manual processor for extraction
├── standalone_processor.py     # Standalone processor for extraction
├── standalone_transformer.py   # Standalone processor for transformation
├── README.md                   # Extraction Agent documentation
├── README_transformation.md    # Transformation Agent documentation
├── config/
│   └── tags.yaml               # Tagging system configuration
├── data/
│   ├── raw/                    # Input directory for raw data files
│   ├── processed/              # Output from Extraction Agent / Input for Transformation Agent
│   └── enriched/               # Output directory for transformed data files
└── logs/
    └── transformation_log.csv  # Log of transformation operations
```

## Usage

### Running the Transformation Agent

1. Ensure the Extraction Agent has processed files into the `/data/processed` directory
2. Run the Transformation Agent:

```bash
python transformation_agent.py
```

3. The agent will:
   - Process any existing files in the processed directory
   - Monitor for new files and process them automatically
   - Save transformed data to the `/data/enriched` directory
   - Log transformation operations to `/logs/transformation_log.csv`

### Running the Standalone Transformer

If you prefer to process files manually without the file monitoring component:

```bash
python standalone_transformer.py
```

This will process all files in the `/data/processed` directory without starting the monitoring service.

## Tagging System

The Transformation Agent uses a BIM-inspired tagging system defined in `config/tags.yaml`. This configuration file defines:

1. **Semantic Tags**: Rules for assigning tags to fields based on keywords in field names and data types
2. **Transformation Rules**: Specifications for how to transform fields with specific tags

Example semantic tags include:
- **identity**: Fields that uniquely identify an entity (e.g., id, uuid)
- **temporal_reference**: Fields related to time (e.g., date, timestamp)
- **entity_type**: Fields that categorize entities (e.g., type, category, status)
- **quantitative**: Fields with numeric measurements (e.g., price, count)

Example transformations include:
- **date_standardization**: Standardizes date fields to a consistent format
- **one_hot_encoding**: Applies one-hot encoding to categorical fields
- **numeric_normalization**: Normalizes numeric fields to a 0-1 range

## Output Format

All transformed data is saved as JSON files with the following structure:

```json
{
  "metadata": {
    "filename": "original_filename.ext",
    "timestamp": "2025-04-19T20:50:00.123456",
    "source_format": "csv|json",
    "row_count": 5,
    "column_count": 7,
    "columns": ["id", "first_name", "last_name", "email", "phone", "signup_date", "status"],
    "transformation_timestamp": "2025-04-19T21:05:00.123456",
    "field_tags": {
      "id": ["identity"],
      "first_name": ["descriptive"],
      "last_name": ["descriptive"],
      "email": ["contact_info"],
      "phone": ["contact_info"],
      "signup_date": ["temporal_reference"],
      "status": ["entity_type"]
    },
    "transformations": {
      "applied_transformations": {
        "date_standardization": {
          "transformed_columns": ["signup_date"],
          "target_format": "%Y-%m-%d"
        },
        "one_hot_encoding": {
          "transformed_columns": ["status"],
          "new_columns": ["status_active", "status_inactive", "status_pending"],
          "dropped_columns": ["status"],
          "max_categories": 20
        }
      },
      "new_columns": ["status_active", "status_inactive", "status_pending"],
      "dropped_columns": ["status"]
    },
    "tag_descriptions": {
      "identity": "Fields that uniquely identify an entity",
      "descriptive": "Fields that provide descriptive information about entities",
      "contact_info": "Fields containing contact information",
      "temporal_reference": "Fields related to time and temporal references",
      "entity_type": "Fields that categorize or classify entities"
    }
  },
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "555-123-4567",
      "signup_date": "2025-01-15",
      "status_active": 1,
      "status_inactive": 0,
      "status_pending": 0
    },
    ...
  ]
}
```

## Transformation Log

The agent maintains a log of all transformation operations in `/logs/transformation_log.csv` with the following columns:

- **timestamp**: When the transformation occurred
- **filename**: Name of the processed file
- **source_format**: Format of the source file (CSV or JSON)
- **row_count**: Number of rows in the dataset
- **column_count**: Number of columns in the dataset
- **applied_tags**: Summary of tags applied to fields
- **applied_transformations**: Summary of transformations applied
- **status**: Success or error message
- **output_path**: Path to the output file

## Architecture

The Transformation Agent is designed with a modular architecture:

- **File Monitoring**: Uses watchdog to monitor the processed directory for new files
- **Data Loading**: Loads data from CSV and JSON files and inspects datatypes
- **Tagging System**: Applies semantic tags to fields based on configurable rules
- **Data Transformation**: Applies transformations based on field tags
- **Metadata Management**: Attaches metadata to each dataset
- **Data Forwarding**: Saves transformed data to the enriched directory
- **Logging**: Maintains a log of transformation operations

## Integration with ETL Pipeline

The Transformation Agent is designed to work as part of a multi-agent ETL pipeline:

1. **Extraction Agent** (`etl_agent.py`):
   - Monitors `/data/raw` for new files
   - Extracts and normalizes data
   - Saves to `/data/processed`

2. **Transformation Agent** (`transformation_agent.py`):
   - Monitors `/data/processed` for new files
   - Applies tagging and transformations
   - Saves to `/data/enriched`

3. Future agents could include:
   - **Loading Agent**: Loads transformed data into databases or data warehouses
   - **Analysis Agent**: Performs analytics on the enriched data
   - **Visualization Agent**: Creates visualizations from the enriched data

## Customizing the Tagging System

To customize the tagging system, edit the `config/tags.yaml` file:

1. Add or modify semantic tags by updating the `semantic_tags` section
2. Add or modify transformation rules by updating the `transformations` section

Example of adding a new semantic tag:

```yaml
semantic_tags:
  # Add a new tag for financial fields
  financial:
    keywords:
      - revenue
      - cost
      - profit
      - margin
      - budget
    data_types:
      - int
      - float
    description: "Fields containing financial information"
```

Example of adding a new transformation:

```yaml
transformations:
  # Add a new transformation for financial fields
  financial_rounding:
    applies_to_tags:
      - financial
    decimal_places: 2
    description: "Rounds financial fields to 2 decimal places"
```

Then implement the new transformation in the `DataTransformer` class in `transformation_agent.py`.
