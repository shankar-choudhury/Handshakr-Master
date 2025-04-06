# server.py
# scraperserver module
# Flask server to handle incoming http requests

from flask import Flask, jsonify, request, Response, abort, send_file
from scraperauthentication import authentication
from scrapercore import core
from io import BytesIO

app = Flask(__name__)
app.json_provider_class.compact = False

@app.route('/get-price/<item>')
def get_price(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    price_response = core.get_price(item)
    if price_response is None:
        abort(503) # Service Unavailable
    return jsonify(item, price_response)

@app.route('/get-items/<item>')
def get_items(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    items_response = core.get_items_info(item)
    if items_response is None:
        abort(503) # Service Unavailable
    return jsonify(item, items_response)

@app.route('/list-cache')
def list_cache():
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    cache_contents = core.list_cache()
    if cache_contents is None:
        abort(503) # Service Unavailable
    return jsonify('cache', cache_contents)

@app.route('/get-price-stats/<item>')
def get_price_stats(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    price_stats_response = core.get_price_stats(item)
    if price_stats_response is None:
        abort(503) # Service Unavailable
    return jsonify(item, price_stats_response)

@app.route('/graph-item-sales/<item>')
def graph_item_sales(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    image_data = core.graph_item_sales(item)
    if image_data is None:
        abort(503) # Service Unavailable
    return send_file(image_data, mimetype='image/png')

@app.route('/graph-item-price-histogram/<item>')
def graph_item_price_histogram(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    image_data = core.graph_item_price_histogram(item)
    if image_data is None:
        abort(503) # Service Unavailable
    return send_file(image_data, mimetype='image/png')

@app.route('/graph-item-weekly-median-price/<item>')
def graph_item_weekly_median_price(item):
    if not authentication.is_authorized_request(request):
        abort(401) # Unauthorized
    image_data = core.graph_item_weekly_median_price(item)
    if image_data is None:
        abort(503) # Service Unavailable
    return send_file(image_data, mimetype='image/png')

if __name__ == '__main__':
    app.run()