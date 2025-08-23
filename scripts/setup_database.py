#!/usr/bin/env python
"""
Database setup script for Alturos Health
Run this script to create initial database structure and sample data
"""

import os
import sys
import django
from django.core.management import execute_from_command_line

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alturos_health.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import UserProfile, Doctor, Patient
from appointments.models import Appointment, AppointmentType, Clinic
from medical_records.models import MedicalRecord, Prescription, TestResult
from notifications.models import Notification
from django.utils import timezone
from datetime import datetime, timedelta
import random

User = get_user_model()

def create_sample_data():
    """Create sample data for development and testing"""
    
    print("Creating sample data...")
    
    # Create superuser if it doesn't exist
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@alturoshealth.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print("✓ Created admin user")
    
    # Create sample doctors
    doctors_data = [
        {
            'username': 'dr_chen',
            'email': 'michael.chen@alturoshealth.com',
            'first_name': 'Michael',
            'last_name': 'Chen',
            'specialty': 'Cardiology',
            'license_number': 'MD123456',
            'phone': '(555) 123-4567'
        },
        {
            'username': 'dr_rodriguez',
            'email': 'maria.rodriguez@alturoshealth.com',
            'first_name': 'Maria',
            'last_name': 'Rodriguez',
            'specialty': 'Dermatology',
            'license_number': 'MD789012',
            'phone': '(555) 234-5678'
        },
        {
            'username': 'dr_patel',
            'email': 'raj.patel@alturoshealth.com',
            'first_name': 'Raj',
            'last_name': 'Patel',
            'specialty': 'General Practice',
            'license_number': 'MD345678',
            'phone': '(555) 345-6789'
        }
    ]
    
    for doctor_data in doctors_data:
        if not User.objects.filter(username=doctor_data['username']).exists():
            user = User.objects.create_user(
                username=doctor_data['username'],
                email=doctor_data['email'],
                password='doctor123',
                first_name=doctor_data['first_name'],
                last_name=doctor_data['last_name']
            )
            
            profile = UserProfile.objects.create(
                user=user,
                role='doctor',
                phone=doctor_data['phone']
            )
            
            Doctor.objects.create(
                user=user,
                specialty=doctor_data['specialty'],
                license_number=doctor_data['license_number'],
                years_of_experience=random.randint(5, 20),
                rating=round(random.uniform(4.0, 5.0), 1)
            )
            print(f"✓ Created doctor: Dr. {doctor_data['first_name']} {doctor_data['last_name']}")
    
    # Create sample patients
    patients_data = [
        {
            'username': 'sarah_johnson',
            'email': 'sarah.johnson@email.com',
            'first_name': 'Sarah',
            'last_name': 'Johnson',
            'phone': '(555) 456-7890',
            'date_of_birth': '1985-03-15',
            'address': '123 Main St, Anytown, ST 12345'
        },
        {
            'username': 'john_smith',
            'email': 'john.smith@email.com',
            'first_name': 'John',
            'last_name': 'Smith',
            'phone': '(555) 567-8901',
            'date_of_birth': '1978-07-22',
            'address': '456 Oak Ave, Somewhere, ST 67890'
        },
        {
            'username': 'emily_davis',
            'email': 'emily.davis@email.com',
            'first_name': 'Emily',
            'last_name': 'Davis',
            'phone': '(555) 678-9012',
            'date_of_birth': '1992-11-08',
            'address': '789 Pine Rd, Elsewhere, ST 54321'
        }
    ]
    
    for patient_data in patients_data:
        if not User.objects.filter(username=patient_data['username']).exists():
            user = User.objects.create_user(
                username=patient_data['username'],
                email=patient_data['email'],
                password='patient123',
                first_name=patient_data['first_name'],
                last_name=patient_data['last_name']
            )
            
            profile = UserProfile.objects.create(
                user=user,
                role='patient',
                phone=patient_data['phone']
            )
            
            Patient.objects.create(
                user=user,
                date_of_birth=patient_data['date_of_birth'],
                address=patient_data['address'],
                emergency_contact_name=f"{patient_data['first_name']} Emergency Contact",
                emergency_contact_phone='(555) 999-0000'
            )
            print(f"✓ Created patient: {patient_data['first_name']} {patient_data['last_name']}")
    
    # Create clinics
    clinics_data = [
        {
            'name': 'Alturos Health Main Campus',
            'address': '1000 Healthcare Blvd, Medical City, ST 12345',
            'phone': '(555) 100-2000',
            'latitude': 40.7128,
            'longitude': -74.0060
        },
        {
            'name': 'Alturos Health Downtown',
            'address': '500 Downtown Ave, Medical City, ST 12345',
            'phone': '(555) 100-3000',
            'latitude': 40.7589,
            'longitude': -73.9851
        }
    ]
    
    for clinic_data in clinics_data:
        if not Clinic.objects.filter(name=clinic_data['name']).exists():
            Clinic.objects.create(**clinic_data)
            print(f"✓ Created clinic: {clinic_data['name']}")
    
    # Create appointment types
    appointment_types = [
        {'name': 'General Consultation', 'duration': 30, 'price': 150.00},
        {'name': 'Follow-up Visit', 'duration': 15, 'price': 75.00},
        {'name': 'Specialist Consultation', 'duration': 45, 'price': 250.00},
        {'name': 'Emergency Consultation', 'duration': 60, 'price': 400.00},
        {'name': 'Telemedicine', 'duration': 20, 'price': 100.00}
    ]
    
    for apt_type in appointment_types:
        if not AppointmentType.objects.filter(name=apt_type['name']).exists():
            AppointmentType.objects.create(**apt_type)
            print(f"✓ Created appointment type: {apt_type['name']}")
    
    # Create sample appointments
    doctors = Doctor.objects.all()
    patients = Patient.objects.all()
    clinics = Clinic.objects.all()
    apt_types = AppointmentType.objects.all()
    
    if doctors and patients and clinics and apt_types:
        for i in range(10):
            appointment_date = timezone.now() + timedelta(days=random.randint(1, 30))
            
            appointment = Appointment.objects.create(
                patient=random.choice(patients),
                doctor=random.choice(doctors),
                clinic=random.choice(clinics),
                appointment_type=random.choice(apt_types),
                scheduled_time=appointment_date,
                status=random.choice(['scheduled', 'confirmed', 'completed']),
                notes=f"Sample appointment {i+1}"
            )
            print(f"✓ Created appointment: {appointment.appointment_id}")
    
    print("\n🎉 Sample data creation completed!")
    print("\nLogin credentials:")
    print("Admin: admin / admin123")
    print("Doctor: dr_chen / doctor123")
    print("Patient: sarah_johnson / patient123")

def run_migrations():
    """Run Django migrations"""
    print("Running database migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    execute_from_command_line(['manage.py', 'migrate'])
    print("✓ Migrations completed")

def main():
    """Main setup function"""
    print("🏥 Alturos Health Database Setup")
    print("=" * 40)
    
    try:
        run_migrations()
        create_sample_data()
        
        print("\n✅ Database setup completed successfully!")
        print("\nNext steps:")
        print("1. Start the Django server: python manage.py runserver")
        print("2. Start the frontend: npm run dev")
        print("3. Visit http://localhost:3000 to access the application")
        
    except Exception as e:
        print(f"\n❌ Error during setup: {str(e)}")
        sys.exit(1)

if __name__ == '__main__':
    main()
