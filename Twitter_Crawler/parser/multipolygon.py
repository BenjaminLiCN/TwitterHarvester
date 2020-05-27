"""
@author: Team18(member details are as follows)

Name(Firstname Surname)	|	Username	|	StudentID	|	City
---------------------------------------------------------------------
Chuang Wang             |   chuangw     |   791793      | Melbourne
Honglong Zhang          |   honglongz   |   985262      | Melbourne
Jingyi Li               |   jili        |   961543      | Melbourne
Wei Lin                 |   wlin8       |   885536      | Melbourne
Yangyang Hu             |   Yangyangh1  |   978954      | Melbourne
"""
from couchdb import Server
from shapely.geometry import MultiPolygon, Point
from shapely.geometry.polygon import Polygon

a = [(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]
b = [(1, 1), (1, 2), (2, 2), (2, 1), (1, 1)]
multi1 = MultiPolygon([[a, []], [b, []]])
# multi1 = MultiPolygon(a, b)
states = {'VIC': multi1}

point = Point(1.75, 1.89)
for state in states:
    polygons = states[state]
    print(polygons)
    for polygon in polygons:
        if polygon.contains(point):
            print(state)
