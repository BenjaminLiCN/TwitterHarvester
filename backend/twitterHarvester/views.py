import string

from django.http import JsonResponse
from couchdb import Server

try:
    server = Server('http://admin:password@172.26.132.166:5984//')
except Exception:
    server = Server('http://admin:password@172.26.130.218:5984//')


# db = server['hospital']


# for key_value in db.view('testReduce/new-view',group = True):
#   print(key_value.key, key_value.value)
# hospital_json = db['c12415e43341f595eac3f83c5201be97']
# print(hospital_json)
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
    # server = Server('http://admin:password@172.26.132.166:5984//')
    db = server['hospital']
    hospital_json = db['c12415e43341f595eac3f83c5202b461']
    response = JsonResponse(hospital_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def school(request):
    # server = Server('http://admin:password@172.26.132.166:5984//')
    db = server['school']
    school_json = db['c12415e43341f595eac3f83c5202d6df']
    response = JsonResponse(school_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def confirmed(request):
    # server = Server('http://admin:password@172.26.132.166:5984//')
    db = server['confirmed']
    school_json = db['0510']
    response = JsonResponse(school_json)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def confirmedAll(request):
    # server = Server('http://admin:password@172.26.132.166:5984//')
    db = server['confirmed']
    result = {}
    for key_value in db.view('confirmed/confirmed-view', group=False):
        mydic = {}
        for i in key_value.value['doc']:
            # print(i)
            mydic[i['Suburb'].upper()] = i['cases']
            print(mydic)
        result[key_value.key] = mydic
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def confirmedAllState(request):
    # server = Server('http://admin:password@172.26.132.166:5984//')
    db = server['state_confirmed']
    result = {}
    for key_value in db.view('state_confirmed/state-confirmed-view', group=False):
        mydic = {}
        for i in key_value.value['doc']:
            mydic[i['state']] = i['cases']
        result[key_value.key] = mydic
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def suburbAndEmotion(request):
    # server = Server('http://admin:password@172.26.131.49:5984//')
    db = server['all_tweets']
    result = {}
    resultlist = []
    doc = {}
    dateDict = {}
    for key_value in db.view('emotions/vic_sub_emotions', group=True):

        single_result = {}
        mydate = format_date(key_value.key[2])
        suburb = key_value.key[1]
        # if suburb == 'bayside' and mydate =='0513':
        #    print(key_value)
        if mydate in doc.keys():
            dateDict = doc[mydate]
            # print(dateDict)
            if suburb in dateDict.keys():
                # if mydate == '0513' and suburb == 'bayside':
                #     print(dateDict[suburb])
                #     print(key_value)
                suburbList = dateDict[suburb]
                single_result['emotion'] = key_value.key[3]
                single_result['num'] = key_value.value
                suburbList.append(single_result)
                dateDict[suburb] = suburbList
            else:
                # if mydate == '0513' and suburb == 'bayside':
                #    print('test')
                suburbList = []
                single_result['emotion'] = key_value.key[3]
                single_result['num'] = key_value.value
                suburbList.append(single_result)
                dateDict[suburb] = suburbList
            doc[mydate] = dateDict
        else:
            suburbList = []
            single_result = {}
            dateDict = {}
            single_result['emotion'] = key_value.key[3]
            single_result['num'] = key_value.value
            suburbList.append(single_result)
            dateDict[suburb] = suburbList
            # dateList = []
            # dateList.append(dateDict)
            doc[mydate] = dateDict
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def suburbAndHottopic(request):
    db = server['all_tweets']
    result = {}
    doc = {}
    for key_value in db.view('hot_topics/vic_sub_hot_topics', group=True):
        date = format_date(key_value.key[1])
        suburb = key_value.key[0]
        topic = key_value.key[2]
        if date not in doc.keys():
            suburb_topics = {}
            topics = [{"word": topic, "num": key_value.value}]
            suburb_topics[suburb] = topics
            doc[date] = suburb_topics
        else:
            suburb_topics = doc[date]
            if suburb not in suburb_topics.keys():
                topic_list = [{"word": topic, "num": key_value.value}]
                suburb_topics[suburb] = topic_list
            else:
                topic_list = suburb_topics[suburb]
                topic_list.append({"word": topic, "num": key_value.value})
            doc[date] = suburb_topics
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def suburb_avg_emotion(request):
    # server = Server('http://admin:password@172.26.131.49:5984//')
    db = server['all_tweets']
    result = {}
    doc = {}
    for key_value in db.view('vic_sub_avg_emotion/vic_sub_avg_emotion', group=True):
        date = format_date(key_value.key[0])
        suburb = key_value.key[1]
        avg_emotion = round(key_value.value, 2)
        if date not in doc.keys():
            all_suburbs_data = {suburb: avg_emotion}
            doc[date] = all_suburbs_data
        else:
            all_suburbs_data = doc[date]
            all_suburbs_data[suburb] = avg_emotion
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def state_hot_topics(request):
    db = server['all_tweets']
    result = {}
    doc = {}
    for key_value in db.view('hot_topics/state_hot_topics', group=True):
        date = format_date(key_value.key[0])
        state = key_value.key[1]
        topic = key_value.key[2]
        if date not in doc.keys():
            state_topics = {}
            topics = [{"word": topic, "num": key_value.value}]
            state_topics[state] = topics
            doc[date] = state_topics
        else:
            state_topics = doc[date]
            if state not in state_topics.keys():
                topic_list = [{"word": topic, "num": key_value.value}]
                state_topics[state] = topic_list
            else:
                topic_list = state_topics[state]
                topic_list.append({"word": topic, "num": key_value.value})
            doc[date] = state_topics
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def state_emotions(request):
    db = server['all_tweets']
    result = {}
    doc = {}
    for key_value in db.view('emotions/state_emotions', group=True):
        date = format_date(key_value.key[0])
        state = key_value.key[1]
        emotion = key_value.key[2]
        if date not in doc.keys():
            state_emotion = {}
            emotions = [{"emotion": emotion, "num": key_value.value}]
            state_emotion[state] = emotions
            doc[date] = state_emotion
        else:
            state_emotion = doc[date]
            if state not in state_emotion.keys():
                emotions = [{"emotion": emotion, "num": key_value.value}]
                state_emotion[state] = emotions
            else:
                emotions = state_emotion[state]
                emotions.append({"emotion": emotion, "num": key_value.value})
            doc[date] = state_emotion
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def state_avg_emotion(request):
    db = server['all_tweets']
    result = {}
    doc = {}
    for key_value in db.view('state_avg_emotion/state_avg_emotion', group=True):
        date = format_date(key_value.key[0])
        state = key_value.key[1]
        avg_emotion = round(key_value.value, 2)
        if date not in doc.keys():
            all_state_data = {state: avg_emotion}
            doc[date] = all_state_data
        else:
            all_state_data = doc[date]
            all_state_data[state] = avg_emotion
    result['doc'] = doc
    response = JsonResponse(result)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Credentials"] = True
    return response


def format_date(date):
    if len(str(date['day'])) == 1:
        formatted_date = str('0' + str(date['month']) + '0' + str(date['day']))
    else:
        formatted_date = str('0' + str(date['month']) + str(date['day']))
    return formatted_date
