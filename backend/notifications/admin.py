from django.contrib import admin
from .models import Notification, NotificationPreference


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('title', 'recipient', 'notification_type', 'delivery_method', 'is_read', 'is_sent', 'created_at')
    list_filter = ('notification_type', 'delivery_method', 'is_read', 'is_sent', 'created_at')
    search_fields = ('title', 'message', 'recipient__username', 'recipient__first_name', 'recipient__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'sent_at')
    
    fieldsets = (
        ('Notification Content', {
            'fields': ('title', 'message', 'notification_type')
        }),
        ('Recipient & Delivery', {
            'fields': ('recipient', 'delivery_method', 'scheduled_for')
        }),
        ('Status', {
            'fields': ('is_read', 'is_sent', 'sent_at')
        }),
        ('System Information', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_unread', 'mark_as_sent', 'mark_as_unsent']
    
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} notifications have been marked as read.')
    mark_as_read.short_description = "Mark selected notifications as read"
    
    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} notifications have been marked as unread.')
    mark_as_unread.short_description = "Mark selected notifications as unread"
    
    def mark_as_sent(self, request, queryset):
        updated = queryset.update(is_sent=True)
        self.message_user(request, f'{updated} notifications have been marked as sent.')
    mark_as_sent.short_description = "Mark selected notifications as sent"
    
    def mark_as_unsent(self, request, queryset):
        updated = queryset.update(is_sent=False)
        self.message_user(request, f'{updated} notifications have been marked as unsent.')
    mark_as_unsent.short_description = "Mark selected notifications as unsent"


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    list_display = ('user', 'appointment_reminders_email', 'appointment_reminders_sms', 'appointment_reminders_push')
    list_filter = ('appointment_reminders_email', 'appointment_reminders_sms', 'appointment_reminders_push')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')
    ordering = ('user__first_name', 'user__last_name')
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Appointment Reminders', {
            'fields': ('appointment_reminders_email', 'appointment_reminders_sms', 'appointment_reminders_push')
        }),
        ('Test Results', {
            'fields': ('test_results_email', 'test_results_sms', 'test_results_push')
        }),
        ('Prescription Updates', {
            'fields': ('prescription_updates_email', 'prescription_updates_sms', 'prescription_updates_push')
        }),
        ('Marketing', {
            'fields': ('marketing_emails',)
        }),
    )
