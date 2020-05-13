import couchdb
import pandas


couch = couchdb.Server('http://admin:NEVERSTOP0309@localhost:5984')
db = couch['raw_tweets']
temp = db.view('_all_docs', include_docs=True)
items = [row['doc'] for row in temp]
dataframe_user = pandas.DataFrame(items)
#temp = dataframe_user['User_name']
users = dataframe_user['User_name'].unique()
with open("get_users_from_search.txt", 'w+', encoding='utf-8') as f:
    for user in users:
        f.write(user+'\n')

