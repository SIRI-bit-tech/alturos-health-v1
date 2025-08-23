from django.contrib import admin
from .models import MedicalRecord, Prescription, LabResult


@admin.register(MedicalRecord)
class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('title', 'patient', 'doctor', 'record_type', 'created_at', 'follow_up_required')
    list_filter = ('record_type', 'follow_up_required', 'created_at', 'doctor__specialty')
    search_fields = ('title', 'patient__username', 'patient__first_name', 'patient__last_name', 
                    'doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Record Information', {
            'fields': ('title', 'record_type', 'description', 'diagnosis', 'treatment_plan')
        }),
        ('Patient & Doctor', {
            'fields': ('patient', 'doctor', 'appointment')
        }),
        ('Follow-up', {
            'fields': ('follow_up_required', 'follow_up_date')
        }),
        ('Attachments', {
            'fields': ('attachments',)
        }),
        ('System Information', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('medication_name', 'patient', 'doctor', 'dosage', 'frequency', 'start_date', 'is_active')
    list_filter = ('is_active', 'start_date', 'doctor__specialty')
    search_fields = ('medication_name', 'patient__username', 'patient__first_name', 'patient__last_name', 
                    'doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('-start_date',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Medication Information', {
            'fields': ('medication_name', 'dosage', 'frequency', 'duration', 'instructions')
        }),
        ('Patient & Doctor', {
            'fields': ('patient', 'doctor', 'medical_record')
        }),
        ('Timing', {
            'fields': ('start_date', 'end_date', 'is_active')
        }),
        ('System Information', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['activate_prescriptions', 'deactivate_prescriptions']
    
    def activate_prescriptions(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} prescriptions have been activated.')
    activate_prescriptions.short_description = "Activate selected prescriptions"
    
    def deactivate_prescriptions(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f'{updated} prescriptions have been deactivated.')
    deactivate_prescriptions.short_description = "Deactivate selected prescriptions"


@admin.register(LabResult)
class LabResultAdmin(admin.ModelAdmin):
    list_display = ('test_name', 'patient', 'doctor', 'test_type', 'status', 'test_date', 'result_date')
    list_filter = ('status', 'test_type', 'test_date', 'doctor__specialty')
    search_fields = ('test_name', 'patient__username', 'patient__first_name', 'patient__last_name', 
                    'doctor__user__username', 'doctor__user__first_name', 'doctor__user__last_name')
    ordering = ('-test_date',)
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Test Information', {
            'fields': ('test_name', 'test_type', 'result_value', 'reference_range', 'unit', 'status')
        }),
        ('Patient & Doctor', {
            'fields': ('patient', 'doctor', 'medical_record')
        }),
        ('Results & Notes', {
            'fields': ('notes',)
        }),
        ('Timing', {
            'fields': ('test_date', 'result_date')
        }),
        ('System Information', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_completed', 'mark_abnormal', 'mark_critical']
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} lab results have been marked as completed.')
    mark_completed.short_description = "Mark selected lab results as completed"
    
    def mark_abnormal(self, request, queryset):
        updated = queryset.update(status='abnormal')
        self.message_user(request, f'{updated} lab results have been marked as abnormal.')
    mark_abnormal.short_description = "Mark selected lab results as abnormal"
    
    def mark_critical(self, request, queryset):
        updated = queryset.update(status='critical')
        self.message_user(request, f'{updated} lab results have been marked as critical.')
    mark_critical.short_description = "Mark selected lab results as critical"
