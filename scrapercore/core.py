# core.py
# scrapercore module
# Core scraper functionality

import requests
from ebayscraper import ebay
from scrapercache import cache
from scrapercore import data

def get_price_page(item, page_number):
    #Map the item name into an EBay URL
    ebay_url = ebay.make_ebay_url(item, page_number)
    if ebay_url is None:
        return None

    #Make the http request to the 3rd party server
    response = requests.get(ebay_url)
    #If we got an error back or no response at all, exit
    if response is None:
        return None
    if response.status_code != 200:
        return None
    return ebay.parse_ebay_page_and_extract_prices(response.text)


def get_items_page(item, page_number):
    #Map the item name into an EBay URL
    ebay_url = ebay.make_ebay_url(item, page_number)
    if ebay_url is None:
        return None

    #Make the http request to the 3rd party server
    response = requests.get(ebay_url)
    #If we got an error back or no response at all, exit
    if response is None:
        return None
    if response.status_code != 200:
        return None
    return ebay.parse_ebay_page_and_extract_items(response.text)


def get_items_info(item):
    #First lookup in the cache
    cached_response = cache.lookup(item)
    if not cached_response is None:
        return cached_response

    #Loop until we've fetched 1000 items or run out of items
    ebay_scraper_items = []
    page = 1
    while len(ebay_scraper_items) < 1000:
        page_items = get_items_page(item, page)
        if page_items is None:
            break
        if len(page_items) == 0:
            break
        print(page)
        page += 1
        ebay_scraper_items += page_items
    del ebay_scraper_items[1000:]

    #Cache the result for next time
    cache.add_to_cache(item, ebay_scraper_items)

    #And return the response to we can send it back to the caller
    return ebay_scraper_items


def get_price(item):
    items = get_items_info(item)
    return [d['price'] for d in items if 'price' in d]


def list_cache():
    return cache.enumerate_cache()


def get_price_stats(item):
    ebay_scraper_items = get_items_info(item)
    if ebay_scraper_items is None:
        return None
    ebay_data = data.scraper_result_to_data(ebay_scraper_items)
    return data.price_stats(ebay_data)

def graph_item_sales(item):
    ebay_scraper_items = get_items_info(item)
    if ebay_scraper_items is None:
        return None
    ebay_data = data.scraper_result_to_data(ebay_scraper_items)
    return data.graph_individual_sales(ebay_data, item)

def graph_item_price_histogram(item):
    ebay_scraper_items = get_items_info(item)
    if ebay_scraper_items is None:
        return None
    ebay_data = data.scraper_result_to_data(ebay_scraper_items)
    return data.graph_item_price_histogram(ebay_data, item)

def graph_item_price_histogram(item):
    ebay_scraper_items = get_items_info(item)
    if ebay_scraper_items is None:
        return None
    ebay_data = data.scraper_result_to_data(ebay_scraper_items)
    return data.graph_item_price_histogram(ebay_data, item)

def graph_item_weekly_median_price(item):
    ebay_scraper_items = get_items_info(item)
    if ebay_scraper_items is None:
        return None
    ebay_data = data.scraper_result_to_data(ebay_scraper_items)
    return data.graph_item_weekly_median_price(ebay_data, item)
