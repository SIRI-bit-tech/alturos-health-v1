"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Heart,
  QrCode,
  Copy,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

interface Doctor {
  id: string
  name: string
  specialty: string
  rating: number
  experience: string
  image: string
  nextAvailable: string
  location: string
}

interface TimeSlot {
  time: string
  available: boolean
}

const doctors: Doctor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "General Medicine",
    rating: 4.9,
    experience: "15 years",
    image: "/professional-female-doctor.png",
    nextAvailable: "Today 2:30 PM",
    location: "Downtown Clinic",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Cardiology",
    rating: 4.8,
    experience: "12 years",
    image: "/male-cardiologist.png",
    nextAvailable: "Tomorrow 10:00 AM",
    location: "Heart Center",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialty: "Dermatology",
    rating: 4.9,
    experience: "10 years",
    image: "/professional-female-dermatologist.png",
    nextAvailable: "Today 4:00 PM",
    location: "Skin Care Clinic",
  },
]

const timeSlots: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
  { time: "3:00 PM", available: false },
  { time: "3:30 PM", available: true },
  { time: "4:00 PM", available: true },
  { time: "4:30 PM", available: true },
]

export default function BookAppointmentPage() {
  const { isAuthenticated } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentId, setAppointmentId] = useState("")
  const [patientInfo, setPatientInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    insurance: "",
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const generateAppointmentId = () => {
    const id = `ALT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
    setAppointmentId(id)
    return id
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
    if (currentStep === 4) {
      generateAppointmentId()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const copyAppointmentId = () => {
    navigator.clipboard.writeText(appointmentId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                  Alturos Health
                </h1>
                <p className="text-xs text-muted-foreground">Book Appointment</p>
              </div>
            </Link>
            <Button variant="outline" asChild>
              <Link href={isAuthenticated ? "/dashboard" : "/"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
              Book Your Appointment
            </h2>
            <Badge variant="secondary" className="px-3 py-1">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <Progress value={progress} className="h-3 mb-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>Service</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>Doctor</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>Date & Time</span>
            <span className={currentStep >= 4 ? "text-primary font-medium" : ""}>Details</span>
            <span className={currentStep >= 5 ? "text-primary font-medium" : ""}>Confirmation</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-[family-name:var(--font-heading)] text-primary">
                  Select Service Type
                </CardTitle>
                <CardDescription className="text-lg">Choose the type of medical service you need</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Medical Specialty</Label>
                    <div className="grid gap-3">
                      {[
                        "General Medicine",
                        "Cardiology",
                        "Dermatology",
                        "Pediatrics",
                        "Orthopedics",
                        "Mental Health",
                      ].map((specialty) => (
                        <button
                          key={specialty}
                          onClick={() => setSelectedSpecialty(specialty)}
                          className={`p-4 text-left border-2 rounded-lg transition-all min-h-[56px] ${
                            selectedSpecialty === specialty
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium">{specialty}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Appointment Type</Label>
                    <div className="grid gap-3">
                      {[
                        { type: "In-Person Visit", desc: "Visit our clinic location" },
                        { type: "Telehealth", desc: "Video consultation from home" },
                        { type: "Follow-up", desc: "Follow-up on previous visit" },
                        { type: "Emergency", desc: "Urgent medical attention" },
                      ].map((option) => (
                        <button
                          key={option.type}
                          onClick={() => setSelectedType(option.type)}
                          className={`p-4 text-left border-2 rounded-lg transition-all min-h-[56px] ${
                            selectedType === option.type
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="font-medium">{option.type}</div>
                          <div className="text-sm text-muted-foreground">{option.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleNext}
                    disabled={!selectedSpecialty || !selectedType}
                    size="lg"
                    className="min-h-[56px] px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Doctor Selection */}
          {currentStep === 2 && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-[family-name:var(--font-heading)] text-primary">
                  Choose Your Doctor
                </CardTitle>
                <CardDescription className="text-lg">
                  Select from our available {selectedSpecialty} specialists
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  {doctors
                    .filter((doc) => doc.specialty === selectedSpecialty || selectedSpecialty === "General Medicine")
                    .map((doctor) => (
                      <button
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-6 text-left border-2 rounded-lg transition-all min-h-[120px] ${
                          selectedDoctor?.id === doctor.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={doctor.image || "/placeholder.svg"}
                            alt={doctor.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold">{doctor.name}</h3>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{doctor.rating}</span>
                              </div>
                            </div>
                            <p className="text-muted-foreground mb-1">
                              {doctor.specialty} • {doctor.experience}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                {doctor.location}
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                Next: {doctor.nextAvailable}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} size="lg" className="min-h-[56px] px-8 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button onClick={handleNext} disabled={!selectedDoctor} size="lg" className="min-h-[56px] px-8">
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-[family-name:var(--font-heading)] text-primary">
                  Select Date & Time
                </CardTitle>
                <CardDescription className="text-lg">Choose your preferred appointment date and time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Label className="text-base font-medium">Select Date</Label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="min-h-[56px] text-lg"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-medium">Available Times</Label>
                    <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 text-center border-2 rounded-lg transition-all min-h-[56px] ${
                            selectedTime === slot.time
                              ? "border-primary bg-primary text-primary-foreground"
                              : slot.available
                                ? "border-border hover:border-primary/50"
                                : "border-border bg-muted text-muted-foreground cursor-not-allowed"
                          }`}
                        >
                          <div className="font-medium">{slot.time}</div>
                          {!slot.available && <div className="text-xs">Unavailable</div>}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} size="lg" className="min-h-[56px] px-8 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!selectedDate || !selectedTime}
                    size="lg"
                    className="min-h-[56px] px-8"
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Patient Information */}
          {currentStep === 4 && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-[family-name:var(--font-heading)] text-primary">
                  Patient Information
                </CardTitle>
                <CardDescription className="text-lg">Please provide your details for the appointment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-base font-medium">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      value={patientInfo.firstName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, firstName: e.target.value })}
                      className="min-h-[56px] text-lg"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-base font-medium">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      value={patientInfo.lastName}
                      onChange={(e) => setPatientInfo({ ...patientInfo, lastName: e.target.value })}
                      className="min-h-[56px] text-lg"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={patientInfo.email}
                      onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                      className="min-h-[56px] text-lg"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-base font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={patientInfo.phone}
                      onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                      className="min-h-[56px] text-lg"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-base font-medium">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={patientInfo.dateOfBirth}
                      onChange={(e) => setPatientInfo({ ...patientInfo, dateOfBirth: e.target.value })}
                      className="min-h-[56px] text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance" className="text-base font-medium">
                      Insurance Provider
                    </Label>
                    <select
                      id="insurance"
                      value={patientInfo.insurance}
                      onChange={(e) => setPatientInfo({ ...patientInfo, insurance: e.target.value })}
                      className="w-full p-4 border border-border rounded-lg bg-white min-h-[56px] text-lg"
                    >
                      <option value="">Select Insurance</option>
                      <option value="aetna">Aetna</option>
                      <option value="bluecross">Blue Cross Blue Shield</option>
                      <option value="cigna">Cigna</option>
                      <option value="humana">Humana</option>
                      <option value="medicare">Medicare</option>
                      <option value="medicaid">Medicaid</option>
                      <option value="uninsured">No Insurance</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={handleBack} size="lg" className="min-h-[56px] px-8 bg-transparent">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={
                      !patientInfo.firstName || !patientInfo.lastName || !patientInfo.email || !patientInfo.phone
                    }
                    size="lg"
                    className="min-h-[56px] px-8"
                  >
                    Book Appointment
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Confirmation */}
          {currentStep === 5 && (
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-3xl font-[family-name:var(--font-heading)] text-primary">
                  Appointment Confirmed!
                </CardTitle>
                <CardDescription className="text-lg">Your appointment has been successfully booked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Appointment ID */}
                <div className="bg-primary/5 rounded-lg p-6 text-center">
                  <Label className="text-sm font-medium text-muted-foreground">Your Appointment ID</Label>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <span className="text-2xl font-bold text-primary font-mono">{appointmentId}</span>
                    <Button variant="ghost" size="sm" onClick={copyAppointmentId}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Save this ID to track your appointment</p>
                </div>

                {/* Appointment Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Appointment Details</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedDoctor?.name}</p>
                          <p className="text-sm text-muted-foreground">{selectedDoctor?.specialty}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedDate}</p>
                          <p className="text-sm text-muted-foreground">{selectedTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedType}</p>
                          <p className="text-sm text-muted-foreground">{selectedDoctor?.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Patient Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">
                          {patientInfo.firstName} {patientInfo.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">{patientInfo.email}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-primary" />
                        <p className="font-medium">{patientInfo.phone}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <p className="font-medium">{patientInfo.insurance || "No Insurance"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-white border-2 border-border rounded-lg flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-16 h-16 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Scan this QR code for quick check-in at the clinic</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild className="flex-1 min-h-[56px] text-lg">
                    <Link href="/dashboard">View in Dashboard</Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1 min-h-[56px] text-lg bg-transparent">
                    <Link href={isAuthenticated ? "/dashboard" : "/"}>Back to Home</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
