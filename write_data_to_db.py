import json
from couchdb import Server

fileName = 'states.geojson'

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['gov_geo_data']


def write_to_db(filename):
    with open(filename, 'r', encoding='utf-8') as file_obj:
        data = json.load(file_obj)
        data.update(_id="AU_States_Geo_Data")
        db.save(data)


write_to_db(fileName)
