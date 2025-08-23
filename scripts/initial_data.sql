-- Initial data for Alturos Health
-- Run this after Django migrations to populate basic data

-- Insert sample clinics
INSERT INTO appointments_clinic (name, address, phone, email, latitude, longitude, created_at, updated_at) VALUES
('Alturos Health Main Campus', '1000 Healthcare Blvd, Medical City, ST 12345', '(555) 100-2000', 'main@alturoshealth.com', 40.7128, -74.0060, NOW(), NOW()),
('Alturos Health Downtown', '500 Downtown Ave, Medical City, ST 12345', '(555) 100-3000', 'downtown@alturoshealth.com', 40.7589, -73.9851, NOW(), NOW()),
('Alturos Health Westside', '750 West Park Dr, Medical City, ST 12345', '(555) 100-4000', 'westside@alturoshealth.com', 40.7505, -73.9934, NOW(), NOW());

-- Insert appointment types
INSERT INTO appointments_appointmenttype (name, description, duration, price, is_active, created_at, updated_at) VALUES
('General Consultation', 'Standard consultation with primary care physician', 30, 150.00, true, NOW(), NOW()),
('Follow-up Visit', 'Follow-up appointment for ongoing treatment', 15, 75.00, true, NOW(), NOW()),
('Specialist Consultation', 'Consultation with medical specialist', 45, 250.00, true, NOW(), NOW()),
('Emergency Consultation', 'Urgent medical consultation', 60, 400.00, true, NOW(), NOW()),
('Telemedicine', 'Virtual consultation via video call', 20, 100.00, true, NOW(), NOW()),
('Annual Physical', 'Comprehensive annual health examination', 60, 300.00, true, NOW(), NOW()),
('Vaccination', 'Immunization and vaccination services', 15, 50.00, true, NOW(), NOW()),
('Lab Results Review', 'Review and discussion of laboratory results', 20, 100.00, true, NOW(), NOW());

-- Insert medical specialties
INSERT INTO accounts_specialty (name, description, created_at, updated_at) VALUES
('General Practice', 'Primary care and general medical services', NOW(), NOW()),
('Cardiology', 'Heart and cardiovascular system disorders', NOW(), NOW()),
('Dermatology', 'Skin, hair, and nail conditions', NOW(), NOW()),
('Endocrinology', 'Hormone and metabolic disorders', NOW(), NOW()),
('Gastroenterology', 'Digestive system disorders', NOW(), NOW()),
('Neurology', 'Nervous system disorders', NOW(), NOW()),
('Orthopedics', 'Musculoskeletal system disorders', NOW(), NOW()),
('Pediatrics', 'Medical care for infants, children, and adolescents', NOW(), NOW()),
('Psychiatry', 'Mental health and behavioral disorders', NOW(), NOW()),
('Radiology', 'Medical imaging and diagnostic procedures', NOW(), NOW());

-- Insert insurance providers
INSERT INTO accounts_insuranceprovider (name, contact_phone, contact_email, is_accepted, created_at, updated_at) VALUES
('Blue Cross Blue Shield', '(800) 123-4567', 'support@bcbs.com', true, NOW(), NOW()),
('Aetna', '(800) 234-5678', 'support@aetna.com', true, NOW(), NOW()),
('Cigna', '(800) 345-6789', 'support@cigna.com', true, NOW(), NOW()),
('UnitedHealthcare', '(800) 456-7890', 'support@uhc.com', true, NOW(), NOW()),
('Humana', '(800) 567-8901', 'support@humana.com', true, NOW(), NOW()),
('Kaiser Permanente', '(800) 678-9012', 'support@kp.org', true, NOW(), NOW()),
('Anthem', '(800) 789-0123', 'support@anthem.com', true, NOW(), NOW());

-- Insert notification templates
INSERT INTO notifications_notificationtemplate (name, subject, message, notification_type, is_active, created_at, updated_at) VALUES
('appointment_confirmation', 'Appointment Confirmed', 'Your appointment with Dr. {doctor_name} on {date} at {time} has been confirmed.', 'appointment', true, NOW(), NOW()),
('appointment_reminder', 'Appointment Reminder', 'Reminder: You have an appointment with Dr. {doctor_name} tomorrow at {time}.', 'appointment', true, NOW(), NOW()),
('appointment_cancelled', 'Appointment Cancelled', 'Your appointment with Dr. {doctor_name} on {date} has been cancelled.', 'appointment', true, NOW(), NOW()),
('test_results_ready', 'Test Results Available', 'Your test results from {date} are now available in your patient portal.', 'medical', true, NOW(), NOW()),
('prescription_ready', 'Prescription Ready', 'Your prescription for {medication} is ready for pickup at {pharmacy}.', 'medical', true, NOW(), NOW()),
('welcome_patient', 'Welcome to Alturos Health', 'Welcome to Alturos Health! Your patient account has been created successfully.', 'system', true, NOW(), NOW()),
('password_reset', 'Password Reset Request', 'A password reset has been requested for your account. Click the link to reset your password.', 'system', true, NOW(), NOW());

-- Insert system settings
INSERT INTO notifications_systemsetting (key, value, description, created_at, updated_at) VALUES
('appointment_reminder_hours', '24', 'Hours before appointment to send reminder', NOW(), NOW()),
('max_appointments_per_day', '20', 'Maximum appointments per doctor per day', NOW(), NOW()),
('booking_advance_days', '90', 'Maximum days in advance for booking', NOW(), NOW()),
('cancellation_hours', '24', 'Minimum hours before appointment for cancellation', NOW(), NOW()),
('telemedicine_enabled', 'true', 'Enable telemedicine appointments', NOW(), NOW()),
('emergency_contact', '(555) 911-HELP', 'Emergency contact number', NOW(), NOW()),
('support_email', 'support@alturoshealth.com', 'Support email address', NOW(), NOW()),
('business_hours_start', '08:00', 'Business hours start time', NOW(), NOW()),
('business_hours_end', '18:00', 'Business hours end time', NOW(), NOW()),
('weekend_appointments', 'false', 'Allow weekend appointments', NOW(), NOW());

-- Insert FAQ entries
INSERT INTO medical_records_faq (question, answer, category, is_published, created_at, updated_at) VALUES
('How do I book an appointment?', 'You can book an appointment through our website, mobile app, or by calling our office directly.', 'appointments', true, NOW(), NOW()),
('What insurance do you accept?', 'We accept most major insurance plans including Blue Cross Blue Shield, Aetna, Cigna, and UnitedHealthcare.', 'insurance', true, NOW(), NOW()),
('How do I access my test results?', 'Test results are available in your patient portal within 24-48 hours of completion.', 'medical_records', true, NOW(), NOW()),
('Can I have a video consultation?', 'Yes, we offer telemedicine appointments for many types of consultations.', 'telemedicine', true, NOW(), NOW()),
('What should I bring to my appointment?', 'Please bring a valid ID, insurance card, and a list of current medications.', 'appointments', true, NOW(), NOW()),
('How do I cancel or reschedule?', 'You can cancel or reschedule through your patient portal or by calling our office at least 24 hours in advance.', 'appointments', true, NOW(), NOW()),
('Are my medical records secure?', 'Yes, we use industry-standard encryption and security measures to protect your health information.', 'privacy', true, NOW(), NOW()),
('What are your office hours?', 'Our main office is open Monday-Friday 8:00 AM to 6:00 PM, with limited weekend availability.', 'general', true, NOW(), NOW());

-- Insert emergency contacts
INSERT INTO notifications_emergencycontact (name, phone, email, contact_type, is_active, created_at, updated_at) VALUES
('Emergency Services', '911', 'emergency@911.gov', 'emergency', true, NOW(), NOW()),
('Alturos Health Urgent Care', '(555) 123-URGENT', 'urgent@alturoshealth.com', 'urgent_care', true, NOW(), NOW()),
('Poison Control Center', '(800) 222-1222', 'info@poison.org', 'poison_control', true, NOW(), NOW()),
('Mental Health Crisis Line', '988', 'crisis@mentalhealth.org', 'mental_health', true, NOW(), NOW()),
('Alturos Health After Hours', '(555) 123-NIGHT', 'afterhours@alturoshealth.com', 'after_hours', true, NOW(), NOW());

COMMIT;
