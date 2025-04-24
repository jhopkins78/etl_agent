#!/usr/bin/env python3
"""
Fix the CSV formatting of the abalone dataset.
"""

import csv

# Read the processed data and write to a properly formatted CSV
with open('abalone_processed.csv', 'r') as infile, open('abalone.csv', 'w', newline='') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    # Read the header row
    headers = next(reader)
    writer.writerow(headers)
    
    # Write the data rows
    for row in reader:
        writer.writerow(row)

print("CSV formatting fixed. Output saved to abalone.csv")
