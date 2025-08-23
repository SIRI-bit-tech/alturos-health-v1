from django.db import models
from accounts.models import User, DoctorProfile, PatientProfile
from appointments.models import Appointment
import uuid


class MedicalRecord(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_records')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='created_records')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, null=True, blank=True)
    record_type = models.CharField(max_length=50, choices=[
        ('consultation', 'Consultation'),
        ('diagnosis', 'Diagnosis'),
        ('prescription', 'Prescription'),
        ('lab_result', 'Lab Result'),
        ('imaging', 'Imaging'),
        ('vaccination', 'Vaccination'),
    ])
    title = models.CharField(max_length=200)
    description = models.TextField()
    diagnosis = models.TextField(blank=True)
    treatment_plan = models.TextField(blank=True)
    follow_up_required = models.BooleanField(default=False)
    follow_up_date = models.DateField(null=True, blank=True)
    attachments = models.FileField(upload_to='medical_records/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.patient.get_full_name()}"


class Prescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='prescribed_medications')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True, blank=True)
    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.medication_name} for {self.patient.get_full_name()}"


class LabResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_results')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='ordered_labs')
    medical_record = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, null=True, blank=True)
    test_name = models.CharField(max_length=200)
    test_type = models.CharField(max_length=100)
    result_value = models.CharField(max_length=200)
    reference_range = models.CharField(max_length=200, blank=True)
    unit = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('abnormal', 'Abnormal'),
        ('critical', 'Critical'),
    ], default='pending')
    notes = models.TextField(blank=True)
    test_date = models.DateTimeField()
    result_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.test_name} - {self.patient.get_full_name()}"
