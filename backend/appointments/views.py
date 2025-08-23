from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime, timedelta, date
from .models import Appointment, AppointmentSlot
from .serializers import AppointmentSerializer, AppointmentSlotSerializer, CreateAppointmentSerializer
from accounts.models import DoctorProfile


class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateAppointmentSerializer
        return AppointmentSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.none()


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'patient':
            return Appointment.objects.filter(patient=user)
        elif user.user_type == 'doctor':
            return Appointment.objects.filter(doctor__user=user)
        return Appointment.objects.none()


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_slots(request, doctor_id):
    try:
        doctor = DoctorProfile.objects.get(id=doctor_id)
        date_str = request.query_params.get('date')
        
        if date_str:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        else:
            date = timezone.now().date()
        
        # Get available slots for the doctor on the specified date
        slots = AppointmentSlot.objects.filter(
            doctor=doctor,
            date=date,
            is_available=True
        )
        
        serializer = AppointmentSlotSerializer(slots, many=True)
        return Response(serializer.data)
    
    except DoctorProfile.DoesNotExist:
        return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'error': 'Invalid date format'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_appointment_status(request, appointment_id):
    try:
        appointment = Appointment.objects.get(id=appointment_id)
        
        # Check permissions
        if request.user.user_type == 'doctor' and appointment.doctor.user != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        elif request.user.user_type == 'patient' and appointment.patient != request.user:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status in dict(Appointment.STATUS_CHOICES):
            appointment.status = new_status
            appointment.save()
            
            # Create notification for status change
            from notifications.models import Notification
            if request.user.user_type == 'doctor':
                recipient = appointment.patient
                message = f"Your appointment status has been updated to {appointment.get_status_display()}"
            else:
                recipient = appointment.doctor.user
                message = f"Appointment with {appointment.patient.get_full_name()} status updated to {appointment.get_status_display()}"
            
            Notification.objects.create(
                recipient=recipient,
                notification_type='appointment_confirmed',
                title='Appointment Status Update',
                message=message
            )
            
            return Response({'message': 'Status updated successfully'})
        else:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Appointment.DoesNotExist:
        return Response({'error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def doctor_today_appointments(request):
    """Get today's appointments for a specific doctor"""
    try:
        # Get date from query params or use today
        selected_date = request.GET.get('date', date.today().isoformat())
        
        # Get appointments for the specified date
        appointments = Appointment.objects.filter(
            doctor=request.user,
            appointment_date=selected_date
        ).order_by('appointment_time')
        
        serializer = AppointmentSerializer(appointments, many=True)
        return Response(serializer.data)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
