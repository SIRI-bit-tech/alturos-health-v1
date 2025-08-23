"""
WSGI config for alturos_health project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'alturos_health.settings')

application = get_wsgi_application()
