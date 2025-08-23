import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import json


@csrf_exempt
@require_http_methods(["GET"])
def places_autocomplete(request):
    """Google Places Autocomplete API endpoint"""
    query = request.GET.get('query', '')
    
    if not query or len(query) < 3:
        return JsonResponse({'predictions': []})
    
    try:
        # Get Google Places API key from environment
        api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
        if not api_key:
            return JsonResponse({'error': 'Google Places API key not configured'}, status=500)
        
        # Call Google Places Autocomplete API
        url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json'
        params = {
            'input': query,
            'key': api_key,
            'types': 'address',
            'components': 'country:us'  # Restrict to US addresses
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            # Format predictions for frontend
            predictions = []
            for prediction in data['predictions']:
                predictions.append({
                    'id': prediction['place_id'],
                    'description': prediction['description'],
                    'placeId': prediction['place_id']
                })
            
            return JsonResponse({'predictions': predictions})
        else:
            return JsonResponse({'error': f'Google Places API error: {data["status"]}'}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def place_details(request):
    """Google Places Details API endpoint"""
    place_id = request.GET.get('place_id')
    
    if not place_id:
        return JsonResponse({'error': 'place_id parameter is required'}, status=400)
    
    try:
        # Get Google Places API key from environment
        api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
        if not api_key:
            return JsonResponse({'error': 'Google Places API key not configured'}, status=500)
        
        # Call Google Places Details API
        url = 'https://maps.googleapis.com/maps/api/place/details/json'
        params = {
            'place_id': place_id,
            'key': api_key,
            'fields': 'formatted_address,geometry,name,place_id'
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            return JsonResponse(data)
        else:
            return JsonResponse({'error': f'Google Places API error: {data["status"]}'}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def reverse_geocode(request):
    """Google Geocoding API endpoint for reverse geocoding"""
    lat = request.GET.get('lat')
    lng = request.GET.get('lng')
    
    if not lat or not lng:
        return JsonResponse({'error': 'lat and lng parameters are required'}, status=400)
    
    try:
        # Get Google Places API key from environment
        api_key = os.environ.get('GOOGLE_PLACES_API_KEY')
        if not api_key:
            return JsonResponse({'error': 'Google Places API key not configured'}, status=500)
        
        # Call Google Geocoding API
        url = 'https://maps.googleapis.com/maps/api/geocode/json'
        params = {
            'latlng': f'{lat},{lng}',
            'key': api_key
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data['status'] == 'OK':
            return JsonResponse(data)
        else:
            return JsonResponse({'error': f'Google Geocoding API error: {data["status"]}'}, status=500)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
