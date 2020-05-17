from couchdb import Server
import operator
# for key_value in db.view('state/suburb-view', group=True):
#     single_result = {}
#     single_result['date'] = str('0'+str(key_value.key[2]['month'])+str(key_value.key[2]['day']))
#     single_result['state'] = key_value.key[0]
#     single_result['suburb'] = key_value.key[1]
#     single_result['emotion'] = key_value.key[3]
#     single_result['num'] = key_value.value
#     resultlist.append(single_result)
# result['doc'] = resultlist
# print(result)

server = Server('http://admin:password@172.26.131.49:5984//')
db = server['all_tweets']
result = {}
resultlist = []
doc = {}
dateDict = {}
for key_value in db.view('state/suburb-view', group=True):
    single_result = {}
    mydate = str('0'+str(key_value.key[2]['month'])+str(key_value.key[2]['day']))
    suburb = key_value.key[1]
    if mydate in doc.keys():
        dateDict = doc[mydate]
        #print(dateDict)
        if suburb in dateDict.keys():
            suburbList = dateDict[suburb]
            single_result['emotion'] = key_value.key[3]
            single_result['num'] = key_value.value
            suburbList.append(single_result)
            dateDict[suburb] = suburbList
        else:
            suburbList = []
            single_result['emotion'] = key_value.key[3]
            single_result['num'] = key_value.value
            suburbList.append(single_result)
            dateDict[suburb] = suburbList
        doc[mydate] = dateDict
    else:
        suburbList = []
        single_result['emotion'] = key_value.key[3]
        single_result['num'] = key_value.value
        suburbList.append(single_result)
        dateDict[suburb] = suburbList
        #dateList = []
        #dateList.append(dateDict)
        doc[mydate] = dateDict

# server = Server('http://admin:password@172.26.131.49:5984//')
# db = server['all_tweets']
# result = {}
# resultlist = []
# doc = {}
# for key_value in db.view('state/suburb-view', group=True):
#     single_result = {}
#     mydate = str('0'+str(key_value.key[2]['month'])+str(key_value.key[2]['day']))
#
#     if mydate in doc.keys():
#         single_result['state'] = key_value.key[0]
#         single_result['suburb'] = key_value.key[1]
#         single_result['emotion'] = key_value.key[3]
#         single_result['num'] = key_value.value
#
#         dateList =doc[mydate]
#         dateList.append(single_result)
#         doc[mydate] = dateList
#     else:
#         dateList =[]
#         single_result['suburb'] = key_value.key[0]
#         single_result['word'] = key_value.key[2]
#         single_result['num'] = key_value.value
#         dateList.append(single_result)
#         doc[mydate] = dateList
#     #single_result['date'] = str('0'+str(key_value.key[1]['month'])+str(key_value.key[1]['day']))
#
#     #resultlist.append(single_result)
# result['doc'] = doc
# print(result)

# server = Server('http://admin:password@172.26.131.49:5984//')
# db = server['all_tweets']
# result = {}
# resultlist = []
# doc = {}
# dateDict = {}
# for key_value in db.view('hottopic/hottopic-view', group=True):
#     single_result = {}
#     mydate = str('0'+str(key_value.key[1]['month'])+str(key_value.key[1]['day']))
#     suburb = key_value.key[0]
#     if mydate in doc.keys():
#         dateDict = doc[mydate]
#         #print(dateDict)
#         if suburb in dateDict.keys():
#             suburbList = dateDict[suburb]
#             single_result['word'] = key_value.key[2]
#             single_result['num'] = key_value.value
#             suburbList.append(single_result)
#             dateDict[suburb] = suburbList
#         else:
#             suburbList = []
#             single_result['word'] = key_value.key[2]
#             single_result['num'] = key_value.value
#             suburbList.append(single_result)
#             dateDict[suburb] = suburbList
#         doc[mydate] = dateDict
#     else:
#         suburbList = []
#         single_result['word'] = key_value.key[2]
#         single_result['num'] = key_value.value
#         suburbList.append(single_result)
#         dateDict[suburb] = suburbList
#         #dateList = []
#         #dateList.append(dateDict)
#         doc[mydate] = dateDict
    #single_result['date'] = str('0'+str(key_value.key[1]['month'])+str(key_value.key[1]['day']))

    #resultlist.append(single_result)
result['doc'] = doc
print(result)


# for key_value in db.view('state/suburb-view', group=True):
#     single_result = {}
#     single_result['date'] = str('0'+str(key_value.key[2]['month'])+str(key_value.key[2]['day']))
#     single_result['state'] = key_value.key[0]
#     single_result['suburb'] = key_value.key[1]
#     single_result['emotion'] = key_value.key[3]
#     single_result['num'] = key_value.value
#     resultlist.append(single_result)
# result['doc'] = resultlist
# print(result)

# server = Server('http://admin:password@172.26.131.49:5984/')
# db = server['twitter']
# hashtag_dic = {}
# for key_value in db.view('hottopic/hottopic-view',group = True):
#     hashtag_dic[key_value.key] = key_value.value
#     #print(key_value.key, key_value.value)
# sorted_x = sorted(hashtag_dic.items(), key=operator.itemgetter(1),reverse=True)
# print(sorted_x)


# hospital_json = db['c12415e43341f595eac3f83c5201be97']
# print(hospital_json)