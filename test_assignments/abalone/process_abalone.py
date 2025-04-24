#!/usr/bin/env python3
"""
Process the abalone dataset to add headers and convert to proper CSV format.
"""

import csv
import re

# Define the headers
headers = ["Sex", "Length", "Diameter", "Height", "Whole_weight", "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"]

# Read the raw data and write to CSV
with open('abalone.csv', 'r') as infile, open('abalone_processed.csv', 'w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerow(headers)
    
    for line in infile:
        # Extract the first character (Sex) and the rest of the line
        sex = line[0]
        rest = line[1:].strip()
        
        # Split the rest of the line by numbers and decimals
        values = re.findall(r'[0-9]+\.[0-9]+|[0-9]+', rest)
        
        # Combine sex and values and write to CSV
        row = [sex] + values
        writer.writerow(row)

print("Processing complete. Output saved to abalone_processed.csv")
