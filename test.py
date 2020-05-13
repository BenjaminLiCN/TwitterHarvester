from couchdb import Server
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['test_chuangw']

doc = {
  "_id": "1251734552747229184",
  "doc": {
    "User_name": "1JYK1",
    "Time": "2020-04-19T04:49:08",
    "Tweets": "Finished product in time for lunch. #isobaking @ Cowaramup, Western Australia https://t.co/m4CJJtOink",
    "Hashtag": [
      "isobaking"
    ],
    "Length": 101,
    "Likes": 0,
    "Retweet": 0,
    "Location": "Sydney New South Wales ",
    "Coordinates": {
      "type": "Point",
      "coordinates": [
        115.10287,
        -33.85094
      ]
    }
  }
}


db.save(doc)


