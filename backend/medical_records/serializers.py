from rest_framework import serializers
from .models import MedicalRecord, Prescription, LabResult
from accounts.serializers import UserSerializer, DoctorProfileSerializer


class MedicalRecordSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    
    class Meta:
        model = MedicalRecord
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    
    class Meta:
        model = Prescription
        fields = '__all__'


class LabResultSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    
    class Meta:
        model = LabResult
        fields = '__all__'
