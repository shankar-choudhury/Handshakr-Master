"""
scrapercache test cases.
"""

import unittest
from scrapercache import cache

class CacheTestCase(unittest.TestCase):

    def test_lookup_miss(self):
        """
        Test that a lookup against a non-existent entry returns nothing.
        """
        cache.clear_cache()
        self.assertIsNone(cache.lookup('Jordan 1'))

    def test_lookup_hit(self):
        """
        Test cache hit.
        """
        cache.clear_cache()
        cache.add_to_cache('Bananas', '$100')
        self.assertIs(cache.lookup('Bananas'), '$100')

    def test_add_to_cache(self):
        """
        Test adding to cache.
        """
        cache.clear_cache()
        self.assertIsNone(cache.lookup('Apple'))
        cache.add_to_cache('Apple','$1')
        self.assertIs(cache.lookup('Apple'), '$1')

    def test_enumerate_cache(self):
        """
        Test enumerating the cache.
        """
        cache.clear_cache()
        self.assertDictEqual(cache.enumerate_cache(), dict())
        cache.add_to_cache('Pear', '$5')
        enum_cache = cache.enumerate_cache()
        self.assertIs(len(enum_cache), 1)
        self.assertIs(enum_cache['Pear'][1], '$5')

    def test_clear_cache(self):
        """
        Test clearing the cache.
        """
        cache.clear_cache()
        cache.add_to_cache('Kiwi', '$200')
        cache.clear_cache()
        self.assertDictEqual(cache.enumerate_cache(), dict())

if __name__ == '__main__':
    unittest.main()
