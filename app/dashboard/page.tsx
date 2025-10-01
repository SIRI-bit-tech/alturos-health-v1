"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AppointmentTracker } from "@/components/appointment-tracker"
import { useAuth } from "@/hooks/use-auth"
import { appointmentsApi, medicalRecordsApi, notificationsApi } from "@/lib/api"
import {
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  Bell,
  Heart,
  Phone,
  MapPin,
  Download,
  MessageSquare,
  Activity,
  Shield,
  CreditCard,
  CheckCircle,
  Stethoscope,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Appointment {
  id: string
  appointment_id: string
  doctor: {
    user: {
      first_name: string
      last_name: string
    }
    specialty: string
  }
  scheduled_date: string
  scheduled_time: string
  appointment_type: string
  status: string
  reason_for_visit: string
}

interface MedicalRecord {
  id: string
  created_at: string
  doctor: {
    user: {
      first_name: string
      last_name: string
    }
  }
  title: string
  description: string
  record_type: string
}

interface Notification {
  id: string
  title: string
  message: string
  notification_type: string
  is_read: boolean
  created_at: string
}

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, profile, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // Wait for auth to resolve before deciding to redirect
      if (authLoading) {
        return
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      try {
        setIsLoading(true)

        // Fetch appointments
        const appointmentsResult = await appointmentsApi.getAppointments()
        if (appointmentsResult.data) {
          setAppointments(appointmentsResult.data.results || appointmentsResult.data)
        }

        // Fetch medical records
        const recordsResult = await medicalRecordsApi.getMedicalRecords()
        if (recordsResult.data) {
          setMedicalRecords(recordsResult.data.results || recordsResult.data)
        }

        // Fetch notifications
        const notificationsResult = await notificationsApi.getNotifications()
        if (notificationsResult.data) {
          setNotifications(notificationsResult.data.results || notificationsResult.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router, authLoading])

  const handleLogout = async () => {
    await logout()
    router.push("/auth/login")
  }

  const upcomingAppointments = appointments.filter((apt) => ["scheduled", "confirmed"].includes(apt.status)).slice(0, 2)

  const recentAppointments = appointments.filter((apt) => apt.status === "completed").slice(0, 3)

  const unreadMessages = notifications.filter((notif) => !notif.is_read)

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378] flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-lg text-primary">Loading your dashboard...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
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
                <p className="text-xs text-muted-foreground">Patient Portal</p>
              </div>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="min-h-[44px] bg-transparent relative">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                {unreadMessages.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {unreadMessages.length}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={user.profile_picture || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.first_name?.[0]}
                    {user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-heading)]">
            Welcome back, {user.first_name || user.username}!
          </h2>
          <p className="text-muted-foreground text-lg">Manage your healthcare journey from one secure dashboard</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="min-h-[48px] text-sm font-medium">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="appointments" className="min-h-[48px] text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="records" className="min-h-[48px] text-sm font-medium">
              <FileText className="w-4 h-4 mr-2" />
              Medical Records
            </TabsTrigger>
            <TabsTrigger value="messages" className="min-h-[48px] text-sm font-medium">
              <MessageSquare className="w-4 h-4 mr-2" />
              Messages
              {unreadMessages.length > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadMessages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="min-h-[48px] text-sm font-medium">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Next Appointment */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Next Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold">
                          Dr. {upcomingAppointments[0].doctor.user.first_name}{" "}
                          {upcomingAppointments[0].doctor.user.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{upcomingAppointments[0].doctor.specialty}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm">
                          {upcomingAppointments[0].scheduled_date} at {upcomingAppointments[0].scheduled_time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span className="text-sm">{upcomingAppointments[0].appointment_type}</span>
                      </div>
                      <Button size="sm" className="w-full min-h-[40px]">
                        View Details
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No upcoming appointments</p>
                      <Button size="sm" className="mt-2" asChild>
                        <Link href="/book">Book Appointment</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Medical Records */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Recent Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medicalRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{record.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {record.record_type}
                        </Badge>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full min-h-[40px] bg-transparent">
                      View All Records
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Health Summary */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
                    <Stethoscope className="w-5 h-5 mr-2" />
                    Health Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Appointments</span>
                      <span className="text-sm font-medium">{appointments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Medical Records</span>
                      <span className="text-sm font-medium">{medicalRecords.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Upcoming</span>
                      <span className="text-sm font-medium">{upcomingAppointments.length}</span>
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">Account active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button asChild className="min-h-[56px] flex-col space-y-2">
                    <Link href="/book">
                      <Calendar className="w-6 h-6" />
                      <span>Book Appointment</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="min-h-[56px] flex-col space-y-2 bg-transparent">
                    <Phone className="w-6 h-6" />
                    <span>Call Clinic</span>
                  </Button>
                  <Button variant="outline" className="min-h-[56px] flex-col space-y-2 bg-transparent">
                    <MessageSquare className="w-6 h-6" />
                    <span>Send Message</span>
                  </Button>
                  <Button variant="outline" className="min-h-[56px] flex-col space-y-2 bg-transparent">
                    <Download className="w-6 h-6" />
                    <span>Download Records</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Appointment Tracker */}
            {upcomingAppointments.length > 0 && (
              <AppointmentTracker appointmentId={upcomingAppointments[0].appointment_id} />
            )}
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Upcoming Appointments
                  </CardTitle>
                  <CardDescription>Your scheduled appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                        </div>
                        <Badge variant="outline">{appointment.appointment_type}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {appointment.scheduled_date} at {appointment.scheduled_time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{appointment.reason_for_visit}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 min-h-[40px]">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 min-h-[40px] bg-transparent">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button asChild className="w-full min-h-[48px]">
                    <Link href="/book">Book New Appointment</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Appointments */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Recent Appointments
                  </CardTitle>
                  <CardDescription>Your appointment history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            Dr. {appointment.doctor.user.first_name} {appointment.doctor.user.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{appointment.doctor.specialty}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{appointment.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>
                            {appointment.scheduled_date} at {appointment.scheduled_time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <FileText className="w-4 h-4 text-primary" />
                          <span>{appointment.reason_for_visit}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full min-h-[40px] bg-transparent">
                        View Summary
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medical Records Tab */}
          <TabsContent value="records" className="space-y-6">
            <div className="grid gap-6">
              {/* Medical History */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Medical History
                  </CardTitle>
                  <CardDescription>Your complete medical records and visit summaries</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{record.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(record.created_at).toLocaleDateString()} • Dr. {record.doctor.user.first_name}{" "}
                            {record.doctor.user.last_name}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="min-h-[40px] bg-transparent" asChild>
                          <Link href={`/medical-records/${record.id}`}>
                            <FileText className="w-4 h-4 mr-2" />
                            View
                          </Link>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Type:</p>
                          <p className="text-sm text-muted-foreground">{record.record_type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Description:</p>
                          <p className="text-sm text-muted-foreground">{record.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">Messages</CardTitle>
                <CardDescription>Communications from your healthcare team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border border-border rounded-lg p-4 space-y-3 ${
                      !notification.is_read ? "bg-primary/5 border-primary/20" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-semibold">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="min-h-[40px] bg-transparent">
                      Read Message
                    </Button>
                  </div>
                ))}
                <Button className="w-full min-h-[48px]">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Compose New Message
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Personal Information
                  </CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Full Name</p>
                      <p className="text-sm text-muted-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{user.phone_number || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Date of Birth</p>
                      <p className="text-sm text-muted-foreground">{user.date_of_birth || "Not provided"}</p>
                    </div>
                    {profile?.emergency_contact_name && (
                      <div>
                        <p className="text-sm font-medium">Emergency Contact</p>
                        <p className="text-sm text-muted-foreground">
                          {profile.emergency_contact_name} - {profile.emergency_contact_phone}
                        </p>
                      </div>
                    )}
                  </div>
                  <Button className="w-full min-h-[48px]">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Insurance Information
                  </CardTitle>
                  <CardDescription>Your insurance coverage details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium">Insurance Provider</p>
                      <p className="text-sm text-muted-foreground">{profile?.insurance_provider || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Policy Number</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {profile?.insurance_policy_number || "Not provided"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Account Active</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Update Insurance
                  </Button>
                </CardContent>
              </Card>

              {/* Privacy & Security */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Privacy & Security
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Two-Factor Authentication</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email Notifications</span>
                      <Badge variant="secondary">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Notifications</span>
                      <Badge variant="secondary">On</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                      <Bell className="w-4 h-4 mr-2" />
                      Notification Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                    Support & Help
                  </CardTitle>
                  <CardDescription>Get help when you need it</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Help Center
                    </Button>
                    <Button variant="outline" className="w-full min-h-[48px] bg-transparent">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Policy
                    </Button>
                  </div>
                  <div className="pt-2 text-center">
                    <p className="text-xs text-muted-foreground">24/7 Emergency Line: (555) 911-HELP</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
