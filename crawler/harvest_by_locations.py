import sys

from tweepy import OAuthHandler, AppAuthHandler, API

from developer_keys_tokens import config
import save_tweets


class TwitterAuthentication:
    def __init__(self, consumer_key, consumer_secret):
        self.consumer_key = consumer_key
        self.consumer_secret = consumer_secret

    def api_authenticate(self):
        auth = AppAuthHandler(conf['consumer_key'], conf['consumer_secret'])  # creating an OAuthHandler instance
        return auth

    def access_authenticate(self, access_token, access_token_secret):
        auth = OAuthHandler(self.consumer_key, self.consumer_secret)
        auth.set_access_token(access_token, access_token_secret)  # re-build an OAuthHandler, get OAuthHandler equipped
        return auth


class Harvest_by_location:
    def __init__(self, api, location):
        self.api = api
        self.location = location

    def searching(self):
        max_id = None
        tweets_per_query = 100
        count = 0
        while True:
            fresh_tweets = self.api.search(q='*', geocode=self.location, lang="en", count=tweets_per_query,
                                           max_id=max_id, tweet_mode='extended')
            if fresh_tweets:
                max_id = fresh_tweets[-1].id - 1  # update max_id to harvester earlier data
                # print(fresh_tweets[-1].created_at)
                # for item in fresh_tweets:
                # tweets.append(item._json)
                valid_tweets = save_tweets.tweets_cleaning(fresh_tweets)
                # if dataframe.shape[0]!=0:
                #     count += dataframe.shape[0]
                save_tweets.save_search_tweets(valid_tweets)
            # print(tweets)
            if not fresh_tweets:
                break


if __name__ == "__main__":
    harvester_id = int(sys.argv[1])
    conf = config[harvester_id]
    # print(conf)
    # print(conf['consumer_key'])
    auth = TwitterAuthentication(conf['consumer_key'], conf['consumer_secret']).api_authenticate()
    api = API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, timeout=200)
    for city, location in conf['search_by_location']:
        print(city, location)
        Harvest_by_location(api, location).searching()
