from django.http import JsonResponse
from couchdb import Server
server = Server('http://admin:password@172.26.131.49:5984//')
db = server['hospital']

#for key_value in db.view('testReduce/new-view',group = True):
#   print(key_value.key, key_value.value)
#hospital_json = db['c12415e43341f595eac3f83c5201be97']
#print(hospital_json)
def profile(request):
    data = {
        'name': 'Vitor',
        'location': 'Finland',
        'is_active': True,
        'count': 28
    }
    return JsonResponse(data)

def helloworld(request):
    data = {
        'name': 'helloword',
    }
    return JsonResponse(data)

def hospital(request):
    server = Server('http://admin:password@172.26.131.49:5984//')
    db = server['hospital']
    hospital_json = db['c12415e43341f595eac3f83c5202b461']
    response = JsonResponse(hospital_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response

def school(request):
    server = Server('http://admin:password@172.26.131.49:5984//')
    db = server['school']
    school_json = db['c12415e43341f595eac3f83c5202d6df']
    response = JsonResponse(school_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response

def confirmed(request):
    server = Server('http://admin:password@172.26.131.49:5984//')
    db = server['confirmed']
    school_json = db['0510']
    response = JsonResponse(school_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response