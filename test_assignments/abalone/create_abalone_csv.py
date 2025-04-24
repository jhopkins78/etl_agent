#!/usr/bin/env python3
"""
Create a properly formatted abalone CSV file from scratch.
"""

import csv
import re

# Define the column names
columns = ["Sex", "Length", "Diameter", "Height", "Whole_weight", "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"]

# Create a new CSV file with the proper headers
with open('abalone_final.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(columns)
    
    # Read the raw data file
    with open('abalone.csv', 'r') as raw_file:
        # Skip the header line
        next(raw_file)
        
        for line in raw_file:
            # Extract the sex (first character)
            sex = line[0]
            
            # Extract all numeric values using regex
            values = re.findall(r'\d+\.\d+|\d+', line)
            
            # Ensure we have exactly 8 numeric values
            if len(values) == 8:
                # Write the row with sex and values
                writer.writerow([sex] + values)

print("Created properly formatted CSV file: abalone_final.csv")
