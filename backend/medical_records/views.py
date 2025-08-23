from rest_framework import generics, permissions
from .models import MedicalRecord, Prescription, LabResult
from .serializers import MedicalRecordSerializer, PrescriptionSerializer, LabResultSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer
from accounts.models import DoctorProfile
from django.utils import timezone
from datetime import timedelta


class MedicalRecordListView(generics.ListCreateAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return MedicalRecord.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return MedicalRecord.objects.filter(doctor__user=user)
        return MedicalRecord.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'doctor':
            serializer.save(doctor=self.request.user.doctor_profile)


class MedicalRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return MedicalRecord.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return MedicalRecord.objects.filter(doctor__user=user)
        return MedicalRecord.objects.none()


class PrescriptionListView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Prescription.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Prescription.objects.filter(doctor__user=user)
        return Prescription.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'doctor':
            serializer.save(doctor=self.request.user.doctor_profile)


class PrescriptionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PrescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Prescription.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Prescription.objects.filter(doctor__user=user)
        return Prescription.objects.none()


class LabResultListView(generics.ListCreateAPIView):
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return LabResult.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return LabResult.objects.filter(doctor__user=user)
        return LabResult.objects.none()
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'doctor':
            serializer.save(doctor=self.request.user.doctor_profile)


class LabResultDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LabResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return LabResult.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return LabResult.objects.filter(doctor__user=user)
        return LabResult.objects.none()


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_notes(request):
    """Get recent medical notes for a specific doctor"""
    doctor_id = request.GET.get('doctor_id')
    
    if not doctor_id:
        return Response({'error': 'doctor_id parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Get doctor profile
        doctor = get_object_or_404(DoctorProfile, id=doctor_id)
        
        # Get recent notes (last 30 days)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_records = MedicalRecord.objects.filter(
            doctor=doctor,
            created_at__gte=thirty_days_ago
        ).order_by('-created_at')[:10]  # Limit to 10 most recent
        
        # Format the data for frontend
        notes_data = []
        for record in recent_records:
            notes_data.append({
                'id': str(record.id),
                'patientId': str(record.patient.id),
                'patientName': f"{record.patient.first_name} {record.patient.last_name}",
                'date': record.created_at.strftime('%Y-%m-%d'),
                'diagnosis': record.diagnosis or 'No diagnosis recorded',
                'treatment': record.treatment_plan or 'No treatment plan recorded',
                'prescription': record.record_type == 'prescription' and record.description or None,
                'followUp': record.follow_up_required and record.follow_up_date.strftime('%Y-%m-%d') if record.follow_up_date else None
            })
        
        return Response(notes_data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
