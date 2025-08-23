import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Notification

User = get_user_model()


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        self.user_group_name = f"user_{self.user.id}"
        
        # Join user-specific group
        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send unread notification count on connect
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': unread_count
        }))
    
    async def disconnect(self, close_code):
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'mark_read':
                notification_id = text_data_json.get('notification_id')
                await self.mark_notification_read(notification_id)
            elif message_type == 'get_notifications':
                notifications = await self.get_recent_notifications()
                await self.send(text_data=json.dumps({
                    'type': 'notifications_list',
                    'notifications': notifications
                }))
        except json.JSONDecodeError:
            pass
    
    async def notification_message(self, event):
        """Handle notification messages sent to the group"""
        await self.send(text_data=json.dumps({
            'type': 'new_notification',
            'notification': event['notification']
        }))
    
    async def appointment_update(self, event):
        """Handle appointment status updates"""
        await self.send(text_data=json.dumps({
            'type': 'appointment_update',
            'appointment': event['appointment']
        }))
    
    @database_sync_to_async
    def get_unread_count(self):
        return Notification.objects.filter(
            recipient=self.user,
            is_read=False
        ).count()
    
    @database_sync_to_async
    def mark_notification_read(self, notification_id):
        try:
            notification = Notification.objects.get(
                id=notification_id,
                recipient=self.user
            )
            notification.is_read = True
            notification.save()
            return True
        except Notification.DoesNotExist:
            return False
    
    @database_sync_to_async
    def get_recent_notifications(self):
        notifications = Notification.objects.filter(
            recipient=self.user
        ).order_by('-created_at')[:20]
        
        return [{
            'id': str(notification.id),
            'title': notification.title,
            'message': notification.message,
            'notification_type': notification.notification_type,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat(),
        } for notification in notifications]


class AppointmentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        
        if self.user.is_anonymous:
            await self.close()
            return
        
        # Join appointment updates group
        self.appointments_group_name = f"appointments_{self.user.id}"
        
        await self.channel_layer.group_add(
            self.appointments_group_name,
            self.channel_name
        )
        
        await self.accept()
    
    async def disconnect(self, close_code):
        if hasattr(self, 'appointments_group_name'):
            await self.channel_layer.group_discard(
                self.appointments_group_name,
                self.channel_name
            )
    
    async def receive(self, text_data):
        try:
            text_data_json = json.loads(text_data)
            message_type = text_data_json.get('type')
            
            if message_type == 'update_status':
                appointment_id = text_data_json.get('appointment_id')
                new_status = text_data_json.get('status')
                await self.update_appointment_status(appointment_id, new_status)
        except json.JSONDecodeError:
            pass
    
    async def appointment_status_update(self, event):
        """Handle appointment status updates"""
        await self.send(text_data=json.dumps({
            'type': 'status_update',
            'appointment_id': event['appointment_id'],
            'status': event['status'],
            'updated_by': event['updated_by']
        }))
    
    async def appointment_reminder(self, event):
        """Handle appointment reminders"""
        await self.send(text_data=json.dumps({
            'type': 'reminder',
            'appointment': event['appointment'],
            'message': event['message']
        }))
    
    @database_sync_to_async
    def update_appointment_status(self, appointment_id, new_status):
        try:
            from appointments.models import Appointment
            appointment = Appointment.objects.get(id=appointment_id)
            
            # Check permissions
            if (self.user.user_type == 'doctor' and appointment.doctor.user == self.user) or \
               (self.user.user_type == 'patient' and appointment.patient == self.user):
                appointment.status = new_status
                appointment.save()
                return True
            return False
        except Appointment.DoesNotExist:
            return False
