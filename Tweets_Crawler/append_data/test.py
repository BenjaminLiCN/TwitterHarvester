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
