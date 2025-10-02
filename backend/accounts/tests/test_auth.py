import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from accounts.models import User


@pytest.mark.django_db
def test_register_and_login_flow():
    client = APIClient()

    register_url = reverse('register')
    login_url = reverse('login')

    payload = {
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'Password123',
        'password_confirm': 'Password123',
        'first_name': 'Test',
        'last_name': 'User',
        'user_type': 'patient',
    }

    r = client.post(register_url, payload, format='json')
    assert r.status_code == 201
    assert 'access' in r.data and 'refresh' in r.data

    # Login
    r = client.post(login_url, { 'username': 'testuser', 'password': 'Password123' }, format='json')
    assert r.status_code == 200
    assert 'access' in r.data and 'refresh' in r.data


