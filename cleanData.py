from couchdb import Server
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import parseVICSuburb

analyser = SentimentIntensityAnalyzer()

server = Server('http://admin:password@172.26.131.49:5984//')
old_db = server['test_chuangw']
new_db = server['test_chuangw_du']


def add_to_new_db():
    for doc_id in old_db:
        # a document in the db
        db_doc = old_db[doc_id]

        # update the record by appending data(date, state, suburb, emotion)
        new_doc = append_data(db_doc)

        # print(new_doc)
        # save to the new database
        new_db.save(new_doc)


def append_data(db_doc):
    tweet = db_doc['doc']
    # tweet data
    tweet_txt = tweet['Tweets']
    tweet_time = tweet['Time'].replace('T', '-').split('-')
    tweet_coord = tweet['Coordinates']['coordinates']

    # add date to doc
    tweet_date = dict(year=int(tweet_time[0]), month=int(tweet_time[1]), day=int(tweet_time[2]))
    tweet_emotion = get_emotion_val(tweet_txt)
    tweet_suburb = parseVICSuburb.find_suburb(tweet_coord[0], tweet_coord[1])
    tweet_state = 'VIC'  # maybe tweet state TBC
    tweet.update(date=tweet_date, state=tweet_state, suburb=tweet_suburb, emotion=tweet_emotion)
    result = dict(_id=db_doc['_id'], doc=tweet)

    return result


def get_emotion_val(sentence):
    snt = analyser.polarity_scores(sentence)
    return snt['compound']


add_to_new_db()
