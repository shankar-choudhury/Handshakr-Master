# data.py
# scrapercore module
# Data cleaning and graphing

import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg') #non-interactive plotting backend
import matplotlib.pyplot as plt
import matplotlib.ticker as mtick
import io

def scraper_result_to_data(result):
    df = pd.DataFrame(result)
    if df is None:
        return None
    df = clean_data(df)
    return df

def clean_data(df):
    # Filter out percentiles under 10 and over 90 (to remove outliers)
    lower_bound = df['price'].quantile(.10)
    upper_bound = df['price'].quantile(.90)
    df = df[(df['price'] >= lower_bound) & (df['price'] <= upper_bound)]
    # Filter out dates before January 2025 for accurate pricing
    df['date'] = pd.to_datetime(df['date'])
    df = df[df['date'] >= '2025-01-01'].reset_index(drop=True)
    # Sort by date and set date as index
    df = df.sort_values(by='date')
    df = df.set_index('date')
    return df

def graph_individual_sales(df, data_title):
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
    plt.ioff()  # Disable interactive mode
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.xaxis.set_major_formatter(mtick.FormatStrFormatter('$%.2f'))
    plt.hist(df['price'])
    plt.xlabel('Price')
    plt.ylabel('Sales Count')
    plt.title(data_title + " - Price Distribution")
    return plot_to_buf(plt)

def graph_item_weekly_median_price(df, data_title):
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
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    buf.seek(0)
    return buf

def price_stats(df):
    return {'median': df['price'].median(),
             'mean': df['price'].mean(),
             'min': df['price'].min(),
             'max': df['price'].max()}
