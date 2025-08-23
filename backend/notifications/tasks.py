from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

from .models import Notification
from appointments.models import Appointment


@shared_task
def send_appointment_reminders():
    """Send appointment reminders 24 hours and 1 hour before appointment"""
    channel_layer = get_channel_layer()
    now = timezone.now()
    
    # 24-hour reminders
    tomorrow = now + timedelta(hours=24)
    appointments_24h = Appointment.objects.filter(
        scheduled_date=tomorrow.date(),
        status='confirmed'
    )
    
    for appointment in appointments_24h:
        # Create notification
        notification = Notification.objects.create(
            recipient=appointment.patient,
            notification_type='appointment_reminder',
            title='Appointment Reminder',
            message=f'You have an appointment tomorrow at {appointment.scheduled_time} with Dr. {appointment.doctor.user.get_full_name()}',
            delivery_method='push'
        )
        
        # Send real-time notification
        async_to_sync(channel_layer.group_send)(
            f"user_{appointment.patient.id}",
            {
                'type': 'notification_message',
                'notification': {
                    'id': str(notification.id),
                    'title': notification.title,
                    'message': notification.message,
                    'type': notification.notification_type,
                    'created_at': notification.created_at.isoformat()
                }
            }
        )
    
    # 1-hour reminders
    one_hour_later = now + timedelta(hours=1)
    appointments_1h = Appointment.objects.filter(
        scheduled_date=one_hour_later.date(),
        scheduled_time__hour=one_hour_later.hour,
        status='confirmed'
    )
    
    for appointment in appointments_1h:
        # Create notification
        notification = Notification.objects.create(
            recipient=appointment.patient,
            notification_type='appointment_reminder',
            title='Appointment Starting Soon',
            message=f'Your appointment with Dr. {appointment.doctor.user.get_full_name()} starts in 1 hour',
            delivery_method='push'
        )
        
        # Send real-time notification
        async_to_sync(channel_layer.group_send)(
            f"user_{appointment.patient.id}",
            {
                'type': 'notification_message',
                'notification': {
                    'id': str(notification.id),
                    'title': notification.title,
                    'message': notification.message,
                    'type': notification.notification_type,
                    'created_at': notification.created_at.isoformat()
                }
            }
        )


@shared_task
def send_notification_to_user(user_id, notification_data):
    """Send real-time notification to specific user"""
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"user_{user_id}",
        {
            'type': 'notification_message',
            'notification': notification_data
        }
    )


@shared_task
def broadcast_appointment_update(appointment_id, status, updated_by_id):
    """Broadcast appointment status updates to relevant users"""
    channel_layer = get_channel_layer()
    
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Notify patient
        async_to_sync(channel_layer.group_send)(
            f"appointments_{appointment.patient.id}",
            {
                'type': 'appointment_status_update',
                'appointment_id': str(appointment_id),
                'status': status,
                'updated_by': updated_by_id
            }
        )
        
        # Notify doctor
        async_to_sync(channel_layer.group_send)(
            f"appointments_{appointment.doctor.user.id}",
            {
                'type': 'appointment_status_update',
                'appointment_id': str(appointment_id),
                'status': status,
                'updated_by': updated_by_id
            }
        )
        
    except Appointment.DoesNotExist:
        pass
