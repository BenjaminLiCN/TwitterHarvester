import couchdb
from tweepy import Cursor
import json
import numpy
import pandas
from couchdb import Server
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

server = Server('http://admin:password@172.26.131.49:5984//')
to_db = server['test_chuangw']
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

def generate_allPolygons(coords):
    polygons = []
    for coord in coords:
        points = []
        for c in coord:
            for i in c:
                if isinstance(i, list):
                    points.append((i[0], i[1]))
        polygons.append(Polygon(points))
    return polygons


def get_all_states():
    data = gov_data_db['AU_States_Geo_Data']
    all_states = {}
    for feature in data['features']:
        state = feature['properties']['STATE_NAME']
        polygons = generate_allPolygons(feature['geometry']['coordinates'])
        all_states[state] = polygons
    return all_states


all_states = get_all_states()


def find_state(point):
    # all_states: dictionary "state":multi polygons
    # print('Length : %d' % len(all_states))
    for state in all_states:
        polygons = all_states[state]
        for polygon in polygons:
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

        print("id: {}".format(tweets['_id']))
        # add date, emotion, suburb, state to doc
        tweets['doc']['date'] = dict(year=int(tweet_time[0]), month=int(tweet_time[1]), day=int(tweet_time[2]))
        tweets['doc']['state'] = find_state(tweet_point)
        tweets['doc']['suburb'] = find_suburb(tweet_point)
        tweets['doc']['emotion'] = get_emotion_val(tweet_txt)

        final.append(tweets)
    return final


# Save cleaned data to couchdb
def save_search_tweets(tweets):
    for tweet in tweets:
        try:
            # save to the new database
            to_db.save(tweet)

        except couchdb.http.ResourceConflict as e1:
            continue
