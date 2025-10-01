from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, PatientProfile, DoctorProfile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'user_type', 
                 'phone_number', 'date_of_birth', 'address', 'emergency_contact_name', 
                 'emergency_contact_phone', 'profile_picture', 'created_at']
        read_only_fields = ['id', 'created_at']


class PatientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientProfile
        fields = '__all__'


class DoctorProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = DoctorProfile
        fields = '__all__'


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 
                 'last_name', 'user_type', 'phone_number', 'date_of_birth']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Create profile based on user type
        if user.user_type == 'patient':
            PatientProfile.objects.create(
                user=user,
                medical_record_number=f"MRN{user.id.hex[:8].upper()}"
            )
        elif user.user_type == 'doctor':
            DoctorProfile.objects.create(user=user)
        
        return user


class LoginSerializer(serializers.Serializer):
    # Accept either username or email from the client
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField()
    
    def validate(self, attrs):
        # Prefer explicit username, but allow email too
        username_or_email = (attrs.get('username') or attrs.get('email') or "").strip()
        password = (attrs.get('password') or "").strip()
        
        if username_or_email and password:
            # Try authenticate with username first (case-insensitive)
            candidate_username = username_or_email
            try:
                # Resolve case-insensitive username to the actual stored username
                user_row = User.objects.filter(username__iexact=candidate_username).only('username').first()
                if user_row:
                    candidate_username = user_row.username
            except Exception:
                pass

            user = authenticate(username=candidate_username, password=password)
            
            # If that failed, try resolving by email
            if not user and '@' in username_or_email:
                try:
                    email_user = User.objects.get(email__iexact=username_or_email)
                    user = authenticate(username=email_user.username, password=password)
                except User.DoesNotExist:
                    user = None

            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include username and password')
