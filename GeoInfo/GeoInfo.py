import json
with open('GeoJson.json') as json_file:
    data = json.load(json_file)
    print(data['type'])
