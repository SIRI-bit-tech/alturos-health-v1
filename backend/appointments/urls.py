from django.urls import path
from . import views

urlpatterns = [
    path('', views.AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('<uuid:pk>/', views.AppointmentDetailView.as_view(), name='appointment_detail'),
    path('slots/<uuid:doctor_id>/', views.available_slots, name='available_slots'),
    path('<uuid:appointment_id>/status/', views.update_appointment_status, name='update_appointment_status'),
    path('doctor/today/', views.doctor_today_appointments, name='doctor_today_appointments'),
]
