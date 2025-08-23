from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Clinic
from .serializers import ClinicSerializer
import math


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def clinic_locations(request):
    """Get all clinic locations"""
    try:
        clinics = Clinic.objects.all()
        serializer = ClinicSerializer(clinics, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nearby_clinics(request):
    """Get clinics near a specific location"""
    try:
        lat = float(request.GET.get('lat', 0))
        lng = float(request.GET.get('lng', 0))
        radius = float(request.GET.get('radius', 10))  # Default 10km radius
        
        if lat == 0 and lng == 0:
            return Response({'error': 'Invalid coordinates'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate distance using Haversine formula
        def haversine_distance(lat1, lng1, lat2, lng2):
            R = 6371  # Earth's radius in kilometers
            dlat = math.radians(lat2 - lat1)
            dlng = math.radians(lng2 - lng1)
            a = (math.sin(dlat/2) * math.sin(dlat/2) + 
                 math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
                 math.sin(dlng/2) * math.sin(dlng/2))
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
            return R * c
        
        # Get all clinics and filter by distance
        clinics = Clinic.objects.all()
        nearby_clinics = []
        
        for clinic in clinics:
            if clinic.coordinates and 'lat' in clinic.coordinates and 'lng' in clinic.coordinates:
                distance = haversine_distance(
                    lat, lng, 
                    clinic.coordinates['lat'], 
                    clinic.coordinates['lng']
                )
                if distance <= radius:
                    clinic_data = ClinicSerializer(clinic).data
                    clinic_data['distance'] = round(distance, 2)
                    nearby_clinics.append(clinic_data)
        
        # Sort by distance
        nearby_clinics.sort(key=lambda x: x['distance'])
        
        return Response(nearby_clinics)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
