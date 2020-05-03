from django.http import JsonResponse
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