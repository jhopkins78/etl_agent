# ETL Loading Agent

A Python-based Loading Agent designed to operate as part of a multi-agent ETL pipeline.

## Features

- Monitors the `/data/enriched` folder for new processed CSV or JSON files
- Automatically loads each dataset into a PostgreSQL-compatible database (e.g., Supabase)
- Handles table creation with schema inference if a table doesn't exist
- Adds a `load_status` column with "loaded" value and timestamp to each record
- Archives processed files to `/data/archived` after successful loading
- Maintains a loading log in `/logs/loading_log.csv`
- Modular design with clear separation between components
- Prepared for future integration with message-passing systems

## Requirements

- Python 3.6+
- Required packages:
  - pandas: For data manipulation
  - sqlalchemy: For database interactions
  - watchdog: For file monitoring
  - python-dotenv: For loading environment variables

## Installation

```bash
# Install required packages
pip install pandas sqlalchemy watchdog python-dotenv
```

## Directory Structure

```
etl_agent/
├── etl_agent.py                # Extraction Agent script
├── transformation_agent.py     # Transformation Agent script
├── loading_agent.py            # Loading Agent script
├── process_files.py            # Manual processor for extraction
├── standalone_processor.py     # Standalone processor for extraction
├── standalone_transformer.py   # Standalone processor for transformation
├── standalone_loader.py        # Standalone processor for loading
├── README.md                   # Extraction Agent documentation
├── README_transformation.md    # Transformation Agent documentation
├── README_loading.md           # Loading Agent documentation
├── config/
│   └── tags.yaml               # Tagging system configuration
├── data/
│   ├── raw/                    # Input directory for raw data files
│   ├── processed/              # Output from Extraction Agent / Input for Transformation Agent
│   ├── enriched/               # Output from Transformation Agent / Input for Loading Agent
│   └── archived/               # Archive directory for loaded files
└── logs/
    ├── transformation_log.csv  # Log of transformation operations
    └── loading_log.csv         # Log of loading operations
```

## Database Configuration

The Loading Agent requires database connection details to be provided in a `.env` file in the project root directory:

```
DB_HOST=your_database_host
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

## Usage

### Running the Loading Agent

1. Ensure the Transformation Agent has processed files into the `/data/enriched` directory
2. Run the Loading Agent:

```bash
python loading_agent.py
```

3. The agent will:
   - Process any existing files in the enriched directory
   - Monitor for new files and process them automatically
   - Load data into the database
   - Archive processed files to the `/data/archived` directory
   - Log loading operations to `/logs/loading_log.csv`

### Running the Standalone Loader

If you prefer to process files manually without the file monitoring component:

```bash
python standalone_loader.py
```

This will process all files in the `/data/enriched` directory without starting the monitoring service.

## Table Creation and Schema Inference

The Loading Agent will:

1. Check if a table matching the base filename (without extension) exists in the database
2. If the table exists, it will append the data to the existing table
3. If the table doesn't exist, it will:
   - Infer the schema from the CSV header and data types
   - Create a new table with the inferred schema
   - Add `load_status` and `load_timestamp` columns to the table

The schema inference process maps pandas data types to SQL data types:
- Integer columns → INTEGER
- Float columns → FLOAT
- Boolean columns → BOOLEAN
- Datetime columns → DATETIME
- String columns:
  - If they match date patterns → DATE
  - If length > 255 → TEXT
  - Otherwise → VARCHAR(max_length)

## Loading Log

The agent maintains a log of all loading operations in `/logs/loading_log.csv` with the following columns:

- **timestamp**: When the loading occurred
- **filename**: Name of the loaded file
- **table_name**: Name of the database table data was loaded into
- **row_count**: Number of rows loaded
- **status**: Success or error message
- **archived_path**: Path to the archived file

## Architecture

The Loading Agent is designed with a modular architecture:

- **File Monitoring**: Uses watchdog to monitor the enriched directory for new files
- **Database Connection Management**: Handles database connections and operations
- **Schema Inference**: Infers database schema from CSV files
- **Data Loading**: Loads data into database tables
- **File Archiving**: Archives processed files
- **Logging**: Maintains a log of loading operations

## Integration with ETL Pipeline

The Loading Agent is designed to work as part of a multi-agent ETL pipeline:

1. **Extraction Agent** (`etl_agent.py`):
   - Monitors `/data/raw` for new files
   - Extracts and normalizes data
   - Saves to `/data/processed`

2. **Transformation Agent** (`transformation_agent.py`):
   - Monitors `/data/processed` for new files
   - Applies tagging and transformations
   - Saves to `/data/enriched`

3. **Loading Agent** (`loading_agent.py`):
   - Monitors `/data/enriched` for new files
   - Loads data into database tables
   - Archives processed files to `/data/archived`

## Future Enhancements

Potential future enhancements for the Loading Agent include:

1. **Batch Loading**: Support for batch loading of multiple files
2. **Incremental Loading**: Support for incremental loading (append vs. replace)
3. **Data Validation**: Pre-load validation of data against schema constraints
4. **Error Recovery**: Automatic retry of failed loads
5. **Multiple Database Support**: Support for different database types
6. **Connection Pooling**: Connection pooling for better performance
7. **Parallel Loading**: Parallel loading of multiple files
8. **Data Transformation**: Additional transformations during loading
9. **Message Queue Integration**: Integration with message queues for better scalability
