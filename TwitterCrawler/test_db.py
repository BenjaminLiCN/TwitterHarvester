import couchdb
from couchdb import Database

couch = couchdb.Server('http://admin:NEVERSTOP0309@localhost:5984')
db = couch['raw_tweets']
doc = {"hyy":"wo"}
db.save(doc)