from setuptools import setup, find_packages

setup(
    name="etl_agents",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "pandas>=1.3.0",
        "numpy>=1.20.0",
        "matplotlib>=3.4.0",
        "seaborn>=0.11.0",
        "missingno>=0.5.0",
        "scikit-learn>=1.0.0",
        "statsmodels>=0.13.0",
        "pyyaml>=6.0",
        "python-dotenv>=0.19.0",
        "tqdm>=4.62.0",
        "loguru>=0.5.0",
    ],
    python_requires=">=3.8",
)
