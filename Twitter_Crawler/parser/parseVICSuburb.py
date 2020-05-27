"""
@author: Team18(member details are as follows)

Name(LastName Surname)  |   Username    |   StudentID   |   City
---------------------------------------------------------------------
Chuang Wang             |   chuangw     |   791793      | Melbourne
Honglong Zhang          |   honglongz   |   985262      | Melbourne
Jingyi Li               |   jili        |   961543      | Melbourne
Wei Lin                 |   wlin8       |   885536      | Melbourne
Yangyang Hu             |   Yangyangh1  |   978954      | Melbourne
"""
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon
from couchdb import Server


def get_all_suburbs(server):
    db = server['gov_geo_data']
    data = db['VIC_Local_Gov_Area']
    result = {}
    for feature in data['features']:
        if feature.get('geometry'):
            suburb = feature['properties']['vic_lga__3'].lower()
            result[suburb] = feature['geometry']['coordinates'][0][0]
    return result


def find_suburb(point, server):
    allSuburbs = get_all_suburbs(server)  # dictionary "suburb":boundaries
    # print('Length : %d' % len(allSuburbs))
    # print(allSuburbs.keys())
    for sub in allSuburbs:
        boundaries = []
        for coordinates in allSuburbs[sub]:
            boundaries.append((coordinates[0], coordinates[1]))
        polygon = Polygon(boundaries)
        if polygon.contains(point):
            return sub
    return None
