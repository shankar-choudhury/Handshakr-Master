"""
scraperauthentication test cases
"""

import unittest

from scraperauthentication import authentication
from requests import Request

class AuthenticationTestCase(unittest.TestCase):
    def test_create_token(self):
        """
        Test creating a token.
        """
        token = authentication.create_token()
        self.assertIs(100, len(token))  # tokens should be 100 chars long
        self.assertTrue(token.isalnum())  # tokens should be alphanumeric only

    def test_is_authorized_token_false(self):
        """
        Test that authorization against a bogus token fails.
        """
        test_token = authentication.create_token()
        self.assertFalse(authentication.is_authorized_token(test_token))

    def test_is_authorized_token_true(self):
        """
        Test that authorization against a valid token passes.
        """
        test_token = 'Sce1zmFYtuOlhTDzoWg0CS8zklMmcH7Q1oMekZp7yS6Wp9NpzYujvwCx7WsT1BybCajdkErjSZPl0AqnUzeRzDpXqMVseA4UkwCz'
        authentication.add_test_token(test_token)
        self.assertTrue(authentication.is_authorized_token(test_token))

    def test_is_authorized_request_false(self):
        """
        Test that authorization against a bogus request fails.
        """
        test_token = authentication.create_token()
        test_request = Request()
        test_request.headers['Authorization'] = test_token
        self.assertFalse(authentication.is_authorized_request(test_request))

    def test_is_authorized_request(self):
        """
        Test that authorization against a valid request passes.
        """
        test_token = 'Sce1zmFYtuOlhTDzoWg0CS8zklMmcH7Q1oMekZp7yS6Wp9NpzYujvwCx7WsT1BybCajdkErjSZPl0AqnUzeRzDpXqMVseA4UkwCz'
        authentication.add_test_token(test_token)
        test_request = Request()
        test_request.headers['Authorization'] = test_token
        self.assertTrue(authentication.is_authorized_request(test_request))


if __name__ == '__main__':
    unittest.main()
