import couchdb
from tweepy import Cursor
import json
import numpy
import pandas
import appendDataFromCrawler


# Get tweets reorganized in good format and save to couchdb

# Transfer status object tweets into structured dataframe and organized by adding new id
def tweets_cleaning(fresh_tweets):
    # new_dataframe = pandas.DataFrame()
    text = []
    hashtag = []
    hashTag = []
    final = []
    # organize retweets by extracting useful info
    for items in fresh_tweets:
        if 'retweeted_status' in items._json:
            text.append('RT @' + items._json['retweeted_status']['user']['screen_name'] + ': ' +
                        items._json['retweeted_status']['text'])
        else:
            text.append(items.text)
        hashTag.extend([items._json['text']] for item in items.entities['hashtags'])  # organize hashtags
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
        final.append(tweets)
        # Insert surburb处理
        # Insert sentiment analysis on tweets['doc']['Tweets']
    return final


# Save cleaned data to couchdb
def save_search_tweets(tweets):
    appendDataFromCrawler.add_to_db(tweets)
