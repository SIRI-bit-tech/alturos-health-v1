from django.db import models
from accounts.models import User
import uuid


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('appointment_reminder', 'Appointment Reminder'),
        ('appointment_confirmed', 'Appointment Confirmed'),
        ('appointment_cancelled', 'Appointment Cancelled'),
        ('test_results', 'Test Results Available'),
        ('prescription_ready', 'Prescription Ready'),
        ('follow_up_required', 'Follow-up Required'),
        ('system_update', 'System Update'),
    )
    
    DELIVERY_METHODS = (
        ('in_app', 'In-App'),
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    delivery_method = models.CharField(max_length=10, choices=DELIVERY_METHODS, default='in_app')
    is_read = models.BooleanField(default=False)
    is_sent = models.BooleanField(default=False)
    scheduled_for = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.recipient.get_full_name()}"


class NotificationPreference(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_preferences')
    appointment_reminders_email = models.BooleanField(default=True)
    appointment_reminders_sms = models.BooleanField(default=True)
    appointment_reminders_push = models.BooleanField(default=True)
    test_results_email = models.BooleanField(default=True)
    test_results_sms = models.BooleanField(default=False)
    test_results_push = models.BooleanField(default=True)
    prescription_updates_email = models.BooleanField(default=True)
    prescription_updates_sms = models.BooleanField(default=False)
    prescription_updates_push = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Notification Preferences - {self.user.get_full_name()}"
