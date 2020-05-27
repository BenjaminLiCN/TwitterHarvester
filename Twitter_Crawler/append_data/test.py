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
import json

# class MyClass:
#   def myfunc(self):
#     print('hello world')
#
#
# p1 = MyClass()
# print(p1.myfunc())


a = [(0, 0), (0, 1), (1, 1), (1, 0), (0, 0)]
b = [(1, 1), (1, 2), (2, 2), (2, 1), (1, 1)]

mydic = dict(a=a, b=b)

myjson = json.dumps(mydic)
print(myjson)
