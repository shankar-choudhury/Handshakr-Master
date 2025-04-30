"""
scraperserver test cases
"""

import unittest
from scraperauthentication import authentication
from scraperserver import server
from scrapercache import cache
from flask import Flask

app = Flask(__name__)

class ServerTests(unittest.TestCase):

    def test_list_cache(self):
        """
        list_cache test case
        :return:
        """
        authentication.bypass_authentication = True
        with app.app_context():
            cache.clear_cache()
            self.assertEqual(server.list_cache().get_data(as_text=True), '[\n  "cache",\n  {}\n]\n')

if __name__ == '__main__':
    unittest.main()
