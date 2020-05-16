import couchdb
import pandas
import json

couch = couchdb.Server('http://admin:password@172.26.131.49:5984/')
db = couch['all_tweets']
temp = db.view('_all_docs', include_docs=True)
itemList = []
for row in temp:
  item = row['doc']
  if 'doc' in item:
    itemList.append(item['doc'])
  else:
    print('item is empty')
    continue
users = []
for item in itemList:
  print(item)
  if 'User_name' in item:
    users.append(item['User_name'])
  else:
      print('error')
users = set(users)
with open("get_users_from_search.txt", 'w+', encoding='utf-8') as f:
    for user in users:
        f.write(user+'\n')

