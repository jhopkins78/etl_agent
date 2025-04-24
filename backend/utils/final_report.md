
# Exploratory Data Analysis Report: sample_customer_data.csv

**Generated on:** 2025-04-19 21:54:29

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
