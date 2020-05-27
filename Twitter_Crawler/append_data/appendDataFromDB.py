"""
@author: Team18(member details are as follows)

Name(Firstname Surname)	|	Username	|	StudentID	|	City
---------------------------------------------------------------------
Chuang Wang             |   chuangw     |   791793      | Melbourne
Honglong Zhang          |   honglongz   |   985262      | Melbourne
Jingyi Li               |   jili        |   961543      | Melbourne
Wei Lin                 |   wlin8       |   885536      | Melbourne
Yangyang Hu             |   Yangyangh1  |   978954      | Melbourne
"""
# from couchdb import Server
# from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
# from shapely.geometry import Point
# from shapely.geometry.polygon import Polygon
#
# server = Server('http://admin:password@172.26.131.49:5984//')
# from_db = server['test_chuangw']
# to_db = server['test_chuangw_du']
# gov_data_db = server['gov_geo_data']
#
# sentiment_analyser = SentimentIntensityAnalyzer()
#
#
# #######################################################################################################################
# #                     given a coordinate, identify the suburb (in VIC state only)
# #######################################################################################################################
#
#
# def get_all_suburbs():
#     data = gov_data_db['VIC_Local_Gov_Area']
#     result = {}
#     for feature in data['features']:
#         if feature.get('geometry'):
#             suburb = feature['properties']['vic_lga__3'].lower()
#             result[suburb] = feature['geometry']['coordinates'][0][0]
#     return result
#
#
# allSuburbs = get_all_suburbs()
#
#
# def find_suburb(point):
#     # allSuburbs: dictionary "suburb":boundaries
#     # print('Length : %d' % len(allSuburbs))
#     # print(allSuburbs.keys())
#     for sub in allSuburbs:
#         boundaries = []
#         for coordinates in allSuburbs[sub]:
#             boundaries.append((coordinates[0], coordinates[1]))
#         polygon = Polygon(boundaries)
#         if polygon.contains(point):
#             return sub
#     return None
#
#
# #######################################################################################################################
# #                     given a coordinate, identify the state
# #######################################################################################################################
#
# def generate_allPolygons(coords):
#     polygons = []
#     for coord in coords:
#         points = []
#         for c in coord:
#             for i in c:
#                 if isinstance(i, list):
#                     points.append((i[0], i[1]))
#         polygons.append(Polygon(points))
#     return polygons
#
#
# def get_all_states():
#     data = gov_data_db['AU_States_Geo_Data']
#     all_states = {}
#     for feature in data['features']:
#         state = feature['properties']['STATE_NAME']
#         polygons = generate_allPolygons(feature['geometry']['coordinates'])
#         all_states[state] = polygons
#     return all_states
#
#
# all_states = get_all_states()
#
#
# def find_state(point):
#     # all_states: dictionary "state":multi polygons
#     # print('Length : %d' % len(all_states))
#     for state in all_states:
#         polygons = all_states[state]
#         for polygon in polygons:
#             if polygon.contains(point):
#                 return state
#     return None
#
#
# print(find_state(Point(115.10287, -33.85094)))
#
#
# #######################################################################################################################
# #                     Helper function for add_to_new_db
# #######################################################################################################################
# def append_data(db_doc):
#     tweet = db_doc['doc']
#     # tweet data
#     tweet_txt = tweet['Tweets']
#     tweet_time = tweet['Time'].replace('T', '-').split('-')
#     tweet_coord = tweet['Coordinates']['coordinates']
#     tweet_point = Point(tweet_coord[0], tweet_coord[1])
#
#     # add date to doc
#     tweet_date = dict(year=int(tweet_time[0]), month=int(tweet_time[1]), day=int(tweet_time[2]))
#     tweet_emotion = get_emotion_val(tweet_txt)
#     tweet_suburb = find_suburb(tweet_point)
#     tweet_state = find_state(tweet_point)
#
#     # append data to tweet doc
#     tweet.update(date=tweet_date, state=tweet_state, suburb=tweet_suburb, emotion=tweet_emotion)
#
#     # add _id to the document
#     result = dict(_id=db_doc['_id'], doc=tweet)
#
#     return result
#
#
# def get_emotion_val(sentence):
#     snt = sentiment_analyser.polarity_scores(sentence)
#     return snt['compound']
#
#
# def add_to_new_db():
#     for doc_id in from_db:
#         # a document in the db
#         db_doc = from_db[doc_id]
#
#         # update the record by appending data(date, state, suburb, emotion)
#         new_doc = append_data(db_doc)
#
#         # print(new_doc)
#         # save to the new database
#         to_db.save(new_doc)
#
#
# add_to_new_db()
