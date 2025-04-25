#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Flask Backend Application

This is the main Flask application that provides API endpoints for:
- Uploading assignment files
- Running EDA tasks
- Retrieving final reports
- Getting data previews

The application uses utility modules for file operations and subprocess execution.
"""

import os
import json
import shutil
import tempfile
import openai
import requests
from flask import Flask, request, jsonify, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS
from backend.utils.agent_runner import run_eda_task, run_full_pipeline
from backend.utils.file_utils import save_uploaded_file, read_markdown_file, load_csv_preview
from insight_agent.tasks.file_router_agent import route_files_from_folder 
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app)

headers = {
    "Authorization": f"Bearer {os.getenv('RENDER_API_KEY')}",
    "Accept": "application/json"
}

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB max upload size
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)))
app.config['ASSIGNMENT_PATH'] = os.path.join(app.config['UPLOAD_FOLDER'], 'assignment.md')
app.config['REPORT_PATH'] = os.path.join(app.config['UPLOAD_FOLDER'], 'reports', 'final_report.md')
app.config['SAMPLE_DATA_PATH'] = os.path.join(app.config['UPLOAD_FOLDER'], 'data', 'enriched', 'sample.csv')

# Ensure required directories exist
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'reports'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'data', 'enriched'), exist_ok=True)
os.makedirs(os.path.join(app.config['UPLOAD_FOLDER'], 'uploads'), exist_ok=True)

# 6. Routes
@app.route('/trigger-deploy', methods=['POST'])
def trigger_deploy():
    service_id = os.getenv('RENDER_SERVICE_ID')
    if not service_id:
        return jsonify({"error": "RENDER_SERVICE_ID not set"}), 400

    url = f"https://api.render.com/v1/services/{service_id}/deploys"
    response = requests.post(url, headers=headers, json={"clearCache": False})

    if response.status_code == 201:
        return jsonify({"message": "Deploy triggered successfully"}), 201
    else:
        return jsonify(response.json()), response.status_code
    
@app.route('/generate-insight', methods=['POST'])
def generate_insight():
    data = request.get_json()
    report_text = data.get('report')

    print("Received request for GPT insight generation...")

    data = request.get_json()
    report_text = data.get('report')
    print("📝 Report Text:", report_text)

    if not report_text:
        return jsonify({"error": "No report content provided"}), 400

    openai.api_key = os.getenv("OPENAI_API_KEY")

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a data science assistant. Generate clear, executive-level insights."},
                {"role": "user", "content": report_text}
            ]
        )
        summary = response.choices[0].message.content.strip()
        print("✅ Generated Insight:", summary)
        return jsonify({"insight": summary})
    except Exception as e:
        print("❌ Error during GPT call:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/upload-assignment', methods=['POST'])
def upload_assignment():
    """
    Endpoint to upload an assignment file (.md) and save it as assignment.md.
    
    Returns:
        JSON response with success status and message.
    """
    try:
        # Check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No file part in the request'
            }), 400
        
        file = request.files['file']
        
        # Check if a file was selected
        if file.filename == '':
            return jsonify({
                'success': False,
                'message': 'No file selected'
            }), 400
        
        # Check file extension
        if not file.filename.lower().endswith('.md'):
            return jsonify({
                'success': False,
                'message': 'Only Markdown (.md) files are allowed'
            }), 400
        
        # Save the file
        file_data = file.read()
        success, message = save_uploaded_file(file_data, app.config['ASSIGNMENT_PATH'])
        
        if success:
            return jsonify({
                'success': True,
                'message': 'Assignment uploaded successfully',
                'filename': 'assignment.md'
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error uploading assignment: {str(e)}'
        }), 500

@app.route('/run-eda', methods=['POST'])
def run_eda():
    """
    Endpoint to trigger the EDA task using subprocess.
    Uses the Insight Agent to analyze sample.csv and write to final_report.md.
    
    Returns:
        JSON response with success status and message.
    """
    try:
        # Check if sample data exists
        if not os.path.exists(app.config['SAMPLE_DATA_PATH']):
            return jsonify({
                'success': False,
                'message': f'Sample data not found at {app.config["SAMPLE_DATA_PATH"]}'
            }), 404
        
        # Run the EDA task
        success, message = run_eda_task(app.config['SAMPLE_DATA_PATH'])
        
        if success:
            return jsonify({
                'success': True,
                'message': 'EDA task completed successfully',
                'report_path': app.config['REPORT_PATH']
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': message
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error running EDA task: {str(e)}'
        }), 500

@app.route('/final-report', methods=['GET'])
def get_final_report():
    """
    Endpoint to read reports/final_report.md and return it as Markdown content.
    
    Returns:
        Markdown content or JSON error response.
    """
    try:
        # Read the report file
        success, content = read_markdown_file(app.config['REPORT_PATH'])
        
        if success:
            return content, 200, {'Content-Type': 'text/markdown'}
        else:
            return jsonify(content), 404  # content contains error message
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving final report: {str(e)}'
        }), 500

@app.route('/upload-assignment-files', methods=['POST'])
def upload_assignment_files():
    """
    Endpoint to upload multiple files (.csv, .xlsx, .md, .txt, .pdf) and route them
    to appropriate locations using the file_router_agent.
    
    Accepts multipart/form-data with multiple files under the field name files[]
    
    Returns:
        JSON response with routing results.
    """
    try:
        # Check if the post request has the files part
        if 'files[]' not in request.files:
            return jsonify({
                'success': False,
                'message': 'No files part in the request'
            }), 400
        
        # Get list of files
        files = request.files.getlist('files[]')
        
        # Check if any files were selected
        if len(files) == 0 or all(file.filename == '' for file in files):
            return jsonify({
                'success': False,
                'message': 'No files selected'
            }), 400
        
        # Create a temporary directory to store the uploaded files
        uploads_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'uploads')
        temp_dir = os.path.join(uploads_dir, f"upload_{tempfile.mktemp(prefix='', dir='').split('/')[-1]}")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save all files to the temporary directory
        saved_files = []
        for file in files:
            if file.filename == '':
                continue
                
            # Secure the filename to prevent directory traversal attacks
            filename = secure_filename(file.filename)
            file_path = os.path.join(temp_dir, filename)
            
            # Save the file
            file.save(file_path)
            saved_files.append(file_path)
        
        # Route the files using file_router_agent
        if saved_files:
            routing_results = route_files_from_folder(temp_dir)
            
            # Clean up the temporary directory
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                print(f"Warning: Failed to clean up temporary directory: {str(e)}")
            
            # Return the routing results
            return jsonify({
                'success': True,
                'message': f"Successfully processed {routing_results['successful_files']} of {routing_results['processed_files']} files",
                'results': routing_results
            }), 200
        else:
            # Clean up the temporary directory
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                print(f"Warning: Failed to clean up temporary directory: {str(e)}")
                
            return jsonify({
                'success': False,
                'message': 'No valid files were uploaded'
            }), 400
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error uploading files: {str(e)}'
        }), 500

@app.route('/run-full-pipeline', methods=['POST'])
def run_full_pipeline_route():
    """
    Endpoint to run the full Insight Agent pipeline after files have been uploaded and routed.
    This route will:
    1. Find the most recent dataset in data/raw/
    2. Run EDA
    3. Train models (Linear & KNN)
    4. Evaluate models
    5. Generate final report
    
    Returns:
        JSON response with pipeline results.
    """
    try:
        # Run the full pipeline
        result = run_full_pipeline()
        
        if result['status'] == 'success':
            return jsonify({
                'success': True,
                'message': result['summary'],
                'report_path': result['report_path'],
                'log_path': result.get('log_path')
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': result['summary'],
                'error': result.get('error', 'Unknown error')
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error running full pipeline: {str(e)}'
        }), 500

@app.route('/data-preview', methods=['GET'])
def get_data_preview():
    """
    Endpoint to read first 20 rows of sample.csv and return column names + row data as JSON.
    
    Returns:
        JSON response with column names and row data.
    """
    try:
        # Load CSV preview
        success, data = load_csv_preview(app.config['SAMPLE_DATA_PATH'])
        
        if success:
            return jsonify({
                'success': True,
                'data': data
            }), 200
        else:
            return jsonify({
                'success': False,
                'message': data.get('error', 'Unknown error')
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error retrieving data preview: {str(e)}'
        }), 500

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(405)
def method_not_allowed(error):
    """Handle 405 errors."""
    return jsonify({
        'success': False,
        'message': 'Method not allowed'
    }), 405

@app.errorhandler(500)
def server_error(error):
    """Handle 500 errors."""
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
