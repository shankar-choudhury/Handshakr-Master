"""
ebayscraper test cases.
"""

import unittest

from ebayscraper import ebay

sample_price_html = '<span class=s-item__price><!--F#f_0--><!--F#f_0-->$0.01<!--F/--><!--F/--></span><span class=s-item__price><!--F#f_0--><!--F#f_0-->$0.01<!--F/--><!--F/--></span><span class=s-item__price><!--F#f_0--><!--F#f_0-->$1.23<!--F/--><!--F/--></span><span class=s-item__price><!--F#f_0--><!--F#f_0-->$4.56<!--F/--><!--F/--></span><span class=s-item__price><!--F#f_0--><!--F#f_0-->$7.89<!--F/--><!--F/--></span>'

class EBayScraperTestCase(unittest.TestCase):

    def test_parse_ebay_page_and_extract_prices(self):
        """
        Test extracting prices from an auction HTML page works.
        """
        self.assertEqual(ebay.parse_ebay_page_and_extract_prices(sample_price_html), [1.23, 4.56, 7.89])

    def test_parse_price(self):
        """
        Test underlying price extractor.
        """
        self.assertEqual(ebay.parse_price("$1.23"), 1.23)

if __name__ == '__main__':
    unittest.main()
