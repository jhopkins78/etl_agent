#!/usr/bin/env python3
"""
Create a properly formatted CSV file for the abalone dataset.
"""

import pandas as pd

# Define the column names
columns = ["Sex", "Length", "Diameter", "Height", "Whole_weight", "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"]

# Read the raw data
with open('abalone.csv', 'r') as f:
    lines = f.readlines()

# Skip the header line
data_lines = lines[1:]

# Process each line
processed_data = []
for line in data_lines:
    # Extract the sex (first character)
    sex = line[0]
    
    # Extract the numeric values
    values = line[1:].strip().split()
    
    # Create a row with sex and values
    row = [sex] + values
    processed_data.append(row)

# Create a DataFrame
df = pd.DataFrame(processed_data, columns=columns)

# Save to CSV
df.to_csv('abalone_final.csv', index=False)

print("Created properly formatted CSV file: abalone_final.csv")
