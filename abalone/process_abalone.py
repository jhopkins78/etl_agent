#!/usr/bin/env python3
"""
Process the abalone dataset to create a properly formatted CSV file.
"""

import pandas as pd
import re

# Define the column names
columns = ["Sex", "Length", "Diameter", "Height", "Whole_weight", "Shucked_weight", "Viscera_weight", "Shell_weight", "Rings"]

# Read the raw data file
with open('abalone.data', 'r') as f:
    lines = f.readlines()

# Process each line
data = []
for line in lines:
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
df.to_csv('abalone.csv', index=False)

print("Created properly formatted CSV file: abalone.csv")
print(f"Dataset shape: {df.shape}")
print("\nFirst 5 rows:")
print(df.head())
