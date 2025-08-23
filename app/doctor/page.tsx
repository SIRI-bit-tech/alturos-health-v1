"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Calendar,
  Clock,
  User,
  FileText,
  Settings,
  Bell,
  Heart,
  Search,
  Plus,
  Edit,
  Send,
  CheckCircle,
  Users,
  Pill,
} from "lucide-react"
import Link from "next/link"

interface Patient {
  id: string
  name: string
  age: number
  lastVisit: string
  nextAppointment?: string
  condition: string
  status: "stable" | "needs-attention" | "critical"
  avatar?: string
}

interface Appointment {
  id: string
  patientName: string
  patientId: string
  time: string
  type: string
  status: "scheduled" | "in-progress" | "completed" | "no-show"
  duration: number
  notes?: string
}

interface MedicalNote {
  id: string
  patientId: string
  patientName: string
  date: string
  diagnosis: string
  treatment: string
  prescription?: string
  followUp?: string
}

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [doctorInfo, setDoctorInfo] = useState<any>(null)
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [recentNotes, setRecentNotes] = useState<MedicalNote[]>([])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading doctor dashboard...</p>
        </div>
      </div>
    )
  }

  // Fetch doctor information
  const fetchDoctorInfo = async () => {
    try {
      const response = await fetch('/api/accounts/doctor-profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setDoctorInfo({
          name: `Dr. ${data.user.first_name} ${data.user.last_name}`,
          specialty: data.specialty,
          license: data.license_number,
          experience: `${data.years_of_experience} years`,
          rating: data.rating,
          patientsToday: 0, // This would need to be calculated from appointments
          completedToday: 0, // This would need to be calculated from appointments
        })
      }
    } catch (error) {
      console.error('Error fetching doctor info:', error)
    }
  }

  // Fetch today's appointments
  const fetchTodayAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments/doctor/today/?date=${selectedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const formattedAppointments = data.map((apt: any) => ({
          id: apt.appointment_id,
          patientName: `${apt.patient.first_name} ${apt.patient.last_name}`,
          patientId: apt.patient.id,
          time: apt.scheduled_time,
          type: apt.appointment_type,
          status: apt.status,
          duration: apt.duration_minutes,
          notes: apt.notes || '',
        }))
        setTodayAppointments(formattedAppointments)
      }
    } catch (error) {
      console.error('Error fetching today\'s appointments:', error)
    }
  }

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/accounts/patients/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const formattedPatients = data.map((patient: any) => ({
          id: patient.id,
          name: `${patient.user.first_name} ${patient.user.last_name}`,
          age: patient.user.date_of_birth ? 
            Math.floor((new Date().getTime() - new Date(patient.user.date_of_birth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 
            'N/A',
          lastVisit: patient.last_visit || 'N/A',
          nextAppointment: patient.next_appointment || 'N/A',
          condition: patient.primary_condition || 'N/A',
          status: patient.health_status || 'stable',
        }))
        setPatients(formattedPatients)
      }
    } catch (error) {
      console.error('Error fetching patients:', error)
    }
  }

  // Fetch recent medical notes
  const fetchRecentNotes = async () => {
    try {
      const response = await fetch(`/api/medical-records/notes/recent/?doctor_id=${localStorage.getItem('user_id')}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setRecentNotes(data)
      } else {
        console.error('Error fetching recent notes:', response.status)
      }
    } catch (error) {
      console.error('Error fetching recent notes:', error)
    }
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchDoctorInfo(),
        fetchTodayAppointments(),
        fetchPatients(),
        fetchRecentNotes(),
      ])
      setIsLoading(false)
    }
    
    loadData()
  }, [selectedDate])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "no-show":
        return "bg-red-100 text-red-800"
      case "stable":
        return "bg-green-100 text-green-800"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateAppointmentStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        // Refresh appointments data
        fetchTodayAppointments()
      } else {
        console.error('Failed to update appointment status')
      }
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  const sendNotification = async (patientId: string, message: string) => {
    try {
      const response = await fetch('/api/notifications/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: patientId,
          notification_type: 'message',
          title: 'Message from Doctor',
          message: message,
          delivery_method: 'in_app'
        }),
      })
      
      if (response.ok) {
        // Notification sent successfully
      } else {
        console.error('Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending notification:', error)
    }
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
                <p className="text-xs text-muted-foreground">Doctor Portal</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="min-h-[44px] bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Alerts
              </Button>
              <Avatar className="w-10 h-10">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {doctorInfo?.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-heading)]">
            Welcome, {doctorInfo?.name}
          </h2>
          <p className="text-muted-foreground text-lg">
            {doctorInfo?.specialty} • {doctorInfo?.experience} Experience
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{doctorInfo?.patientsToday}</div>
              <div className="text-sm text-muted-foreground">Patients Today</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{doctorInfo?.completedToday}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {doctorInfo?.patientsToday - doctorInfo?.completedToday}
              </div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{doctorInfo?.rating}</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="schedule" className="min-h-[48px] text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="patients" className="min-h-[48px] text-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="notes" className="min-h-[48px] text-sm font-medium">
              <FileText className="w-4 h-4 mr-2" />
              Medical Notes
            </TabsTrigger>
            <TabsTrigger value="prescriptions" className="min-h-[48px] text-sm font-medium">
              <Pill className="w-4 h-4 mr-2" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger value="settings" className="min-h-[48px] text-sm font-medium">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Schedule Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                  Today's Schedule
                </h3>
                <p className="text-muted-foreground">{selectedDate}</p>
              </div>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="min-h-[44px]"
                />
                <Button className="min-h-[44px]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{appointment.time}</div>
                          <div className="text-xs text-muted-foreground">{appointment.duration}min</div>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">{appointment.patientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.type} • ID: {appointment.patientId}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>

                    {appointment.notes && (
                      <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{appointment.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {appointment.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => updateAppointmentStatus(appointment.id, "in-progress")}
                            className="min-h-[40px]"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Start Visit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="min-h-[40px] bg-transparent"
                            onClick={() =>
                              sendNotification(appointment.patientId, "Doctor is ready for your appointment")
                            }
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Notify Patient
                          </Button>
                        </>
                      )}
                      {appointment.status === "in-progress" && (
                        <Button
                          size="sm"
                          onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                          className="min-h-[40px]"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Visit
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="min-h-[40px] bg-transparent">
                        <User className="w-4 h-4 mr-2" />
                        View Patient
                      </Button>
                      <Button variant="outline" size="sm" className="min-h-[40px] bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Reschedule
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                Patient Management
              </h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 min-h-[44px] w-64"
                  />
                </div>
                <Button className="min-h-[44px]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Patient
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {patients
                .filter((patient) => patient.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((patient) => (
                  <Card key={patient.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-lg font-semibold">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Age: {patient.age} • ID: {patient.id}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1).replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Condition:</span>
                          <span className="font-medium">{patient.condition}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Last Visit:</span>
                          <span className="font-medium">{patient.lastVisit}</span>
                        </div>
                        {patient.nextAppointment && (
                          <div className="flex items-center justify-between text-sm">
                            <span>Next Appointment:</span>
                            <span className="font-medium">{patient.nextAppointment}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 min-h-[40px]">
                          <FileText className="w-4 h-4 mr-2" />
                          View Records
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 min-h-[40px] bg-transparent">
                          <Send className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>

          {/* Medical Notes Tab */}
          <TabsContent value="notes" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">Medical Notes</h3>
              <Button className="min-h-[44px]">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>

            {/* Add New Note Form */}
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
                  Add Medical Note
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-select">Patient</Label>
                    <select id="patient-select" className="w-full p-3 border border-border rounded-lg min-h-[44px]">
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input id="diagnosis" placeholder="Enter diagnosis" className="min-h-[44px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Plan</Label>
                  <Textarea id="treatment" placeholder="Describe treatment plan" className="min-h-[80px]" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prescription">Prescription</Label>
                    <Input id="prescription" placeholder="Medication details" className="min-h-[44px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="followup">Follow-up Instructions</Label>
                    <Input id="followup" placeholder="Follow-up details" className="min-h-[44px]" />
                  </div>
                </div>
                <Button className="w-full min-h-[48px]">
                  <FileText className="w-4 h-4 mr-2" />
                  Save Medical Note
                </Button>
              </CardContent>
            </Card>

            {/* Recent Notes */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-primary">Recent Notes</h4>
              {recentNotes.length === 0 ? (
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No recent notes available.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentNotes.map((note) => (
                    <Card key={note.id} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h5 className="text-lg font-semibold">{note.patientName}</h5>
                            <p className="text-sm text-muted-foreground">{note.date}</p>
                          </div>
                          <Button variant="outline" size="sm" className="min-h-[40px] bg-transparent">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium">Diagnosis:</p>
                            <p className="text-sm text-muted-foreground">{note.diagnosis}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Treatment:</p>
                            <p className="text-sm text-muted-foreground">{note.treatment}</p>
                          </div>
                          {note.prescription && (
                            <div>
                              <p className="text-sm font-medium">Prescription:</p>
                              <p className="text-sm text-muted-foreground">{note.prescription}</p>
                            </div>
                          )}
                          {note.followUp && (
                            <div>
                              <p className="text-sm font-medium">Follow-up:</p>
                              <p className="text-sm text-muted-foreground">{note.followUp}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                Prescription Management
              </h3>
              <Button className="min-h-[44px]">
                <Plus className="w-4 h-4 mr-2" />
                New Prescription
              </Button>
            </div>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
                  Create Prescription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rx-patient">Patient</Label>
                    <select id="rx-patient" className="w-full p-3 border border-border rounded-lg min-h-[44px]">
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Input id="medication" placeholder="Medication name" className="min-h-[44px]" />
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input id="dosage" placeholder="e.g., 10mg" className="min-h-[44px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Input id="frequency" placeholder="e.g., Daily" className="min-h-[44px]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 30 days" className="min-h-[44px]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea id="instructions" placeholder="Special instructions for patient" className="min-h-[80px]" />
                </div>
                <Button className="w-full min-h-[48px]">
                  <Pill className="w-4 h-4 mr-2" />
                  Send Prescription
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Name</p>
                      <p className="text-sm text-muted-foreground">{doctorInfo?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Specialty</p>
                      <p className="text-sm text-muted-foreground">{doctorInfo?.specialty}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">License Number</p>
                      <p className="text-sm text-muted-foreground">{doctorInfo?.license}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{doctorInfo?.experience}</p>
                    </div>
                  </div>
                  <Button className="w-full min-h-[48px]">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
                    Schedule Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Working Hours</span>
                      <span className="text-sm font-medium">9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Appointment Duration</span>
                      <span className="text-sm font-medium">30 minutes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Break Time</span>
                      <span className="text-sm font-medium">12:00 PM - 1:00 PM</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                    <Clock className="w-4 h-4 mr-2" />
                    Update Schedule
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
