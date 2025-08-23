from django.urls import path
from . import views

urlpatterns = [
    path('clinics/', views.clinic_locations, name='clinic_locations'),
    path('nearby/', views.nearby_clinics, name='nearby_clinics'),
]
