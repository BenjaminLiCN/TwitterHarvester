import couchdb
from tweepy import Cursor
import json
import numpy
import pandas

# Get tweets reorganized in good format and save to couchdb
class save_tweets():
    # Transfer status object tweets into structured dataframe and organized by adding new id
    def tweets_cleaning(self, fresh_tweets):
        new_dataframe = pandas.DataFrame()
        text = []
        hashtag = []
        hashTag = []
        # organize retweets by extracting useful info
        for item in fresh_tweets:
            if 'retweeted_status' in item._json:
                text.append('RT @' + item._json['retweeted_status']['user']['screen_name'] + ': ' +
                    item._json['retweeted_status']['text'])
            else:
                text.append(item.text)
            hashTag.extend([item['text'] for item in item.entities['hashtags']])
            hashTag = list(set(hashTag))
            hashtag.append(hashTag)
        new_dataframe['_id'] = numpy.array([tweet.id_str for tweet in fresh_tweets])
        new_dataframe['User_name'] = numpy.array([tweet.user.screen_name for tweet in fresh_tweets])
        new_dataframe['Time'] = numpy.array([tweet.created_at.isoformat() for tweet in fresh_tweets])
        new_dataframe['Tweets'] = text
        new_dataframe['Hashtag'] = hashtag
        new_dataframe['Length'] = numpy.array([len(tweet.text) for tweet in fresh_tweets])
        new_dataframe['Likes'] = numpy.array([tweet.favorite_count for tweet in fresh_tweets])
        new_dataframe['Retweet'] = numpy.array([tweet.retweet_count for tweet in fresh_tweets])
        new_dataframe['Location'] = numpy.array([tweet.user.location for tweet in fresh_tweets])
        new_dataframe['Coordinates'] = numpy.array([tweet.coordinates for tweet in fresh_tweets])
        return new_dataframe

    # Save cleaned data to couchdb
    def save_search_tweets(self, tweets):
            couch = couchdb.Server('http://admin:NEVERSTOP0309@localhost:5984')
            db = couch['raw_tweets']
            for items in tweets:
                try:
                    db.save(items)
                except couchdb.http.ResourceConflict as e1:
                    continue



