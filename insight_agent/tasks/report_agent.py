"""
Report Agent Module

This module serves as the final step in the Insight Agent pipeline, responsible for
compiling all analysis phases (EDA, Modeling, Evaluation) into a cohesive, professional
Markdown report.

The report agent reads fragments from previous steps, combines them into a single document,
and adds necessary formatting and structure to create a complete analysis report.
"""

import os
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Union, Any


def read_file_content(file_path: str) -> str:
    """
    Read the content of a file.
    
    Args:
        file_path (str): Path to the file to read.
        
    Returns:
        str: Content of the file.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading file {file_path}: {str(e)}")
        return ""


def write_file_content(file_path: str, content: str) -> bool:
    """
    Write content to a file.
    
    Args:
        file_path (str): Path to the file to write.
        content (str): Content to write to the file.
        
    Returns:
        bool: True if successful, False otherwise.
    """
    try:
        # Ensure directory exists
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    except Exception as e:
        print(f"Error writing to file {file_path}: {str(e)}")
        return False


def extract_section(content: str, section_name: str) -> str:
    """
    Extract a section from markdown content using regex.
    
    Args:
        content (str): Markdown content to search.
        section_name (str): Name of the section to extract.
        
    Returns:
        str: Extracted section content or empty string if not found.
    """
    # Pattern to match a section heading and its content up to the next heading of same or higher level
    pattern = rf'## {section_name}\s*\n(.*?)(?=\n## |\Z)'
    match = re.search(pattern, content, re.DOTALL)
    
    if match:
        return match.group(1).strip()
    return ""


def read_eda_section() -> str:
    """
    Read the EDA section from the eda_agent output.
    
    Returns:
        str: EDA section content.
    """
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Path to the EDA report
    eda_report_path = project_root / "reports" / "eda_report.md"
    
    if not eda_report_path.exists():
        print(f"Warning: EDA report not found at {eda_report_path}")
        return "## Exploratory Data Analysis\n\nNo EDA results available."
    
    # Read the EDA report
    eda_content = read_file_content(str(eda_report_path))
    
    # Extract relevant sections or return the whole content
    if not eda_content:
        return "## Exploratory Data Analysis\n\nNo EDA results available."
    
    # Clean up the content to ensure it fits well in the final report
    # Remove any title/header that would be redundant
    eda_content = re.sub(r'^# .*?\n', '', eda_content)
    
    # Ensure the section has the correct heading level
    if not re.search(r'^## Exploratory Data Analysis', eda_content, re.MULTILINE):
        eda_content = "## Exploratory Data Analysis\n\n" + eda_content
    
    return eda_content


def read_modeling_results() -> str:
    """
    Read the modeling results from the model_agent output.
    
    Returns:
        str: Modeling section content.
    """
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Path to the modeling report
    model_report_path = project_root / "reports" / "model_report.md"
    
    if not model_report_path.exists():
        print(f"Warning: Model report not found at {model_report_path}")
        return "## Modeling\n\nNo modeling results available."
    
    # Read the modeling report
    model_content = read_file_content(str(model_report_path))
    
    # Extract relevant sections or return the whole content
    if not model_content:
        return "## Modeling\n\nNo modeling results available."
    
    # Clean up the content to ensure it fits well in the final report
    # Remove any title/header that would be redundant
    model_content = re.sub(r'^# .*?\n', '', model_content)
    
    # Ensure the section has the correct heading level
    if not re.search(r'^## Modeling', model_content, re.MULTILINE):
        model_content = "## Modeling\n\n" + model_content
    
    return model_content


def read_evaluation_summary() -> str:
    """
    Read the evaluation summary from the eval_agent output.
    
    Returns:
        str: Evaluation section content.
    """
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Path to the evaluation report
    eval_report_path = project_root / "reports" / "evaluation_report.md"
    
    if not eval_report_path.exists():
        print(f"Warning: Evaluation report not found at {eval_report_path}")
        return "## Evaluation\n\nNo evaluation results available."
    
    # Read the evaluation report
    eval_content = read_file_content(str(eval_report_path))
    
    # Extract relevant sections or return the whole content
    if not eval_content:
        return "## Evaluation\n\nNo evaluation results available."
    
    # Clean up the content to ensure it fits well in the final report
    # Remove any title/header that would be redundant
    eval_content = re.sub(r'^# .*?\n', '', eval_content)
    
    # Ensure the section has the correct heading level
    if not re.search(r'^## Evaluation', eval_content, re.MULTILINE):
        eval_content = "## Evaluation\n\n" + eval_content
    
    return eval_content


def read_assignment_metadata() -> str:
    """
    Read metadata from assignment.md to include in the introduction.
    
    Returns:
        str: Assignment metadata content.
    """
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Path to the assignment file
    assignment_path = project_root / "assignment.md"
    
    if not assignment_path.exists():
        print(f"Warning: Assignment file not found at {assignment_path}")
        return ""
    
    # Read the assignment file
    assignment_content = read_file_content(str(assignment_path))
    
    # Extract relevant metadata
    metadata = ""
    
    # Extract title if available
    title_match = re.search(r'^# (.*?)$', assignment_content, re.MULTILINE)
    if title_match:
        metadata += f"**Assignment Title:** {title_match.group(1)}\n\n"
    
    # Extract other metadata like date, author, etc. if available
    date_match = re.search(r'Date:\s*(.*?)$', assignment_content, re.MULTILINE)
    if date_match:
        metadata += f"**Date:** {date_match.group(1)}\n\n"
    
    author_match = re.search(r'Author:\s*(.*?)$', assignment_content, re.MULTILINE)
    if author_match:
        metadata += f"**Author:** {author_match.group(1)}\n\n"
    
    # Extract objectives or description
    objectives_match = re.search(r'## Objectives\s*(.*?)(?=\n## |\Z)', assignment_content, re.DOTALL)
    if objectives_match:
        metadata += f"**Objectives:**\n\n{objectives_match.group(1).strip()}\n\n"
    
    return metadata


def generate_table_of_contents(content: str) -> str:
    """
    Generate a table of contents from markdown content.
    
    Args:
        content (str): Markdown content to analyze.
        
    Returns:
        str: Table of contents in markdown format.
    """
    toc = "## Table of Contents\n\n"
    
    # Find all headings
    headings = re.findall(r'^(#{2,4}) (.*?)$', content, re.MULTILINE)
    
    for heading_level, heading_text in headings:
        # Skip the title and TOC itself
        if heading_text == "Table of Contents" or len(heading_level) == 1:
            continue
        
        # Calculate indentation based on heading level
        indent = "  " * (len(heading_level) - 2)
        
        # Create anchor link
        anchor = heading_text.lower().replace(' ', '-')
        anchor = re.sub(r'[^\w-]', '', anchor)
        
        # Add to TOC
        toc += f"{indent}- [{heading_text}](#{anchor})\n"
    
    return toc


def generate_introduction(assignment_metadata: str) -> str:
    """
    Generate the introduction section of the report.
    
    Args:
        assignment_metadata (str): Metadata from the assignment file.
        
    Returns:
        str: Introduction section content.
    """
    intro = "## Introduction\n\n"
    
    if assignment_metadata:
        intro += assignment_metadata + "\n"
    
    # Add a general introduction paragraph
    intro += """This report presents a comprehensive data analysis conducted as part of the Insight Agent pipeline. 
The analysis includes exploratory data analysis (EDA), modeling, and evaluation phases. 
The goal is to extract meaningful insights from the data and develop predictive models 
that can be used for decision-making.\n\n"""
    
    return intro


def generate_conclusion() -> str:
    """
    Generate the conclusion section of the report.
    
    Returns:
        str: Conclusion section content.
    """
    conclusion = "## Conclusion\n\n"
    
    # Add a general conclusion paragraph
    conclusion += """This report has presented a comprehensive analysis of the dataset, including exploratory data analysis,
modeling, and evaluation. The insights gained from this analysis can be used to inform decision-making
and guide future research. The models developed demonstrate the potential for predictive analytics
in this domain, with performance metrics indicating their reliability and usefulness.\n\n"""
    
    conclusion += "Key findings from this analysis include:\n\n"
    conclusion += "- Patterns and trends identified in the exploratory data analysis\n"
    conclusion += "- Performance of different modeling approaches\n"
    conclusion += "- Evaluation metrics that demonstrate the effectiveness of the models\n\n"
    
    conclusion += """These results provide a foundation for further investigation and application in real-world scenarios.
Future work could explore additional modeling techniques, feature engineering approaches, or
the integration of external data sources to enhance predictive capabilities.\n"""
    
    return conclusion


def generate_report(assignment_path: Optional[str] = None) -> bool:
    """
    Generate the final report by combining all sections.
    
    Args:
        assignment_path (Optional[str]): Path to the assignment metadata file.
            If provided, assignment details will be included in the introduction.
            
    Returns:
        bool: True if report generation was successful, False otherwise.
    """
    try:
        # Get the current timestamp
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Read assignment metadata
        if assignment_path and os.path.exists(assignment_path):
            # Use the provided assignment path
            assignment_content = read_file_content(assignment_path)
            
            # Extract metadata from the assignment content
            metadata = ""
            
            # Extract title if available
            title_match = re.search(r'^# (.*?)$', assignment_content, re.MULTILINE)
            if title_match:
                metadata += f"**Assignment Title:** {title_match.group(1)}\n\n"
            
            # Extract other metadata like date, author, etc. if available
            date_match = re.search(r'Date:\s*(.*?)$', assignment_content, re.MULTILINE)
            if date_match:
                metadata += f"**Date:** {date_match.group(1)}\n\n"
            
            author_match = re.search(r'Author:\s*(.*?)$', assignment_content, re.MULTILINE)
            if author_match:
                metadata += f"**Author:** {author_match.group(1)}\n\n"
            
            # Extract objectives or description
            objectives_match = re.search(r'## Objectives\s*(.*?)(?=\n## |\Z)', assignment_content, re.DOTALL)
            if objectives_match:
                metadata += f"**Objectives:**\n\n{objectives_match.group(1).strip()}\n\n"
                
            assignment_metadata = metadata
        else:
            # Use the default method to read assignment metadata
            assignment_metadata = read_assignment_metadata()
        
        # Generate title and summary
        title = "# Data Analysis Report\n\n"
        summary = f"*This report was automatically generated by the Insight Agent on {timestamp}*\n\n"
        summary += """This document presents a comprehensive analysis of the dataset, including exploratory data analysis,
modeling, and evaluation. The report is organized into sections that follow the data science workflow,
from initial data exploration to model development and performance assessment.\n\n"""
        
        # Generate introduction
        introduction = generate_introduction(assignment_metadata)
        
        # Read sections from previous steps
        eda_section = read_eda_section()
        modeling_section = read_modeling_results()
        evaluation_section = read_evaluation_summary()
        
        # Generate conclusion
        conclusion = generate_conclusion()
        
        # Combine all sections
        content = f"{title}{summary}{introduction}{eda_section}\n\n{modeling_section}\n\n{evaluation_section}\n\n{conclusion}"
        
        # Generate table of contents
        toc = generate_table_of_contents(content)
        
        # Insert TOC after the summary
        content = content.replace(summary, summary + toc + "\n")
        
        # Save the report to the default location
        project_root = Path(__file__).parent.parent.parent
        report_path = project_root / "reports" / "final_report.md"
        
        # Ensure the reports directory exists
        os.makedirs(report_path.parent, exist_ok=True)
        
        # Write the report
        success = write_file_content(str(report_path), content)
        
        return success
        
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        return False


def save_report(content: str, output_path: Optional[str] = None) -> str:
    """
    Save the report to a file.
    
    Args:
        content (str): Report content to save.
        output_path (Optional[str]): Path to save the report to. If None, uses the default path.
        
    Returns:
        str: Path to the saved report.
    """
    # Get the project root directory
    project_root = Path(__file__).parent.parent.parent
    
    # Default output path
    if output_path is None:
        output_path = project_root / "reports" / "final_report.md"
    else:
        output_path = Path(output_path)
    
    # Ensure the directory exists
    os.makedirs(output_path.parent, exist_ok=True)
    
    # Write the report
    success = write_file_content(str(output_path), content)
    
    if success:
        print(f"Report saved to {output_path}")
    else:
        print(f"Failed to save report to {output_path}")
    
    return str(output_path)


def main(output_path: Optional[str] = None) -> Dict[str, Any]:
    """
    Main function to generate and save the report.
    
    Args:
        output_path (Optional[str]): Path to save the report to. If None, uses the default path.
        
    Returns:
        Dict[str, Any]: Dictionary with the result of the operation.
    """
    try:
        # Generate the report
        success = generate_report(output_path)
        
        if success:
            # Get the default report path
            project_root = Path(__file__).parent.parent.parent
            report_path = project_root / "reports" / "final_report.md"
            
            return {
                "success": True,
                "message": f"Report generated successfully and saved to {report_path}",
                "report_path": str(report_path)
            }
        else:
            return {
                "success": False,
                "message": "Failed to generate report",
                "error": "Unknown error"
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error generating report: {str(e)}",
            "error": str(e)
        }


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate a final report from analysis results")
    parser.add_argument("--output", type=str, help="Path to save the report to", default=None)
    
    args = parser.parse_args()
    result = main(args.output)
    
    if result["success"]:
        print(result["message"])
    else:
        print(f"Error: {result['message']}")
        exit(1)
