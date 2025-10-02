'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Shield,
  Users,
  Star,
  CheckCircle,
  Heart,
  Stethoscope,
  Activity,
  UserCheck,
  ArrowRight,
  Play,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const router = useRouter();

  const handlePatientPortal = () => {
    // Check if user is logged in, if not redirect to login
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  const handleBookNow = () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/book');
    } else {
      router.push('/auth/login?redirect=/book');
    }
  };

  const handleConfirmAppointment = () => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/book');
    } else {
      router.push('/auth/login?redirect=/book');
    }
  };

  const handleEmergencyCall = () => {
    window.location.href = 'tel:555-911-HELP';
  };

  const handleFindDoctors = () => {
    router.push('/doctors');
  };

  const handleLocations = () => {
    router.push('/locations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50 w-full">
        <div className="container mx-auto px-3 py-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-primary font-[family-name:var(--font-heading)] truncate">
                  Alturos Health
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Trusted Healthcare
                </p>
              </div>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <a
                href="#services"
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                onClick={handleFindDoctors}
              >
                Services
              </a>
              <a
                href="#locations"
                className="text-foreground hover:text-primary transition-colors font-medium text-sm"
                onClick={handleLocations}
              >
                Locations
              </a>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 bg-transparent text-sm"
                onClick={() => router.push('/auth/register')}
              >
                Register
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => router.push('/auth/login?redirect=/book')}
              >
                Book Now
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 bg-transparent text-sm"
                onClick={() => router.push('/auth/register')}
              >
                Register
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-sm"
                onClick={() => router.push('/auth/login?redirect=/book')}
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center animate-pulse">
            <Stethoscope className="w-8 h-8 text-primary/30" />
          </div>
          <div className="absolute top-40 right-20 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center animate-pulse delay-1000">
            <Activity className="w-6 h-6 text-primary/30" />
          </div>
          <div className="absolute bottom-40 left-20 w-14 h-14 bg-white/10 rounded-full flex items-center justify-center animate-pulse delay-500">
            <Heart className="w-7 h-7 text-primary/30" />
          </div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-2 text-sm font-medium"
          >
            <Shield className="w-4 h-4 mr-2" />
            HIPAA Compliant & Secure
          </Badge>

          <h2 className="text-5xl md:text-7xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)] leading-tight">
            Your Health,
            <br />
            <span className="text-accent">Our Priority</span>
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience seamless telehealth and appointment management with our
            comprehensive platform designed for multi-specialty medical
            practices. Available 24/7 for your healthcare needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-10 py-8 min-h-[56px] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              onClick={handleConfirmAppointment}
            >
              <Calendar className="w-6 h-6 mr-3" />
              Book Appointment Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-10 py-8 min-h-[56px] bg-white/80 backdrop-blur-sm border-2 hover:bg-white transition-all duration-300"
              onClick={handleEmergencyCall}
            >
              <Phone className="w-6 h-6 mr-3" />
              Emergency: (555) 911-HELP
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>50,000+ Patients Served</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>4.9/5 Patient Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-primary" />
              <span>200+ Certified Doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      {isBookingOpen && (
        <section className="py-16 px-4 bg-white/70 backdrop-blur-sm border-y border-border">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-[family-name:var(--font-heading)] text-primary">
                  Book Your Appointment
                </CardTitle>
                <CardDescription className="text-lg">
                  Choose your preferred doctor and appointment time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Specialty
                    </label>
                    <select className="w-full p-4 border border-border rounded-lg bg-white min-h-[56px] text-lg">
                      <option>General Medicine</option>
                      <option>Cardiology</option>
                      <option>Dermatology</option>
                      <option>Pediatrics</option>
                      <option>Orthopedics</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Appointment Type
                    </label>
                    <select className="w-full p-4 border border-border rounded-lg bg-white min-h-[56px] text-lg">
                      <option>In-Person Visit</option>
                      <option>Telehealth Consultation</option>
                      <option>Follow-up Appointment</option>
                      <option>Emergency Consultation</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Preferred Date
                    </label>
                    <Input type="date" className="min-h-[56px] text-lg" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Preferred Time
                    </label>
                    <select className="w-full p-4 border border-border rounded-lg bg-white min-h-[56px] text-lg">
                      <option>Morning (8AM - 12PM)</option>
                      <option>Afternoon (12PM - 5PM)</option>
                      <option>Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    className="flex-1 min-h-[56px] text-lg font-medium"
                    size="lg"
                    onClick={handleConfirmAppointment}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Confirm Appointment
                  </Button>
                  <Button
                    variant="outline"
                    className="min-h-[56px] text-lg px-8 bg-transparent"
                    onClick={() => setIsBookingOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
              Comprehensive Healthcare Solutions
            </h3>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need for modern healthcare management in one
              secure, easy-to-use platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-[family-name:var(--font-heading)] mb-3">
                  Smart Appointment Booking
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Schedule appointments with your preferred doctors across
                  multiple specialties. Auto-generated appointment IDs for easy
                  tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-[family-name:var(--font-heading)] mb-3">
                  Real-time Updates
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Live appointment status, countdown timers, and instant
                  notifications. Know exactly when your doctor is ready.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl font-[family-name:var(--font-heading)] mb-3">
                  Interactive Clinic Locator
                </CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Find nearby clinics with live availability, get directions,
                  and check real-time wait times across our network.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-8 h-8 mr-3" />
                  <h4 className="text-2xl font-bold font-[family-name:var(--font-heading)]">
                    HIPAA Compliant
                  </h4>
                </div>
                <p className="text-lg opacity-90 mb-6">
                  Your medical information is protected with enterprise-grade
                  security and full HIPAA compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>End-to-end encryption</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Secure data storage</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Audit trail compliance</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 mr-3 text-primary" />
                  <h4 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-primary">
                    Patient Portal
                  </h4>
                </div>
                <p className="text-lg text-muted-foreground mb-6">
                  Access your complete medical history, test results, and
                  communicate with your healthcare team.
                </p>
                <Button
                  className="w-full min-h-[48px] text-lg"
                  onClick={handlePatientPortal}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Take a Tour
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="border-0 shadow-xl bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                Ready to Get Started?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Join thousands of patients who trust Alturos Health for their
                medical care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="text-lg px-8 py-6"
                  onClick={handlePatientPortal}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Patient Portal
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={handleFindDoctors}
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="text-xl font-bold font-[family-name:var(--font-heading)]">
                    Alturos Health
                  </h4>
                  <p className="text-xs opacity-80">
                    Trusted Healthcare Platform
                  </p>
                </div>
              </div>
              <p className="text-primary-foreground/80 leading-relaxed">
                Professional telehealth and appointment management for modern
                medical practices. Your health, our priority.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 font-[family-name:var(--font-heading)] text-lg">
                Services
              </h5>
              <ul className="space-y-3 text-primary-foreground/80">
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={handleFindDoctors}
                >
                  Telehealth Consultations
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={handleBookNow}
                >
                  Appointment Booking
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={handlePatientPortal}
                >
                  Patient Portal
                </li>
                <li className="hover:text-primary-foreground transition-colors cursor-pointer">
                  Insurance Verification
                </li>
                <li className="hover:text-primary-foreground transition-colors cursor-pointer">
                  Prescription Management
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 font-[family-name:var(--font-heading)] text-lg">
                Company
              </h5>
              <ul className="space-y-3 text-primary-foreground/80">
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/about')}
                >
                  About Us
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/help')}
                >
                  Help Center
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/contact')}
                >
                  Contact Us
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 font-[family-name:var(--font-heading)] text-lg">
                Legal
              </h5>
              <ul className="space-y-3 text-primary-foreground/80">
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/privacy')}
                >
                  Privacy Policy
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/terms')}
                >
                  Terms of Service
                </li>
                <li
                  className="hover:text-primary-foreground transition-colors cursor-pointer"
                  onClick={() => router.push('/hipaa')}
                >
                  HIPAA Notice
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 font-[family-name:var(--font-heading)] text-lg">
                Emergency Contact
              </h5>
              <div className="space-y-4">
                <div className="bg-primary-foreground/10 rounded-lg p-4">
                  <p className="font-semibold text-lg">24/7 Emergency Line</p>
                  <p className="text-2xl font-bold">(555) 911-HELP</p>
                </div>
                <div className="text-primary-foreground/80">
                  <p>support@alturoshealth.com</p>
                  <p>Live Chat Available 24/7</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 pt-8 text-center text-primary-foreground/60">
            <p>
              &copy; 2024 Alturos Health. All rights reserved. HIPAA Compliant
              Healthcare Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
