"""scraperauthentication package - authentication.py

Authentication code to authenticate callers against API keys
Called by scraperserver package (server.py).

"""

import os
import random
import string
from requests import Request

bypass_authentication = False
token_file = os.path.expanduser("~/.scraper/tokens") # File containing our tokens, one per line
token_set = set() # Set that will hold the tokens for lookup


def create_token():
    """
    Creates a token in the format we use (Call if you need to make a new token).
    :return: Created token string.
    """
    return ''.join(random.SystemRandom().choice(string.ascii_letters + string.digits) for _ in range(100))


def initialize_if_needed():
    """
    Read the tokens from disk into the tokenSet.
    :return: None
    """
    global token_set
    if len(token_set) != 0:
        return
    with open(token_file) as f:
        tokens = f.readlines()
    tokens = [i.strip('\n') for i in tokens] # Remove trailing \n
    token_set = set(tokens)


def is_authorized_token(token):
    """
    Return true if this token signifies authorization; false otherwise
    :param token: Token to authenticate.
    :return: True if authenticated, false otherwise.
    """
    initialize_if_needed()
    return token in token_set


def is_authorized_request(request: Request ):
    """
    Return true if this Request from Python requests package is authorized, false otherwise
    :param request: requests from Requests python package.
    :return: True if authenticated, false otherwise.
    """
    global bypass_authentication
    if bypass_authentication:
        return True
    if not 'Authorization' in request.headers:
        return False
    return is_authorized_token(request.headers['Authorization'])


def add_test_token(token):
    """
    Adds a token to the global set for use in unit tests.
    :param token: Token to add.
    :return: None
    """
    global token_set
    token_set.add(token)
