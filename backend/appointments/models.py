from django.db import models
from django.utils import timezone
from accounts.models import User, DoctorProfile, PatientProfile
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image


class Appointment(models.Model):
    STATUS_CHOICES = (
        ('scheduled', 'Scheduled'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('no_show', 'No Show'),
    )
    
    APPOINTMENT_TYPES = (
        ('consultation', 'Consultation'),
        ('follow_up', 'Follow-up'),
        ('emergency', 'Emergency'),
        ('routine_checkup', 'Routine Checkup'),
        ('specialist_referral', 'Specialist Referral'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    appointment_id = models.CharField(max_length=10, unique=True, editable=False)
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='doctor_appointments')
    appointment_type = models.CharField(max_length=20, choices=APPOINTMENT_TYPES)
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='scheduled')
    reason_for_visit = models.TextField()
    notes = models.TextField(blank=True)
    qr_code = models.ImageField(upload_to='qr_codes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_date', '-scheduled_time']
    
    def save(self, *args, **kwargs):
        if not self.appointment_id:
            # Generate unique appointment ID
            import random
            import string
            self.appointment_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
        
        super().save(*args, **kwargs)
        
        # Generate QR code
        if not self.qr_code:
            qr_data = f"Appointment ID: {self.appointment_id}\nPatient: {self.patient.get_full_name()}\nDoctor: {self.doctor.user.get_full_name()}\nDate: {self.scheduled_date}\nTime: {self.scheduled_time}"
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            qr_image = qr.make_image(fill_color="black", back_color="white")
            buffer = BytesIO()
            qr_image.save(buffer, format='PNG')
            buffer.seek(0)
            
            self.qr_code.save(
                f'appointment_{self.appointment_id}_qr.png',
                File(buffer),
                save=False
            )
            super().save(update_fields=['qr_code'])
    
    def __str__(self):
        return f"Appointment {self.appointment_id} - {self.patient.get_full_name()} with Dr. {self.doctor.user.get_full_name()}"


class AppointmentSlot(models.Model):
    doctor = models.ForeignKey(DoctorProfile, on_delete=models.CASCADE, related_name='available_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['doctor', 'date', 'start_time']
        ordering = ['date', 'start_time']
    
    def __str__(self):
        return f"Dr. {self.doctor.user.get_full_name()} - {self.date} {self.start_time}-{self.end_time}"
