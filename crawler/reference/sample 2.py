# This file is developed by Team 11 of COMP90024 of The University of Melbourne, under Apache Licence(see LICENCE).
# Researched Cities: Victoria, AU
# Team member - id:
# Zhijia Lu	921715
# Jing Du	775074
# Chenyang Lu	951933
# Pengcheng Yao	886326
# Echo Gu	520042

from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
import tweepy
import json
import fileinput
import time
import threading
import twitter
import os


def get_coord_by_box(box):
    x = 0
    y = 0
    for point in box:
        x += point[0]
        y += point[1]
        coord = (x / len(box), y / len(box))
    return coord


def erase_first_line(file_name):
    for line in fileinput.input(file_name, inplace=1):
        if not fileinput.isfirstline():
            print(line.replace('\n', ''))


def remove_duplicate_tweet(old_name, new_name):
    with open(old_name, "r+", encoding="utf-8") as old_file:
        old_line = old_file.readline()
        while old_line:
            flag = False
            old_line_json = json.loads(old_line)
            new_file_writer = open(new_name, "a", encoding="utf-8")
            new_file_reader = open(new_name, "r", encoding="utf-8")
            new_line = new_file_reader.readline()
            while new_line:
                new_line_json = json.loads(new_line)
                if old_line_json['_id'] == new_line_json['_id']:
                    flag = True
                    break
                new_line = new_file_reader.readline()
            if not flag:
                new_file_writer.write(json.dumps(old_line_json) + "\n")
            new_file_writer.close()
            new_file_reader.close()
            old_line = old_file.readline()
        old_file.close()


def remove_duplicate_user(old_name, new_name):
    with open(old_name, "r+", encoding="utf-8") as old_file:
        old_line = old_file.readline()
        while old_line:
            flag = False
            new_file_writer = open(new_name, "a", encoding="utf-8")
            new_file_reader = open(new_name, "r", encoding="utf-8")
            for line in new_file_reader:
                if line.rstrip('\n') == old_line.rstrip('\n'):
                    flag = True
                    break
            if not flag:
                new_file_writer.write(old_line)
            new_file_writer.close()
            new_file_reader.close()
            old_line = old_file.readline()
        old_file.close()


def check_duplicate_user(user_id):
    flag = False
    user_list = open('processed_user_list.json', 'r+', encoding='utf-8')
    line = user_list.readline()
    while line:
        used_user = json.loads(line)
        if json.loads(user_id)['id'] == used_user['id']:
            flag = True
        line = user_list.readline()
    user_list.close()
    return flag


def get_boundaries(boundary_filename):
    with open(boundary_filename, 'r', encoding='utf-8') as load_f2:
        area__list = json.load(load_f2)
        bound = {}
        for feature in area__list['features']:
            if feature.get('geometry'):
                area_name = feature['properties']['vic_lga__3'].split(" (")[0]
                bound[area_name] = feature['geometry']['coordinates']
        load_f2.close()
    return bound


def allocate_tweet(twee_x, twee_y, bound):
    point = Point(twee_x, twee_y)
    for area in bound:
        boundary = []
        for coord in bound[area][0]:
            boundary.append((coord[0], coord[1]))
        polygon = Polygon(boundary)
        if polygon.contains(point):
            return area
    return None


def get_token(api_tokens, api_type):
    tokens = []
    token_used = None
    token_reader = open(api_tokens, 'r', encoding='utf-8')
    for line in token_reader:
        tokens.append(json.loads(line))
    token_reader.close()
    for token in tokens:
        if api_type not in token['using']:
            token['using'].append(api_type)
            if api_type == 'stream':
                token['start_time'][0] = time.time()
            if api_type == 'timeline':
                token['start_time'][1] = time.time()
            token_used = token
            break
    token_writer = open(api_tokens, 'w', encoding='utf-8')
    for token in tokens:
        token_writer.write(json.dumps(token) + '\n')
    token_writer.close()
    return token_used


def timeline_sleeper(area):
    time.sleep(900)
    timeline_search_crawler('tweet_recent.json', area)


def standard_search_crawler(max_tweets, area, tweet_file, user_list):
    auth = tweepy.AppAuthHandler("70uWCXRqfnYK822pVnedxpNSr", "c0ogexCacwlwYfGR44qQrU4gXrKxHFtSuhWzURulckQWiPghRY")
    api = tweepy.API(auth, wait_on_rate_limit=True, wait_on_rate_limit_notify=True)
    if not api:
        print("Can't Authenticate")
    search_query = 'place:0ec0c4fcacbd0083'
    tweets_per_qry = 100  # this is the max the API permits
    tweet_count = 0
    print("Downloading max {0} tweets".format(max_tweets))
    with open(tweet_file, 'a', encoding='utf-8') as load_f:
        with open(user_list, 'a', encoding='utf-8') as load_f1:
            while tweet_count < max_tweets:
                new_tweets = api.search(q=search_query, count=tweets_per_qry)
                if not new_tweets:
                    print("No more tweets found")
                    break
                for tweet_status in new_tweets:
                    twi_dict = {}
                    tweet = tweet_status._json
                    twi_dict_x = None
                    twi_dict_y = None
                    twi_dict_t = None
                    if tweet.get('text'):
                        if tweet['lang'] == 'en':
                            twi_dict_t = tweet['text']
                    if tweet.get('coordinates'):
                        twi_dict_x = tweet['coordinates']['coordinates'][0]
                        twi_dict_y = tweet['coordinates']['coordinates'][1]
                    if tweet.get('geo') and twi_dict_x is None and twi_dict_y is None:
                        twi_dict_x = tweet['geo']['coordinates'][1]
                        twi_dict_y = tweet['geo']['coordinates'][0]
                    if tweet.get('place'):
                        twi_dict_x = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[0]
                        twi_dict_y = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[1]
                    if twi_dict_x is not None and twi_dict_y is not None and twi_dict_t is not None and allocate_tweet(
                            twi_dict_x, twi_dict_y, area) is not None:
                        twi_dict["_id"] = tweet.get('id')
                        twi_dict["x_coord"] = twi_dict_x
                        twi_dict["y_coord"] = twi_dict_y
                        twi_dict["text"] = twi_dict_t
                        twi_dict["area"] = allocate_tweet(twi_dict_x, twi_dict_y, area)
                        twi_dict['hashtags'] = tweet['entities']['hashtags']
                        twi_dict['time'] = tweet['created_at']
                        load_f.write(json.dumps(twi_dict) + "\n")
                        tweet_count += 1
                    line = {'id': tweet['user']['id_str']}
                    load_f1.write(json.dumps(line) + '\n')
            load_f1.close()
        load_f.close()
    notice = "Downloaded {0} tweets, Saved to {1}".format(tweet_count, 'disk')
    return notice


def stream_search_crawler(area):
    auth = tweepy.OAuthHandler("70uWCXRqfnYK822pVnedxpNSr", "c0ogexCacwlwYfGR44qQrU4gXrKxHFtSuhWzURulckQWiPghRY")
    auth.set_access_token("116158500-u23FrW1GqbIBSDHO7sK0UpJnnMM9CZHyQXgPCv0b",
                          "74viKYgoycL1KA9jaOheVlReKow2dZlDwSSEuNzbdHVsQ")

    class MyStreamListener(tweepy.StreamListener):
        def on_error(self, status_code):
            if status_code == 420:
                self.on_timeout()

        def on_timeout(self):
            time.sleep(600)

        def on_status(self, status):
            twitter_stream.disconnect()
            twitter_stream.filter(locations=location)
            try:
                with open("tweet_recent.json", 'a', encoding='utf-8') as load_f:
                    with open("unprocessed_user_list.txt", 'a', encoding='utf-8') as load_f1:
                        twi_dict = {}
                        tweet = status._json
                        twi_dict_x = None
                        twi_dict_y = None
                        twi_dict_t = None
                        if tweet.get('text'):
                            if tweet['lang'] == 'en':
                                twi_dict_t = tweet['text']
                        if tweet.get('coordinates'):
                            twi_dict_x = tweet['coordinates']['coordinates'][0]
                            twi_dict_y = tweet['coordinates']['coordinates'][1]
                        if tweet.get('geo') and twi_dict_x is None and twi_dict_y is not None:
                            twi_dict_x = tweet['geo']['coordinates'][1]
                            twi_dict_y = tweet['geo']['coordinates'][0]
                        if tweet.get('place'):
                            twi_dict_x = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[0]
                            twi_dict_y = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[1]
                        if twi_dict_x is not None and twi_dict_y is not None and twi_dict_t is not None and \
                                allocate_tweet(twi_dict_x, twi_dict_y, area) is not None:
                            twi_dict["_id"] = tweet.get('id')
                            twi_dict["x_coord"] = twi_dict_x
                            twi_dict["y_coord"] = twi_dict_y
                            twi_dict["text"] = twi_dict_t
                            twi_dict["area"] = allocate_tweet(twi_dict_x, twi_dict_y, area)
                            twi_dict["user"] = tweet['user']['id_str']
                            twi_dict['hashtags'] = tweet['entities']['hashtags']
                            twi_dict['time'] = tweet['created_at']
                            load_f.write(json.dumps(twi_dict) + "\n")
                        if check_duplicate_user(tweet['user']['id_str']):
                            line = {'id': tweet['user']['id_str']}
                            load_f1.write(json.dumps(line) + '\n')
                    return True
            except BaseException as e:
                print("Error on_status: %s" % str(e))
            return True

    location = [140.961681984, -39.159189527500004, 149.976679008, -33.9806475865]
    twitter_stream = tweepy.Stream(auth, MyStreamListener())
    print('listener starting to listen')
    twitter_stream.filter(locations=location)


def timeline_search_crawler(tweet_file, area):
    unprocesed_user = open('unprocessed_user_list.json', 'r', encoding='utf-8')
    line = unprocesed_user.readline()
    unprocesed_user.close()
    if not line:
        print('no user, sleep for 15 mins')
        timeline_sleeper(area)
    else:
        while True:
            if check_duplicate_user(line):
                print('dupicate user')
                unprocesed_user = open('unprocessed_user_list.json', 'r', encoding='utf-8')
                line = unprocesed_user.readline()
                unprocesed_user.close()
                if not line:
                    print('no user, sleep for 5 mins')
                    timeline_sleeper(area)
                else:
                    erase_first_line('unprocessed_user_list.json')
            else:
                break
        user_id = json.loads(line)['id']
        unprocesed_user.close()
        erase_first_line('unprocessed_user_list.json')
        processed_user = open('processed_user_list.json', 'a', encoding='utf-8')
        written_line = {"id": user_id}
        processed_user.write(json.dumps(written_line) + '\n')
        processed_user.close()
        aut2 = twitter.Api("AhG4qKaMSjvqixPpL6Sdy2OUq", "OF2YG3tkLywPbkm91Cs1gK59p6wBoAPoShCo2KUDeS61vfxrGp",
                           "1121572108167815168-jCldvS7cMOTPV67KscV7IHrB6EK7qk",
                           "Blfi0G0GQ9i0GatY7X5SuJZHgcN0pynhBkiTji0eFGTbe")
        aut2.sleep_on_rate_limit
        timeline_tweets = aut2.GetUserTimeline(user_id=user_id, count=200)
        with open(tweet_file, 'a', encoding='utf-8') as load_f:
            for timeline_tweet in timeline_tweets:
                tweet = timeline_tweet._json
                if int(tweet['created_at'][-4:]) < 2014:
                    break
                twi_dict = {}
                twi_dict_x = None
                twi_dict_y = None
                twi_dict_t = None
                if tweet.get('text'):
                    if tweet['lang'] == 'en':
                        twi_dict_t = tweet['text']
                if tweet.get('coordinates'):
                    twi_dict_x = tweet['coordinates']['coordinates'][1]
                    twi_dict_y = tweet['coordinates']['coordinates'][0]
                if tweet.get('geo') and twi_dict_x is None and twi_dict_y is None:
                    twi_dict_x = tweet['coordinates']['coordinates'][0]
                    twi_dict_y = tweet['coordinates']['coordinates'][1]
                if tweet.get('place'):
                    if tweet['place'].get('bounding_box'):
                        if tweet['place']['bounding_box'].get('coordinates'):
                            twi_dict_x = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[0]
                            twi_dict_y = get_coord_by_box(tweet['place']['bounding_box']['coordinates'][0])[1]
                if twi_dict_x is not None and twi_dict_y is not None and twi_dict_t is not None and allocate_tweet(
                        twi_dict_x, twi_dict_y, area) is not None:
                    twi_dict["_id"] = tweet.get('id')
                    twi_dict["x_coord"] = twi_dict_x
                    twi_dict["y_coord"] = twi_dict_y
                    twi_dict["text"] = twi_dict_t
                    twi_dict["area"] = allocate_tweet(twi_dict_x, twi_dict_y, area)
                    twi_dict['hashtags'] = tweet['entities']['hashtags']
                    twi_dict['time'] = tweet['created_at']
                    load_f.write(json.dumps(twi_dict) + "\n")
            load_f.close()


if __name__ == '__main__':
    boundaries = get_boundaries('./geoserver-GetFeature.json')
    count = 0
    crawler_area = {}
    for key in boundaries:
        if count > 60:
            crawler_area[key] = boundaries[key]
        count += 1
    # standard search before, all new-generated tweets are captured by stream listener,
    # so do not need to standard search again
    # time = 0
    # while time < 100:
    #     time += 1
    #     try:
    #         print(standard_search_crawler(10, crawler_area,
    #                                       'duplicate_tweet_recent.json', 'duplicate_user_list.json'))
    #         print('searched 100')
    #     except:
    #         print('login error, try again')
    #         continue
    # try:
    #     remove_duplicate_tweet('duplicate_tweet_recent.json', 'tweet_recent.json')
    #     remove_duplicate_user('duplicate_user_list.json', 'unprocessed_user_list.json')
    #     os.remove('duplicate_tweet_recent.json')
    #     os.remove('duplicate_user_list.json')
    # except:
    #     print('IO error')

    try:
        stream_thread = threading.Thread(target=stream_search_crawler, args=(crawler_area,))
        stream_thread.start()
        print('stream listener start to listen!')

    except:
        stream_thread = threading.Thread(target=stream_search_crawler, args=("API_tokens.json",))
        stream_thread.start()
        print('fail to create stream listener')

    f1 = open('unprocessed_user_list.json', 'a', encoding='utf-8')
    f1.close()
    f = open('processed_user_list.json', 'a', encoding='utf-8')
    f.close()
    while 1:
        try:
            timeline_search_crawler('tweet_recent.json', crawler_area)
        except twitter.error.TwitterError:
            print('not auth')
        except:
            print('error on timeline')


