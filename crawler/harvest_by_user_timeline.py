import time
import numpy
from couchdb import Server
from tweepy import OAuthHandler, AppAuthHandler, API, TweepError
from crawler import save_tweets, developer_keys_tokens
import datetime
import sys

server = Server('http://admin:password@172.26.132.166:5984//')
# server = Server('http://admin:password@127.0.0.1:5984//')
user_vic = server['tweets_no_coord']


def extract_all_users():
    print("--- start extract... ---")
    result = set()
    view_result = user_vic.view('_all_docs', include_docs=True)
    for row in view_result:
        row_doc = row['doc']
        if 'doc' in row_doc:
            username = row_doc['doc']['User_name']
            result.add(username)
    # for u_id in user_vic:
    #     result.add(user_vic[u_id]['doc']['User_name'])
    print('extract done!')
    return list(result)


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


class Harvest_by_user_timeline:
    def __init__(self, api, screen_name):
        self.api = api
        self.screen_name = screen_name

    def searching(self):
        print("--- start searching ---")
        max_id = None
        tweets_per_query = 200
        start_date = datetime.datetime(2020, 1, 1, 0, 0, 0)  # the first COVID-19 appear
        count = 0
        while True:
            fresh_tweets = self.api.user_timeline(screen_name=self.screen_name, count=tweets_per_query, max_id=max_id,
                                                  tweet_mode='extended')
            if not fresh_tweets:
                break

            to_save = []
            for tweet_i in range(len(fresh_tweets)):
                tweet = fresh_tweets[tweet_i]
                if tweet.created_at > start_date:
                    to_save.append(tweet)
                    # if not tweet.coordinates:
                    #     print("-- after 2020 but no coordinate, t_id: {}".format(tweet.id_str))
                # else:
                #     print("-- before 2020, t_id: {}".format(tweet.id_str))

            max_id = fresh_tweets[-1].id - 1
            save_tweets.save_search_tweets(save_tweets.tweets_cleaning(to_save))



            # if fresh_tweets and fresh_tweets[-1].created_at > start_date:
            #     max_id = fresh_tweets[-1].id - 1  # update max_id to harvester earlier data
            #     print("--- call  tweets_cleaning ---")
            #     valid_tweets = save_tweets.tweets_cleaning(fresh_tweets)
            #     save_tweets.save_search_tweets(valid_tweets)
            # el
            # else:
            #     print("--- before 2020, and the date is {}, and user_id is {}".format(fresh_tweets[-1].created_at, fresh_tweets[tweet_i].id_str))


if __name__ == "__main__":
    print('hello test')
    harvester_id = int(sys.argv[1])
    conf = developer_keys_tokens.config[harvester_id]
    start_time = time.time()
    users = extract_all_users()
    print("--- #users is {}".format(len(users)))
    print("-- time in total: {}".format(time.time() - start_time))
    # print(conf)
    # print(conf['consumer_key'])
    auth = TwitterAuthentication(conf['consumer_key'], conf['consumer_secret']).api_authenticate()
    api = API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, timeout=200)
    # print("--- start splitting the list ---")
    chunks = numpy.array_split(users, 8)
    chunk = []
    for i in range(len(chunks)):
        chunk = chunks[conf['developer_id'] - 1]

    for item in chunk:
        Harvest_by_user_timeline(api, item).searching()
