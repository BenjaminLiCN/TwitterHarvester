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
from couchdb import Server

server = Server('http://admin:password@172.26.131.49:5984//')
gov_db = server['gov_geo_data']


def to_polygon(coords):
    points = []
    for c in coords:
        points.append((c[0], c[1]))
    return points


def save_states_polygons():
    state_data = {"Australian Capital Territory": gov_db['ACT_State_Boundary'],
                  "New South Wales": gov_db['NSW_State_Boundary'],
                  "Northern Territory": gov_db['NT_State_Boundary'],
                  "Queensland": gov_db['QLD_State_Boundary'],
                  "South Australia": gov_db['SA_State_Boundary'],
                  "Tasmania": gov_db['TAS_State_Boundary'],
                  "Victoria": gov_db['VIC_State_Boundary'],
                  "Western Australia": gov_db['WA_State_Boundary']
                  }

    for state in state_data:
        polygons = []
        state_json = state_data[state]
        for feature in state_json['features']:
            coords = feature['geometry']['coordinates'][0][0]
            polygons.append([to_polygon(coords), []])
        state_data[state] = polygons

    to_save = dict(_id="AU_States_Polygons", doc=state_data)
    gov_db.save(to_save)


save_states_polygons()
