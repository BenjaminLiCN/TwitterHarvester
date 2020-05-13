import json
from couchdb import Server

fileName = '/Users/frank/Library/Mobile Documents/com~apple~CloudDocs/Master_Of_Software/2020_Sem1/COMP90024_CCC/chuangw/gov/VIC_Local_Government_Areas.json'

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['gov_geo_data']


def write_to_db(filename):
    with open(filename, 'r', encoding='utf-8') as file_obj:
        data = json.load(file_obj)
        data.update(_id="VIC_Local_Gov_Area")
        db.save(data)


write_to_db(fileName)
