from couchdb import Server
from shapely.geometry import Point
from shapely.geometry.polygon import Polygon


def generate_allPolygons(coords):
    polygons = []
    for coord in coords:
        points = []
        for c in coord:
            for i in c:
                if isinstance(i, list):
                    points.append((i[0], i[1]))
        polygons.append(Polygon(points))
    return polygons


def get_all_states(server):
    db = server['gov_geo_data']
    data = db['AU_States_Geo_Data']
    all_states = {}
    for feature in data['features']:
        state = feature['properties']['STATE_NAME']
        polygons = generate_allPolygons(feature['geometry']['coordinates'])
        all_states[state] = polygons
    return all_states


def find_state(point, server):
    all_states = get_all_states(server)  # dictionary "state":multi polygons
    # print('Length : %d' % len(all_states))
    for state in all_states:
        polygons = all_states[state]
        for polygon in polygons:
            if polygon.contains(point):
                return state
    return None
