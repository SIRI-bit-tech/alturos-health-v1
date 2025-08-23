from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PatientProfile, DoctorProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'user_type', 'phone_number', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = UserAdmin.fieldsets + (
        ('Health Profile', {
            'fields': ('user_type', 'phone_number', 'date_of_birth', 'address', 
                      'emergency_contact_name', 'emergency_contact_phone', 'profile_picture')
        }),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Health Profile', {
            'fields': ('user_type', 'phone_number', 'date_of_birth', 'address', 
                      'emergency_contact_name', 'emergency_contact_phone')
        }),
    )


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'medical_record_number', 'insurance_provider', 'blood_type', 'preferred_language')
    list_filter = ('blood_type', 'preferred_language', 'insurance_provider')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'medical_record_number')
    ordering = ('user__first_name', 'user__last_name')
    
    fieldsets = (
        ('Patient Information', {
            'fields': ('user', 'medical_record_number', 'insurance_provider', 'insurance_policy_number')
        }),
        ('Medical Details', {
            'fields': ('blood_type', 'allergies', 'current_medications', 'medical_history')
        }),
        ('Preferences', {
            'fields': ('preferred_language',)
        }),
    )


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'license_number', 'years_of_experience', 'consultation_fee', 'rating', 'is_available')
    list_filter = ('specialty', 'is_available', 'years_of_experience')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'license_number', 'specialty')
    ordering = ('user__first_name', 'user__last_name')
    
    fieldsets = (
        ('Doctor Information', {
            'fields': ('user', 'license_number', 'specialty', 'years_of_experience')
        }),
        ('Professional Details', {
            'fields': ('education', 'certifications', 'bio')
        }),
        ('Practice Information', {
            'fields': ('consultation_fee', 'rating', 'total_reviews', 'is_available')
        }),
    )
