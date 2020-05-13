from tweepy import OAuthHandler, AppAuthHandler, API, TweepError
from save_tweets import save_tweets
import datetime
from developer_keys_tokens import config
import pandas
import numpy
import sys

class TwitterAuthendication:
    def __init__(self, consumer_key, consumer_secret):
        self.consumer_key = consumer_key
        self.comsumer_secret = consumer_secret

    def api_authendicate(self):
        auth = AppAuthHandler(conf['consumer_key'], conf['consumer_secret'])   # creating an OAuthHandler instance
        return auth

    def access_authrndicate(self, access_token, access_token_secret):
        auth = OAuthHandler(self.consumer_key, self.comsumer_secret)
        auth.set_access_token(access_token, access_token_secret) # re-build an OAuthHandler, get OAuthHandler equipped
        return auth

class Harvest_by_user_timeline:
    def __init__(self, api,screen_name):
        self.api = api
        self.screen_name = screen_name

    def searching(self):
        max_id = None
        tweets_per_query = 200
        start_date = datetime.datetime(2020, 1, 25, 0, 0, 0)  # the first COVID-19 appear
        count = 0
        while True:
            fresh_tweets = self.api.user_timeline(screen_name = self.screen_name, count=tweets_per_query, max_id=max_id, tweets_mode = 'extended',)
            #print(fresh_tweets[-1].created_at)
            if fresh_tweets and fresh_tweets[-1].created_at > start_date:
                max_id = fresh_tweets[-1].id - 1  # update max_id to harvester earlier data
                dataframe = save_tweets().tweets_cleaning(fresh_tweets)
            # if dataframe.shape[0]!=0:
            #     count += dataframe.shape[0]
                save_tweets().save_search_tweets(dataframe.to_dict('records'))
            #print(tweets)
            if not fresh_tweets:
                break

if __name__ == "__main__":
    harvester_id = int(sys.argv[1])
    conf = config[harvester_id]
    users = []
    #print(conf)
    #print(conf['consumer_key'])
    auth = TwitterAuthendication(conf['consumer_key'], conf['consumer_secret']).api_authendicate()
    api = API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True, timeout=200)
    with open("get_users_from_search.txt") as f:
        for line in f:
            users.append(line.strip('\n'))
    all_users = len(users)
    if conf['developer_id'] == 1:
        users = users[0:all_users//8]
    elif conf['developer_id'] == 2:
        users = users[all_users//8:all_users//4]
    elif conf['developer_id'] == 3:
        users = users[all_users//4:3*all_users//8]
    elif conf['developer_id'] == 4:
        users = users[3 * all_users//8:all_users//2]
    elif conf['developer_id'] == 5:
        users = users[3 * all_users//8:all_users//2]
    elif conf['developer_id'] == 6:
        users = users[all_users//2:5*all_users//8]
    elif conf['developer_id'] == 7:
        users = users[5*all_users//8:3 * all_users//4]
    elif conf['developer_id'] == 8:
        users = users[3 * all_users//4:3 * all_users//4]
    for item in users:
        Harvest_by_user_timeline(api, item).searching()
