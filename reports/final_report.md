
# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:55:40

This report contains an automated exploratory data analysis of the dataset `sample_customer_data.csv`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---



## Basic Dataset Information

The dataset contains **50 rows** and **14 columns**. It includes 8 object columns, 3 int64 columns, 2 float64 columns, 1 bool columns.

```python
# Dataset Shape
df.shape
# Output: (50, 14)

# Data Types
df.dtypes.value_counts()
# Output: 
object     8
int64      3
float64    2
bool       1
```

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

```python
# Summary Statistics
df.describe().T
```

|                    |   count |     mean |       std |     min |     25% |     50% |     75% |     max |
|:-------------------|--------:|---------:|----------:|--------:|--------:|--------:|--------:|--------:|
| customer_id        |      50 | 1025.5   | 14.5774   | 1001    | 1013.25 | 1025.5  | 1037.75 | 1050    |
| age                |      50 |   35.2   |  6.21059  |   26    |   30    |   33.5  |   40.75 |   46    |
| monthly_spend      |      50 |   33.39  | 12.7151   |   19.99 |   19.99 |   29.99 |   49.99 |   49.99 |
| total_purchases    |      50 |    9.24  |  3.03423  |    5    |    7    |    9    |   11.75 |   16    |
| satisfaction_score |      50 |    4.258 |  0.348811 |    3.6  |    4    |    4.2  |    4.5  |    4.9  |

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.



## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```



## Numeric Data Analysis

The dataset contains **5 numeric columns**: `customer_id`, `age`, `monthly_spend`, `total_purchases`, `satisfaction_score`.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```

A correlation matrix heatmap visualization is included in the Visualizations section.



## Categorical Data Analysis

The dataset contains **9 categorical columns**: `first_name`, `last_name`, `gender`, `country`, `signup_date`, `subscription_type`, `active_status`, `last_purchase_date`, `referral_source`.

### Value Distributions

Below is a sample of value counts for categorical variables:

```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\n{col}:\n{df[col].value_counts().head(10)}")
```


#### first_name

```
first_name
John        1
Hannah      1
Victoria    1
Samuel      1
Grace       1
Nicholas    1
Chloe       1
Tyler       1
Zoe         1
Brandon     1
```

#### last_name

```
last_name
Smith       1
Hill        1
Lewis       1
Robinson    1
Walker      1
Young       1
Allen       1
King        1
Wright      1
Scott       1
```

#### gender

```
gender
Male      25
Female    25
```



## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```

### Pairplot

Pairplots show relationships between pairs of numeric features:

```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```

### Categorical Features

Bar charts show the distribution of categorical features:

```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```

# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:56:06

This report contains an automated exploratory data analysis of the dataset `sample_customer_data.csv`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---



## Basic Dataset Information

The dataset contains **50 rows** and **14 columns**. It includes 8 object columns, 3 int64 columns, 2 float64 columns, 1 bool columns.

```python
# Dataset Shape
df.shape
# Output: (50, 14)

# Data Types
df.dtypes.value_counts()
# Output: 
object     8
int64      3
float64    2
bool       1
```

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

```python
# Summary Statistics
df.describe().T
```

|                    |   count |     mean |       std |     min |     25% |     50% |     75% |     max |
|:-------------------|--------:|---------:|----------:|--------:|--------:|--------:|--------:|--------:|
| customer_id        |      50 | 1025.5   | 14.5774   | 1001    | 1013.25 | 1025.5  | 1037.75 | 1050    |
| age                |      50 |   35.2   |  6.21059  |   26    |   30    |   33.5  |   40.75 |   46    |
| monthly_spend      |      50 |   33.39  | 12.7151   |   19.99 |   19.99 |   29.99 |   49.99 |   49.99 |
| total_purchases    |      50 |    9.24  |  3.03423  |    5    |    7    |    9    |   11.75 |   16    |
| satisfaction_score |      50 |    4.258 |  0.348811 |    3.6  |    4    |    4.2  |    4.5  |    4.9  |

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.



## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```



## Numeric Data Analysis

The dataset contains **5 numeric columns**: `customer_id`, `age`, `monthly_spend`, `total_purchases`, `satisfaction_score`.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```

A correlation matrix heatmap visualization is included in the Visualizations section.



## Categorical Data Analysis

The dataset contains **9 categorical columns**: `first_name`, `last_name`, `gender`, `country`, `signup_date`, `subscription_type`, `active_status`, `last_purchase_date`, `referral_source`.

### Value Distributions

Below is a sample of value counts for categorical variables:

```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\n{col}:\n{df[col].value_counts().head(10)}")
```


#### first_name

```
first_name
John        1
Hannah      1
Victoria    1
Samuel      1
Grace       1
Nicholas    1
Chloe       1
Tyler       1
Zoe         1
Brandon     1
```

#### last_name

```
last_name
Smith       1
Hill        1
Lewis       1
Robinson    1
Walker      1
Young       1
Allen       1
King        1
Wright      1
Scott       1
```

#### gender

```
gender
Male      25
Female    25
```



## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```

### Pairplot

Pairplots show relationships between pairs of numeric features:

```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```

### Categorical Features

Bar charts show the distribution of categorical features:

```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```

# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:57:02

This report contains an automated exploratory data analysis of the dataset `sample_customer_data.csv`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---



## Basic Dataset Information

The dataset contains **50 rows** and **14 columns**. It includes 8 object columns, 3 int64 columns, 2 float64 columns, 1 bool columns.

```python
# Dataset Shape
df.shape
# Output: (50, 14)

# Data Types
df.dtypes.value_counts()
# Output: 
object     8
int64      3
float64    2
bool       1
```

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

```python
# Summary Statistics
df.describe().T
```

|                    |   count |     mean |       std |     min |     25% |     50% |     75% |     max |
|:-------------------|--------:|---------:|----------:|--------:|--------:|--------:|--------:|--------:|
| customer_id        |      50 | 1025.5   | 14.5774   | 1001    | 1013.25 | 1025.5  | 1037.75 | 1050    |
| age                |      50 |   35.2   |  6.21059  |   26    |   30    |   33.5  |   40.75 |   46    |
| monthly_spend      |      50 |   33.39  | 12.7151   |   19.99 |   19.99 |   29.99 |   49.99 |   49.99 |
| total_purchases    |      50 |    9.24  |  3.03423  |    5    |    7    |    9    |   11.75 |   16    |
| satisfaction_score |      50 |    4.258 |  0.348811 |    3.6  |    4    |    4.2  |    4.5  |    4.9  |

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.



## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```



## Numeric Data Analysis

The dataset contains **5 numeric columns**: `customer_id`, `age`, `monthly_spend`, `total_purchases`, `satisfaction_score`.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```

A correlation matrix heatmap visualization is included in the Visualizations section.



## Categorical Data Analysis

The dataset contains **9 categorical columns**: `first_name`, `last_name`, `gender`, `country`, `signup_date`, `subscription_type`, `active_status`, `last_purchase_date`, `referral_source`.

### Value Distributions

Below is a sample of value counts for categorical variables:

```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\n{col}:\n{df[col].value_counts().head(10)}")
```


#### first_name

```
first_name
John        1
Hannah      1
Victoria    1
Samuel      1
Grace       1
Nicholas    1
Chloe       1
Tyler       1
Zoe         1
Brandon     1
```

#### last_name

```
last_name
Smith       1
Hill        1
Lewis       1
Robinson    1
Walker      1
Young       1
Allen       1
King        1
Wright      1
Scott       1
```

#### gender

```
gender
Male      25
Female    25
```



## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```

### Pairplot

Pairplots show relationships between pairs of numeric features:

```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```

### Categorical Features

Bar charts show the distribution of categorical features:

```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```

# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:57:09

This report contains an automated exploratory data analysis of the dataset `sample_customer_data.csv`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---



## Basic Dataset Information

The dataset contains **50 rows** and **14 columns**. It includes 8 object columns, 3 int64 columns, 2 float64 columns, 1 bool columns.

```python
# Dataset Shape
df.shape
# Output: (50, 14)

# Data Types
df.dtypes.value_counts()
# Output: 
object     8
int64      3
float64    2
bool       1
```

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

```python
# Summary Statistics
df.describe().T
```

|                    |   count |     mean |       std |     min |     25% |     50% |     75% |     max |
|:-------------------|--------:|---------:|----------:|--------:|--------:|--------:|--------:|--------:|
| customer_id        |      50 | 1025.5   | 14.5774   | 1001    | 1013.25 | 1025.5  | 1037.75 | 1050    |
| age                |      50 |   35.2   |  6.21059  |   26    |   30    |   33.5  |   40.75 |   46    |
| monthly_spend      |      50 |   33.39  | 12.7151   |   19.99 |   19.99 |   29.99 |   49.99 |   49.99 |
| total_purchases    |      50 |    9.24  |  3.03423  |    5    |    7    |    9    |   11.75 |   16    |
| satisfaction_score |      50 |    4.258 |  0.348811 |    3.6  |    4    |    4.2  |    4.5  |    4.9  |

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.



## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```



## Numeric Data Analysis

The dataset contains **5 numeric columns**: `customer_id`, `age`, `monthly_spend`, `total_purchases`, `satisfaction_score`.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```

A correlation matrix heatmap visualization is included in the Visualizations section.



## Categorical Data Analysis

The dataset contains **9 categorical columns**: `first_name`, `last_name`, `gender`, `country`, `signup_date`, `subscription_type`, `active_status`, `last_purchase_date`, `referral_source`.

### Value Distributions

Below is a sample of value counts for categorical variables:

```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\n{col}:\n{df[col].value_counts().head(10)}")
```


#### first_name

```
first_name
John        1
Hannah      1
Victoria    1
Samuel      1
Grace       1
Nicholas    1
Chloe       1
Tyler       1
Zoe         1
Brandon     1
```

#### last_name

```
last_name
Smith       1
Hill        1
Lewis       1
Robinson    1
Walker      1
Young       1
Allen       1
King        1
Wright      1
Scott       1
```

#### gender

```
gender
Male      25
Female    25
```



## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```

### Pairplot

Pairplots show relationships between pairs of numeric features:

```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```

### Categorical Features

Bar charts show the distribution of categorical features:

```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```

# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:57:26

This report contains an automated exploratory data analysis of the dataset `sample_customer_data.csv`.
The analysis includes basic statistics, missing value analysis, correlation studies,
and various visualizations to help understand the data structure and relationships.

---



## Basic Dataset Information

The dataset contains **50 rows** and **14 columns**. It includes 8 object columns, 3 int64 columns, 2 float64 columns, 1 bool columns.

```python
# Dataset Shape
df.shape
# Output: (50, 14)

# Data Types
df.dtypes.value_counts()
# Output: 
object     8
int64      3
float64    2
bool       1
```

### Summary Statistics

The table below shows summary statistics for numeric columns in the dataset:

```python
# Summary Statistics
df.describe().T
```

|                    |   count |     mean |       std |     min |     25% |     50% |     75% |     max |
|:-------------------|--------:|---------:|----------:|--------:|--------:|--------:|--------:|--------:|
| customer_id        |      50 | 1025.5   | 14.5774   | 1001    | 1013.25 | 1025.5  | 1037.75 | 1050    |
| age                |      50 |   35.2   |  6.21059  |   26    |   30    |   33.5  |   40.75 |   46    |
| monthly_spend      |      50 |   33.39  | 12.7151   |   19.99 |   19.99 |   29.99 |   49.99 |   49.99 |
| total_purchases    |      50 |    9.24  |  3.03423  |    5    |    7    |    9    |   11.75 |   16    |
| satisfaction_score |      50 |    4.258 |  0.348811 |    3.6  |    4    |    4.2  |    4.5  |    4.9  |

The summary statistics provide insights into the central tendency, dispersion, and shape of the dataset's distribution.



## Missing Values Analysis

The dataset does not contain any missing values, which is ideal for analysis. No data preprocessing for missing values is required.

```python
# Missing Values Analysis
df.isnull().sum().sum()
# Output: 0
```



## Numeric Data Analysis

The dataset contains **5 numeric columns**: `customer_id`, `age`, `monthly_spend`, `total_purchases`, `satisfaction_score`.

### Correlation Analysis

Correlation analysis helps identify relationships between numeric variables:

```python
# Correlation Analysis for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
correlation_matrix = numeric_df.corr()
```

A correlation matrix heatmap visualization is included in the Visualizations section.



## Categorical Data Analysis

The dataset contains **9 categorical columns**: `first_name`, `last_name`, `gender`, `country`, `signup_date`, `subscription_type`, `active_status`, `last_purchase_date`, `referral_source`.

### Value Distributions

Below is a sample of value counts for categorical variables:

```python
# Value Counts for Categorical Features
for col in df.select_dtypes(include=['object', 'category', 'bool']).columns:
    print(f"\n{col}:\n{df[col].value_counts().head(10)}")
```


#### first_name

```
first_name
John        1
Hannah      1
Victoria    1
Samuel      1
Grace       1
Nicholas    1
Chloe       1
Tyler       1
Zoe         1
Brandon     1
```

#### last_name

```
last_name
Smith       1
Hill        1
Lewis       1
Robinson    1
Walker      1
Young       1
Allen       1
King        1
Wright      1
Scott       1
```

#### gender

```
gender
Male      25
Female    25
```



## Visualizations

This section contains various visualizations to help understand the data distribution and relationships.

### Missing Values Visualization

The matrix below shows the pattern of missing values in the dataset:

```python
# Missing Values Visualization
plt.figure(figsize=(10, 6))
msno.matrix(df)
plt.title('Missing Values Matrix')
plt.tight_layout()
```

### Distribution of Numeric Features

Histograms show the distribution of each numeric feature:

```python
# Histograms for Numeric Features
numeric_df = df.select_dtypes(include=['int64', 'float64'])
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    numeric_df.hist(bins=20, figsize=(12, 10), grid=False)
    plt.tight_layout()
    plt.suptitle('Histograms of Numeric Features', y=1.02, fontsize=16)
```

### Correlation Heatmap

The heatmap below shows correlations between numeric features:

```python
# Correlation Heatmap
if len(numeric_df.columns) > 1:
    plt.figure(figsize=(10, 8))
    mask = np.triu(np.ones_like(numeric_df.corr()))
    sns.heatmap(numeric_df.corr(), annot=True, mask=mask, cmap='coolwarm', 
                linewidths=0.5, vmin=-1, vmax=1)
    plt.title('Correlation Heatmap')
    plt.tight_layout()
```

### Boxplots

Boxplots help identify outliers and understand the distribution of numeric features:

```python
# Boxplots for Numeric Features
if not numeric_df.empty:
    plt.figure(figsize=(12, 10))
    for i, col in enumerate(numeric_df.columns[:9], 1):  # Limit to 9 columns for readability
        plt.subplot(3, 3, i)
        sns.boxplot(y=df[col])
        plt.title(f'Boxplot of {col}')
    plt.tight_layout()
```

### Pairplot

Pairplots show relationships between pairs of numeric features:

```python
# Pairplot for Numeric Features (limited to 5 for readability)
if len(numeric_df.columns) > 1:
    sample_numeric = numeric_df.sample(min(1000, len(numeric_df)))  # Sample for performance
    sns.pairplot(sample_numeric[sample_numeric.columns[:5]], diag_kind='kde')
    plt.suptitle('Pairplot of Numeric Features', y=1.02, fontsize=16)
```

### Categorical Features

Bar charts show the distribution of categorical features:

```python
# Bar Charts for Categorical Features
categorical_df = df.select_dtypes(include=['object', 'category', 'bool'])
if not categorical_df.empty:
    for col in categorical_df.columns[:5]:  # Limit to 5 columns for readability
        plt.figure(figsize=(10, 6))
        value_counts = categorical_df[col].value_counts().head(10)  # Top 10 categories
        sns.barplot(x=value_counts.index, y=value_counts.values)
        plt.title(f'Top 10 Categories in {col}')
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
```


# Machine Learning Model Training Report: abalone.csv

**Generated on:** 2025-04-20 21:04:21

This report contains the results of training and evaluating machine learning models on the dataset `abalone.csv`.
The models were trained to predict the target variable `Rings` using supervised learning techniques.

---

## Model Training Overview

### Dataset Information
- **Target Variable:** `Rings`
- **Features Used:** `Length`, `Diameter`, `Height`, `Whole_weight`, `Shucked_weight`, `Viscera_weight`, `Shell_weight`, `Sex_I`, `Sex_M`
- **Training/Testing Split:** 80% training, 20% testing (random seed: 42)

### Preprocessing Steps
- Automatic handling of categorical variables using one-hot encoding
- Standard scaling applied to features for models that benefit from it
- Missing values were not explicitly handled (ensure data is clean before modeling)

### Hyperparameter Tuning
- **Tuning Method:** Grid Search (GridSearchCV)
- **Models Tuned:** 8 out of 9

### Models Trained
1. **Linear Regression** - A parametric approach that models linear relationships
2. **Ridge Regression** - Linear regression with L2 regularization
3. **Lasso Regression** - Linear regression with L1 regularization
4. **ElasticNet** - Linear regression with both L1 and L2 regularization
5. **K-Nearest Neighbors** - Non-parametric approach using k=7 nearest samples
6. **Decision Tree** - Tree-based model that recursively splits the data
7. **Random Forest** - Ensemble of decision trees (100 estimators)
8. **Gradient Boosting** - Sequential ensemble of decision trees (100 estimators)
9. **Support Vector Regressor** - Kernel-based approach for non-linear relationships


## Model Performance

The table below shows the performance metrics for each model on the test set, sorted by RMSE:

| Model            |   RMSE |    MAE |     R² |   Training Time (s) |
|:-----------------|-------:|-------:|-------:|--------------------:|
| SVR              | 2.1754 | 1.4892 | 0.5628 |              5.1387 |
| Ridge            | 2.2116 | 1.5939 | 0.5482 |              0.0364 |
| LinearRegression | 2.2116 | 1.5931 | 0.5482 |              0.0008 |
| ElasticNet       | 2.2118 | 1.5939 | 0.5481 |              0.1322 |
| Lasso            | 2.2118 | 1.5938 | 0.5481 |              0.0902 |
| KNN              | 2.2125 | 1.5122 | 0.5478 |              0.1560 |
| RandomForest     | 2.2181 | 1.5503 | 0.5455 |             20.0591 |
| GradientBoosting | 2.2465 | 1.5716 | 0.5338 |             26.6019 |
| DecisionTree     | 2.3164 | 1.6258 | 0.5043 |              2.3494 |

### Metrics Explanation
- **RMSE (Root Mean Squared Error):** Square root of the average squared differences between predicted and actual values (lower is better)
- **MAE (Mean Absolute Error):** Average of absolute differences between predicted and actual values (lower is better)
- **R² (Coefficient of Determination):** Proportion of variance in the target that is predictable from the features (higher is better, 1.0 is perfect prediction)

## Sample Predictions

Below are sample predictions from the top 3 performing models compared to the actual values:

|   Actual |   SVR Prediction |   SVR Error |   Ridge Prediction |   Ridge Error |   LinearRegression Prediction |   LinearRegression Error |
|---------:|-----------------:|------------:|-------------------:|--------------:|------------------------------:|-------------------------:|
|   9.0000 |          11.4273 |      2.4273 |            11.7675 |        2.7675 |                       11.7614 |                   2.7614 |
|   8.0000 |           9.5124 |      1.5124 |            10.2547 |        2.2547 |                       10.2419 |                   2.2419 |
|  16.0000 |          14.4146 |      1.5854 |            13.9787 |        2.0213 |                       14.0010 |                   1.9990 |
|   9.0000 |          10.9794 |      1.9794 |            11.9991 |        2.9991 |                       11.9951 |                   2.9951 |
|  14.0000 |          11.7702 |      2.2298 |            11.1518 |        2.8482 |                       11.1614 |                   2.8386 |

## Visualizations

Visualizations for model performance have been generated and saved to the `reports/visuals/` directory. These include:

1. **Actual vs. Predicted Plots** - Scatter plots showing the relationship between actual and predicted values
2. **Residual Plots** - Visualizations of prediction errors to assess model assumptions
3. **Learning Curves** - Plots showing how model performance evolves with increasing training data size

### Learning Curve Analysis

Learning curves help detect underfitting, overfitting, and variance issues by showing how model performance changes with training set size. For the top models:

- **SVR**: Underfitting
  - The model is too simple to capture the underlying patterns
  - Consider using a more complex model or adding more features

- **Ridge**: Underfitting
  - The model is too simple to capture the underlying patterns
  - Consider using a more complex model or adding more features

Learning curve visualizations can be found in the `reports/visuals/learning_curves/` directory.

## Model Recommendation

Based on the performance metrics, the **{self.best_model['name']}** model is recommended for this dataset.

The complete model leaderboard and detailed recommendation can be found in:
- `reports/model_leaderboard.csv` - CSV file with all model metrics
- `reports/model_recommendation.md` - Detailed recommendation with justification

## Next Steps
- Consider {"further " if include_tuning_info else ""}hyperparameter tuning to improve model performance
- Evaluate the best model on new data to ensure generalizability
- Consider feature engineering to potentially improve performance
- For production deployment, retrain the model on the full dataset

---
