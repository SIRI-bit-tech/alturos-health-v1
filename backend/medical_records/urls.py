from django.urls import path
from . import views

urlpatterns = [
    path('', views.MedicalRecordListView.as_view(), name='medical_record_list'),
    path('<uuid:pk>/', views.MedicalRecordDetailView.as_view(), name='medical_record_detail'),
    path('prescriptions/', views.PrescriptionListView.as_view(), name='prescription_list'),
    path('prescriptions/<uuid:pk>/', views.PrescriptionDetailView.as_view(), name='prescription_detail'),
    path('lab-results/', views.LabResultListView.as_view(), name='lab_result_list'),
    path('lab-results/<uuid:pk>/', views.LabResultDetailView.as_view(), name='lab_result_detail'),
    path('notes/recent/', views.recent_notes, name='recent-notes'),
]
