"""
@author: Team18(member details are as follows)

Name(Firstname Surname)	|	Username	|	StudentID	|	City
---------------------------------------------------------------------
Chuang Wang				|	chuangw		|	791793		| Melbourne
Honglong Zhang			|	honglongz	|	985262		| Melbourne
Jingyi Li				|	jili		|	961543		| Melbourne
Wei Lin					|	wlin8		|	885536		| Melbourne
Yangyang Hu				|	Yangyangh1	|	978954		| Melbourne
"""

from django.contrib import admin
from django.urls import path
from .views import profile
from .views import hospital
from .views import school
from .views import helloworld
from .views import confirmed
from .views import confirmedAll
from .views import confirmedAllState
from .views import suburbAndEmotion
from .views import suburbAndHottopic
from .views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('profile/', profile, name='profile'),
    path('hospital/', hospital, name='hospital'),
    path('school/', school, name='school'),
    path('confirmed/', confirmed, name='confirmed'),
    path('confirmedAll/', confirmedAll, name='confirmedAll'),
    path('confirmedAllState/', confirmedAllState, name='confirmedAllState'),
    path('suburbAndEmotion/', suburbAndEmotion, name='suburbAndEmotion'),
    path('suburbAndHottopic/', suburbAndHottopic, name='suburbAndHottopic'),
    path('suburb_avg_emotion/', suburb_avg_emotion, name='suburb_avg_emotion'),
    path('state_emotions/', state_emotions, name='state_emotions'),
    path('state_hot_topics/', state_hot_topics, name='state_hot_topics'),
    path('state_avg_emotion/', state_avg_emotion, name='state_avg_emotion'),
    path('', helloworld, name='helloworld')
]
