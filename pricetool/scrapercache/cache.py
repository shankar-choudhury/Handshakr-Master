"""scrapercache package - cache.py

Our initial implementation is a simple Python in-memory dictionary.
To scale this, we would replace with a NoSQL key/value store database like Redis.
"""

import datetime

expiration_interval = datetime.timedelta(days=1)
cache_dict = dict()


def lookup(query):
    """
    See if the cache contains 'query' request. If entry exists but was expired, it is removed.
    :param query: Query to look up.
    :return: Cached data or None if cache miss.
    """
    global cache_dict
    if query in cache_dict:
        entry = cache_dict[query]
        # Make sure this cache entry hasn't expired
        # (first part of tuple is the cached date)
        if entry[0] + expiration_interval > datetime.datetime.now():
            # Return the cached entry
            return cache_dict[query][1] # second part of tuple is the cached value
        else:
            # Remove the expired entry
            del cache_dict[query]
    return None


def add_to_cache(query, value):
    """
    Add an entry to the cache. Overwrite any existing entry
    :param query: Query to use as our caching key.
    :param value: Data to cache.
    :return: None
    """
    global cache_dict
    entry = (datetime.datetime.now(), value)
    cache_dict[query] = entry


def enumerate_cache():
    """
    Return the cache contents for debugging/diagnosis.
    :return: Cache contents as a dictionary.
    """
    # Just return the underlying dictionary itself
    global cache_dict
    return cache_dict


def clear_cache():
    """
    Clear the cache.
    :return: None
    """
    global cache_dict
    cache_dict.clear()
