#!/usr/bin/env python3
"""
Final fix for the abalone CSV file to ensure proper comma separation.
"""

import pandas as pd
import re

# Define the column names
columns = ["Sex", "Length", "Diameter", "Height", "Whole_weight", "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"]

# Read the raw data file
with open('abalone.csv', 'r') as f:
    lines = f.readlines()

# Skip the header line
data_lines = lines[1:]

# Process each line
data = []
for line in data_lines:
    # Extract the sex (first character)
    sex = line[0]
    
    # Extract all numeric values using regex
    values = re.findall(r'\d+\.\d+|\d+', line)
    
    if len(values) == 8:
        # Create a row with sex and values
        row = [sex] + values
        data.append(row)

# Create a DataFrame
df = pd.DataFrame(data, columns=columns)

# Convert the Rings column to integer
df['Rings'] = df['Rings'].astype(int)

# Save to CSV with proper formatting
df.to_csv('abalone_final.csv', index=False)

print("Created properly formatted CSV file with comma separation: abalone_final.csv")
print(f"Dataset shape: {df.shape}")
print("\nFirst 5 rows:")
print(df.head())
