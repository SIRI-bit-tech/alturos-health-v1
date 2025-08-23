from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, PatientProfile, DoctorProfile
from .serializers import (
    UserSerializer, PatientProfileSerializer, DoctorProfileSerializer,
    RegisterSerializer, LoginSerializer
)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        
        # Get user profile data
        profile_data = None
        if user.user_type == 'patient' and hasattr(user, 'patient_profile'):
            profile_data = PatientProfileSerializer(user.patient_profile).data
        elif user.user_type == 'doctor' and hasattr(user, 'doctor_profile'):
            profile_data = DoctorProfileSerializer(user.doctor_profile).data
        
        return Response({
            'user': UserSerializer(user).data,
            'profile': profile_data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.user.user_type == 'patient':
            return PatientProfileSerializer
        elif self.request.user.user_type == 'doctor':
            return DoctorProfileSerializer
        return UserSerializer
    
    def get_object(self):
        user = self.request.user
        if user.user_type == 'patient' and hasattr(user, 'patient_profile'):
            return user.patient_profile
        elif user.user_type == 'doctor' and hasattr(user, 'doctor_profile'):
            return user.doctor_profile
        return user


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class DoctorListView(generics.ListAPIView):
    queryset = DoctorProfile.objects.filter(is_available=True)
    serializer_class = DoctorProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        specialty = self.request.query_params.get('specialty', None)
        if specialty:
            queryset = queryset.filter(specialty=specialty)
        return queryset


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def doctor_profile_view(request):
    """Get doctor profile for the authenticated user"""
    try:
        doctor = DoctorProfile.objects.get(user=request.user)
        serializer = DoctorProfileSerializer(doctor)
        return Response(serializer.data)
    except DoctorProfile.DoesNotExist:
        return Response({'error': 'Doctor profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def patient_list_view(request):
    """Get list of patients for doctors"""
    try:
        # Check if user is a doctor
        if request.user.user_type != 'doctor':
            return Response({'error': 'Access denied. Doctors only.'}, status=status.HTTP_403_FORBIDDEN)
        
        patients = PatientProfile.objects.all()
        serializer = PatientProfileSerializer(patients, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
