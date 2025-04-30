"""
scrapercore test cases.
"""

import unittest
from scrapercore import core

class CoreTests(unittest.TestCase):

    def test_get_items_info(self):
        """
        Fairly comprehensive live-test of an EBay auction result query.
        Non-deterministic result, so we compare number of results returned
        instead of looking for an exact result.
        """
        self.assertTrue(len(core.get_items_info("Jordan 1")) > 500)

    def test_graph_item_sales(self):
        """
        Test same auction result to make sure we can generate a PNG.
        Just test for data > 4096 bytes in length since the actual data
        is non-deterministic.
        """
        self.assertTrue(core.graph_item_sales("Jordan 1").getbuffer().nbytes > 4096)

if __name__ == '__main__':
    unittest.main()
