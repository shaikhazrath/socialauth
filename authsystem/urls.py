
from django.urls import path
from authsystem import view
from rest_framework.authtoken import views

urlpatterns=[
    path('api-token-auth/', views.obtain_auth_token),
    path('',view.getData,name="getData"),
    path('add',view.addData,name="addtData"),
    path('register/',view.Register)
]