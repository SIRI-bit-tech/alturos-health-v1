from django.contrib import admin
from .models import Appointment, AppointmentSlot


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('appointment_id', 'patient', 'doctor', 'appointment_type', 'scheduled_date', 'scheduled_time', 'status', 'duration_minutes')
    list_filter = ('status', 'appointment_type', 'scheduled_date', 'doctor__specialty')
    search_fields = ('appointment_id', 'patient__username', 'patient__first_name', 'patient__last_name', 
                    'doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('-scheduled_date', '-scheduled_time')
    readonly_fields = ('appointment_id', 'qr_code', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Appointment Details', {
            'fields': ('appointment_id', 'patient', 'doctor', 'appointment_type', 'status')
        }),
        ('Schedule', {
            'fields': ('scheduled_date', 'scheduled_time', 'duration_minutes')
        }),
        ('Medical Information', {
            'fields': ('reason_for_visit', 'notes')
        }),
        ('System Information', {
            'fields': ('qr_code', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['confirm_appointments', 'mark_completed', 'mark_cancelled']
    
    def confirm_appointments(self, request, queryset):
        updated = queryset.update(status='confirmed')
        self.message_user(request, f'{updated} appointments have been confirmed.')
    confirm_appointments.short_description = "Confirm selected appointments"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} appointments have been marked as completed.')
    mark_completed.short_description = "Mark selected appointments as completed"
    
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status='cancelled')
        self.message_user(request, f'{updated} appointments have been cancelled.')
    mark_cancelled.short_description = "Cancel selected appointments"


@admin.register(AppointmentSlot)
class AppointmentSlotAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'date', 'start_time', 'end_time', 'is_available')
    list_filter = ('is_available', 'date', 'doctor__specialty')
    search_fields = ('doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('date', 'start_time')
    
    fieldsets = (
        ('Slot Information', {
            'fields': ('doctor', 'date', 'start_time', 'end_time', 'is_available')
        }),
    )
    
    actions = ['make_available', 'make_unavailable']
    
    def make_available(self, request, queryset):
        updated = queryset.update(is_available=True)
        self.message_user(request, f'{updated} slots have been made available.')
    make_available.short_description = "Make selected slots available"
    
    def make_unavailable(self, request, queryset):
        updated = queryset.update(is_available=False)
        self.message_user(request, f'{updated} slots have been made unavailable.')
    make_unavailable.short_description = "Make selected slots unavailable"
