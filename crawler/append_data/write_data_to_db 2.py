import json
from couchdb import Server

fileName = '/Users/frank/Library/Mobile Documents/com~apple~CloudDocs/Master_Of_Software/2020_Sem1/COMP90024_CCC/assignment/assignment2/VIC_State_Boundary.json'

# server = Server('http://admin:password@172.26.131.49:5984//')
# db = server['gov_geo_data']
#
# def write_to_db(filename):
#     with open(filename, 'r', encoding='utf-8') as file_obj:
#         data = json.load(file_obj)
#         data.update(_id="VIC_State_Boundary")
#         db.save(data)
#
#
# write_to_db(fileName)


# server = Server('http://admin:password@172.26.131.49:5984//')
# db = server['test_chuangw']
#
# doc = {
#   "_id": "1251734552747229184",
#   "doc": {
#     "User_name": "1JYK1",
#     "Time": "2020-04-19T04:49:08",
#     "Tweets": "Finished product in time for lunch. #isobaking @ Cowaramup, Western Australia https://t.co/m4CJJtOink",
#     "Hashtag": [
#       "isobaking"
#     ],
#     "Length": 101,
#     "Likes": 0,
#     "Retweet": 0,
#     "Location": "Sydney New South Wales ",
#     "Coordinates": {
#       "type": "Point",
#       "coordinates": [
#         115.10287,
#         -33.85094
#       ]
#     }
#   }
# }
#
#
# db.save(doc)
