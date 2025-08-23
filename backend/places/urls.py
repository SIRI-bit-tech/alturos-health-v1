from django.urls import path
from . import views

urlpatterns = [
    path('autocomplete/', views.places_autocomplete, name='places-autocomplete'),
    path('details/', views.place_details, name='place-details'),
    path('reverse-geocode/', views.reverse_geocode, name='reverse-geocode'),
]
