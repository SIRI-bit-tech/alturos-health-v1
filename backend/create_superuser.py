#!/usr/bin/env python
"""
Script to create a Django superuser for the alturos_health project.
Run this script from the backend directory.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alturos_health.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import User

User = get_user_model()

def create_superuser():
    """Create a superuser if it doesn't exist."""
    try:
        # Check if superuser already exists
        if User.objects.filter(is_superuser=True).exists():
            print("Superuser already exists!")
            return
        
        # Create superuser
        superuser = User.objects.create_superuser(
            username='admin',
            email='admin@alturos-health.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            user_type='admin'
        )
        
        print(f"Superuser created successfully!")
        print(f"Username: {superuser.username}")
        print(f"Email: {superuser.email}")
        print(f"Password: admin123")
        print("\nYou can now log in to Django admin at http://127.0.0.1:8000/admin/")
        
    except Exception as e:
        print(f"Error creating superuser: {e}")

if __name__ == '__main__':
    create_superuser()

