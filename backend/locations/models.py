from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class Clinic(models.Model):
    """Clinic/Location model for healthcare facilities"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    coordinates = models.JSONField(default=dict)  # {lat: float, lng: float}
    specialties = models.JSONField(default=list)  # List of specialty strings
    hours = models.JSONField(default=dict)  # {open: str, close: str}
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    availability = models.CharField(
        max_length=10,
        choices=[('high', 'High'), ('medium', 'Medium'), ('low', 'Low')],
        default='medium'
    )
    wait_time = models.IntegerField(default=0)  # Wait time in minutes
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-rating', 'name']

    def __str__(self):
        return self.name

    @property
    def latitude(self):
        return self.coordinates.get('lat', 0)

    @property
    def longitude(self):
        return self.coordinates.get('lng', 0)
