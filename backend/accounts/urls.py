from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('user-profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('doctors/', views.DoctorListView.as_view(), name='doctor_list'),
    path('doctor-profile/', views.doctor_profile_view, name='doctor_profile'),
    path('patients/', views.patient_list_view, name='patient_list'),
]
