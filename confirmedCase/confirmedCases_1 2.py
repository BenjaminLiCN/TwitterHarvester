

with open("0404.csv", 'r', encoding='utf-8') as f:
    lines = f.readlines()
    new_Json = {}
    hospital_Json = {}
    hospital_Json['date'] = '0404'
    school_list = []
    for line in lines:
        #print(len(line))
        if len(line)<=1:
            continue
        lineList = line.split(",")
        doc = {}
        doc['Suburb'] = lineList[0].strip()
        doc['cases'] = float(lineList[1].strip())
        school_list.append(doc)
    hospital_Json['doc'] = school_list

    # print(new_Json)
    print(hospital_Json)
    #db.save(hospital_Json)