from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from couchdb import Server

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['gov_geo_data']


def get_all_suburbs():
    data = db['VIC_Local_Gov_Area']
    result = {}
    for feature in data['features']:
        if feature.get('geometry'):
            suburb = feature['properties']['vic_lga__3'].lower()
            result[suburb] = feature['geometry']['coordinates'][0][0]
    return result


def find_suburb(lo, la):
    allSuburbs = get_all_suburbs()  # dictionary "suburb":boundaries
    # print('Length : %d' % len(allSuburbs))
    # print(allSuburbs.keys())
    point = Point(lo, la)
    for sub in allSuburbs:
        boundaries = []
        for coordinates in allSuburbs[sub]:
            boundaries.append((coordinates[0], coordinates[1]))
        polygon = Polygon(boundaries)
        if polygon.contains(point):
            return sub
    return None
