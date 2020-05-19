from couchdb import Server

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['vic_timeline']


def suburb_avg_emotion():
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
    print(result)


def state_avg_emotion():
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
    print(result)

def format_date(date):
    if len(str(date['day'])) == 1:
        formatted_date = str('0' + str(date['month']) + '0' + str(date['day']))
    else:
        formatted_date = str('0' + str(date['month']) + str(date['day']))
    return formatted_date


