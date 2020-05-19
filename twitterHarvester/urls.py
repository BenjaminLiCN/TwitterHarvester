"""twitterHarvester URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
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
    path('', helloworld, name='helloworld')
]
