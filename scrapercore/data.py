"""scrapercore package - data.py

Data cleaning and graphing.
Calls matplotlib, pandas, numpy.
Called by core.py (within this package).
"""

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import io

def scraper_result_to_data(item, result):
    """
    Converts an array of our auction result dictionaries and converts to a cleaned Pandas DataFrame.
    :param item: Item we searched for.
    :param result: Array of auction results dictionaries.
    :return: Pandas dataframe, cleaned.
    """
    result = add_similarity(item, result)
    df = pd.DataFrame(result)
    if df is None:
        return None
    df = clean_data(df)
    return df


def clean_data(df):
    """
    Filter out percentiles under 10 and over 90 (to remove outliers).
    :param df: DataFrame to clean.
    :return: Cleaned DataFrame.
    """
    lower_bound = df['price'].quantile(.05)
    upper_bound = df['price'].quantile(.95)
    df = df[(df['price'] >= lower_bound) & (df['price'] <= upper_bound)]
    # Filter out low similarity results (we want at least 75% of words from query in result)
    df = df[df['similarity'] >= 0.75]
    # Filter out dates before January 2025 for accurate pricing
    df['date'] = pd.to_datetime(df['date'])
    df = df[df['date'] >= '2025-01-01'].reset_index(drop=True)
    # Sort by date and set date as index
    df = df.sort_values(by='date')
    df = df.set_index('date')
    return df

def graph_individual_sales(df, data_title):
    """
    Generates a scatter plot of individual sales (date/price).
    :param df: DataFrame to graph.
    :param data_title: Graph title.
    :return: Image data.
    """
    plt.ioff()  # Disable interactive mode
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.yaxis.set_major_formatter(mtick.FormatStrFormatter('$%.2f'))
    plt.setp(ax.get_xticklabels(), rotation=30, horizontalalignment='right')
    plt.plot(df.index, df['price'], 'o')
    plt.xlabel('Sales Date')
    plt.ylabel('Price')
    plt.title(data_title + " - Auction Sales")
    return plot_to_buf(plt)


def graph_item_price_histogram(df, data_title):
    """
    Generates a histogram graph of price distribution
    :param df: DataFrame to graph.
    :param data_title: Graph title.
    :return: Image data.
    """
    plt.ioff()  # Disable interactive mode
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.xaxis.set_major_formatter(mtick.FormatStrFormatter('$%.2f'))
    plt.hist(df['price'])
    plt.xlabel('Price')
    plt.ylabel('Sales Count')
    plt.title(data_title + " - Price Distribution")
    return plot_to_buf(plt)


def graph_item_weekly_median_price(df, data_title):
    """
    Generates a graph of weekly median price moving average.
    :param df: DataFrame to graph.
    :param data_title: Graph title.
    :return: Image data.
    """
    df['Median'] = df['price'].rolling(window=pd.Timedelta("7 days")).median()
    plt.ioff()  # Disable interactive mode
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.yaxis.set_major_formatter(mtick.FormatStrFormatter('$%.2f'))
    plt.plot(df.index, df['Median'], label='Median', linestyle='--')
    plt.xlabel('Time')
    plt.ylabel('Price')
    plt.title(data_title + " - Median Price Per Week")
    plt.legend()
    plt.grid(True)
    return plot_to_buf(plt)


def plot_to_buf(plt):
    """
    Converts a plot to PNG format.
    :param plt: MatPlotLib plot.
    :return: PNG data.
    """
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    return buf


def price_stats(df):
    """
    Generate price statistics (median, mean, min, max).
    :param df: DataFrame of price data.
    :return: Dictionary of median, mean, min, max.
    """
    return {'median': df['price'].median(),
             'mean': df['price'].mean(),
             'min': df['price'].min(),
             'max': df['price'].max()}


def add_similarity(item, results):
    """
    Adds item string similarity of each result into our array of item dictionaries.
    :param item: Item name.
    :param results: Array of dictionaries.
    :return: Modified array of dictionaries.
    """
    for r in results:
        r['similarity'] = similarity(item, r['name'])
    return results


def similarity(s1, s2):
    """
    Calculate similarity between two strings by taking a percentage of common words.
    :param s1: First string to compare similarity.
    :param s2: Second string to compare similarity.
    :return: Similarity percentage.
    """
    set1 = make_set_from_string(s1)
    set2 = make_set_from_string(s2)
    return len(set1.intersection(set2)) / len(set1)


def make_set_from_string(s1):
    """
    Normalize a string into a set of lowercased words.
    :param s1: String to normalize into a set.
    :return: Set of common words, lowercased.
    """
    return set(s1.lower().split())
