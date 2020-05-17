# import couchdb
# from tweepy import Cursor
# import json
# import numpy
# import pandas
# from couchdb import Server
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# from shapely.geometry import Point, MultiPolygon
# from shapely.geometry.polygon import Polygon
#
# server = Server('http://admin:password@172.26.131.49:5984//')
# gov_data_db = server['gov_geo_data']
#
#
# def load_states_polygons():
#     data = gov_data_db['AU_States_Polygons']['doc']
#     states = {}
#     for key in data:
#         states[key] = MultiPolygon(data[key])
#     return states
#
#
# states_polygons = load_states_polygons()
#
#
# def find_state(point):
#     for state in states_polygons:
#         for polygon in states_polygons[state]:
#             if polygon.contains(point):
#                 return state
#     return None
#
#
# state = find_state(Point(115.859, -31.9522))
# print(state)
