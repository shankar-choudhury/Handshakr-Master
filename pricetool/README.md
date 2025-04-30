# Handshakr PriceTool

## Introduction

The PriceTool component of Handshakr is a REST microservice exposing an API used by the Handshakr server to let users determine the best price to buy or sell their item for.

V1 of PriceTool consults EBay completed sales as its source of comparative price data. Up to 1000 of the most recent sales for a given query are fetched from EBay. The data is cleaned to filter outliers and SEO-inserted results from EBay that don't match the search query with enough confidence to include in our analysis.

PriceTool can return raw results, summary data (median, mean, min, max), details on each sale (item description, sale date, item condition, price), and even PNG graphs analyzing prices for an item.

## Configuration

The REST endpoint is protected via API keys, stored in a configuration file stored in ~/.scraper/tokens

It is intended to be run as a back-end service via http accessed by other Handshakr server components.

Queries are cached for 24 hours so repeated queries for the same item (even across different APIs) will return extremely quickly.

## Architecture

PriceTool is built using Python, and uses Flask, Requests, BeautifulSoup4, NumPy, Pandas, and MatPlotLib.

PriceTool is structured into packages each with their own unit tests: ebayscraper, scraperauthentication, scrapercache, scrapercore, scraperserver.

### Code Layout

* ebayscraper
    * ebay.py
* scraperauthentication
    * authentication.py
* scrapercache
    * cache.py
* scrapercore
    * core.py
    * data.py
* scraperserver
    * server.py
* UnitTest
    * testauthentication.py
    * testcache.py
    * testcore.py
    * testebayscraper.py
    * testserver.py
* Examples
    * tokens
    * scrape.sh

## Areas for improvement:
- Expand sites queried for comparative prices to include Google Shopping and similar services
- License official EBay API to prevent scraping from potentially being blocked by EBay
- Consider consulting an LLM for comparative price information


## PriceTool APIs:

```
/get-price/{item}
```
Gets an array of prices for a given item, up to 1000 results.

```
/get-items/{item}
```
Gets an array of item details (description, date, condition, price), up to 1000 results.

```
/get-price-stats/{item}
```
Returns the median, mean, min, max prices for an item

```
/graph-item-sales/{item}
```
Returns a scatter plot PNG image of each recent sale (date, price) for up to 1000 most recent sales.

```
/graph-item-price-histogram/{item}
```
Returns a histogram PNG image of price distribution for an item.

```
/graph-item-weekly-median-price/{item}
```
Returns a plot of the weekly moving median price for an item as a PNG image.

```
/list-cache
```
Returns the contents of the cache for debugging purposes.


## Local setup for testing/development (if not using hosted installation)

- Copy API keys file "tokens" from repository
```
cp tokens ~/.scraper/tokens
```
- Create a Python venv or use a compatible system-installed version of Python 3.x
- Install required python packages listed in requirements.txt:
```
pip install -r requirements.txt
```
- Start Flask server:
```
export FLASK_APP=scraperserver/server.py
flask run
```

Sample commands if server is run locally on port 5000:

1) list the cache (should be empty)
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/list-cache
```

2) look up a couple of prices
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/get-price/charizard%20card

curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/get-price/ohtani%20rookie%20card%20bowman
```

3) list the cache again
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/list-cache
```

4) get-items
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/get-items/charizard%20card

curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/get-items/ohtani%20rookie%20card%20bowman
```

5) Graphing commands
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/graph-item-sales/jackson%20merrill%20rookie%20card%20signed -o prices.png

curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/graph-item-price-histogram/jackson%20merrill%20rookie%20card%20signed -o prices2.png

curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/graph-item-weekly-median-price/jackson%20merrill%20rookie%20card%20signed -o prices3.png
```

6) Price stats
```
curl --header "Authorization:ijjFPzTJdJHwpM5gHa6mpEJD94e0z3suy1iTFgWyBA3m8HWuCdhKrSxTVhuZ2TcrwPgrEomxqmLKHoeYylBKi7PimayQa5tMQ3cU" http://127.0.0.1:5000/get-price-stats/jackson%20merrill%20rookie%20card%20signed
```

A bash script is also provided for easier testing:
```
./scrape.sh get-items "Charizard EX SV03"
./scrape.sh get-price-stats "Charizard EX SV03"
./scrape.sh graph-item-sales "Charizard EX SV03"
./scrape.sh graph-item-price-histogram "Charizard EX SV03"
./scrape.sh graph-item-weekly-median-price "Charizard EX SV03"
```
