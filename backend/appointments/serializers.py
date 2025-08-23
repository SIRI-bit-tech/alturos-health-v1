from rest_framework import serializers
from .models import Appointment, AppointmentSlot
from accounts.serializers import UserSerializer, DoctorProfileSerializer


class AppointmentSerializer(serializers.ModelSerializer):
    patient = UserSerializer(read_only=True)
    doctor = DoctorProfileSerializer(read_only=True)
    doctor_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ['id', 'appointment_id', 'qr_code', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        doctor_id = validated_data.pop('doctor_id')
        from accounts.models import DoctorProfile
        doctor = DoctorProfile.objects.get(id=doctor_id)
        validated_data['doctor'] = doctor
        return super().create(validated_data)


class AppointmentSlotSerializer(serializers.ModelSerializer):
    doctor = DoctorProfileSerializer(read_only=True)
    
    class Meta:
        model = AppointmentSlot
        fields = '__all__'


class CreateAppointmentSerializer(serializers.ModelSerializer):
    doctor_id = serializers.UUIDField()
    
    class Meta:
        model = Appointment
        fields = ['doctor_id', 'appointment_type', 'scheduled_date', 'scheduled_time', 
                 'reason_for_visit', 'notes']
    
    def create(self, validated_data):
        doctor_id = validated_data.pop('doctor_id')
        from accounts.models import DoctorProfile
        doctor = DoctorProfile.objects.get(id=doctor_id)
        validated_data['doctor'] = doctor
        validated_data['patient'] = self.context['request'].user
        return super().create(validated_data)
