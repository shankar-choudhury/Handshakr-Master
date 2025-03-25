# ebay.py
# ebayscraper module
# EBay scraper functionality

from bs4 import BeautifulSoup
from dateutil import parser

def make_ebay_url(item, page_number):
    if item is None:
        return None
    if not item:
        return None
    if page_number is None:
        page_number = 1
    # Use an f-string (formatted string literal) to
    # insert the item into the EBay URL
    return f'https://www.ebay.com/sch/i.html?_nkw={item}&LH_Complete=1&_ipg=240&_pgn={page_number}'


def parse_ebay_page_and_extract_prices(html_source):
    soup = BeautifulSoup(html_source, "html.parser")
    price_spans = soup.find_all("span", class_="s-item__price")
    prices = []
    i = 0
    for span in price_spans:
        if i > 1: # The first two prices on each scraped page appear invalid. Skip them
            # First we strip the currency symbol ($)
            price_string = span.text.strip('$')
            try:
                # Now try converting what's left to a floating point number
                price_number = float(price_string)
                prices.append(price_number)
            except ValueError:
                pass  # Ignore errors (skip over these)
        i += 1
    return prices


def parse_price(price_string):
    # First we strip the currency symbol ($)
    price_string = price_string.strip('$')
    try:
        # Now try converting what's left to a floating point number
        price_number = float(price_string)
        return price_number
    except ValueError:
        return None


def parse_ebay_page_and_extract_items(html_source):
    items = []
    i = 0
    soup = BeautifulSoup(html_source, "html.parser")
    item_divs = soup.find_all("div", class_="s-item__wrapper")
    for div in item_divs:
        item = {}
        if i > 1: # The first two prices on each scraped page appear invalid. Skip them
            sold_info = div.find_all("span", class_="POSITIVE")
            if len(sold_info) > 0:
                date_string = sold_info[0].text.removeprefix("Sold  ")
                try:
                    item['date'] = parser.parse(date_string)
                except:
                    continue #Skip items with unparseable date
                price_string = sold_info[1].text
                item['price'] = parse_price(price_string)
                if item['price'] is None:
                    continue #Skip items without a price
            item['name'] = div.find("div", class_="s-item__title").text
            secondary_info = div.find("span", class_="SECONDARY_INFO")
            if secondary_info is not None:
                item['condition'] = secondary_info.text
            if 'name' in item and 'price' in item and 'date' in item and 'condition' in item:
                items.append(item)
        i += 1
    return items
