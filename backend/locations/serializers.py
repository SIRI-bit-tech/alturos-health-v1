from rest_framework import serializers
from .models import Clinic


class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = [
            'id', 'name', 'address', 'phone', 'coordinates', 
            'specialties', 'hours', 'rating', 'availability', 
            'wait_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
