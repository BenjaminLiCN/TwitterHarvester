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
import couchdb
from tweepy import Cursor
import json
import numpy
import pandas
from couchdb import Server
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from shapely.geometry import Point, MultiPolygon
from shapely.geometry.polygon import Polygon

server = Server('http://admin:password@172.26.132.166:5984//')
# server = Server('http://admin:password@127.0.0.1:5984//')
to_db = server['vic_timeline']
gov_data_db = server['gov_geo_data']


#######################################################################################################################
#                     given a coordinate, identify the suburb (in VIC state only)
#######################################################################################################################
def get_all_suburbs():
    data = gov_data_db['VIC_Local_Gov_Area']
    result = {}
    for feature in data['features']:
        if feature.get('geometry'):
            suburb = feature['properties']['vic_lga__3'].lower()
            result[suburb] = feature['geometry']['coordinates'][0][0]
    return result


allSuburbs = get_all_suburbs()


def find_suburb(point):
    # allSuburbs: dictionary "suburb":boundaries
    # print('Length : %d' % len(allSuburbs))
    # print(allSuburbs.keys())
    for sub in allSuburbs:
        boundaries = []
        for coordinates in allSuburbs[sub]:
            boundaries.append((coordinates[0], coordinates[1]))
        polygon = Polygon(boundaries)
        if polygon.contains(point):
            return sub
    return None


#######################################################################################################################
#                     given a coordinate, identify the state
#######################################################################################################################
def load_states_polygons():
    data = gov_data_db['AU_States_Polygons']['doc']
    states = {}
    for key in data:
        states[key] = MultiPolygon(data[key])
    return states


states_polygons = load_states_polygons()


def find_state(point):
    for state in states_polygons:
        for polygon in states_polygons[state]:
            if polygon.contains(point):
                return state
    return None


#######################################################################################################################
#                     sentiment analysis
#######################################################################################################################

sentiment_analyser = SentimentIntensityAnalyzer()


def get_emotion_val(sentence):
    snt = sentiment_analyser.polarity_scores(sentence)
    return snt['compound']


#######################################################################################################################
#                     tweets cleaning and save tweets to db
#######################################################################################################################

# Get tweets reorganized in good format and save to couchdb

# Transfer status object tweets into structured dataframe and organized by adding new id
def tweets_cleaning(fresh_tweets):
    # new_dataframe = pandas.DataFrame()
    text = []
    hashtag = []
    final = []
    # organize retweets by extracting useful info
    for items in fresh_tweets:
        if 'retweeted_status' in items._json:
            text.append('RT @' + items._json['retweeted_status']['user']['screen_name'] + ': ' +
                        items._json['retweeted_status']['full_text'])
        else:
            text.append(items.full_text)
        hashTag = []
        hashTag.extend([item['text'] for item in items.entities['hashtags']])  # organize hashtags
        hashTag = list(set(hashTag))
        hashtag.append(hashTag)
    for item in range(len(fresh_tweets)):
        if not fresh_tweets[item].coordinates:
            # print("id: {} no coord".format(fresh_tweets[item].id_str))
            continue
        tweets = {}
        tweets['_id'] = fresh_tweets[item].id_str
        tweets['doc'] = {}
        tweets['doc']['User_name'] = fresh_tweets[item].user.screen_name
        tweets['doc']['Time'] = fresh_tweets[item].created_at.isoformat()
        tweets['doc']['Tweets'] = text[item]
        tweets['doc']['Hashtag'] = hashtag[item]
        tweets['doc']['Length'] = len(text[item])
        tweets['doc']['Likes'] = fresh_tweets[item].favorite_count
        tweets['doc']['Retweet'] = fresh_tweets[item].retweet_count
        tweets['doc']['Location'] = fresh_tweets[item].user.location
        tweets['doc']['Coordinates'] = fresh_tweets[item].coordinates

        # prepare to append new data
        tweet_txt = tweets['doc']['Tweets']
        tweet_time = tweets['doc']['Time'].replace('T', '-').split('-')
        tweet_coord = tweets['doc']['Coordinates']['coordinates']
        tweet_point = Point(tweet_coord[0], tweet_coord[1])

        # print("id: {}".format(tweets['_id']))
        # add date, emotion, suburb, state to doc
        tweets['doc']['date'] = dict(year=int(tweet_time[0]), month=int(tweet_time[1]), day=int(tweet_time[2]))
        tweets['doc']['state'] = find_state(tweet_point)
        tweets['doc']['suburb'] = find_suburb(tweet_point)
        tweets['doc']['emotion'] = get_emotion_val(tweet_txt)

        if tweets['doc']['state'] == 'Victoria':
            final.append(tweets)
            print("in VIC - _id: {}".format(tweets['_id']))
        else:
            print("not VIC - _id: {}".format(tweets['_id']))
    return final


# Save cleaned data to couchdb
def save_search_tweets(tweets):
    for tweet in tweets:
        try:
            # save to the new database
            to_db.save(tweet)

        except couchdb.http.ResourceConflict as e1:
            continue
