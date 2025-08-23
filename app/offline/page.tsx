"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WifiOff, RefreshCw, Calendar, Clock, User, Phone } from "lucide-react"
import Link from "next/link"

interface OfflineAppointment {
  id: string
  doctorName: string
  date: string
  time: string
  type: string
  status: string
}

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true)
  const [offlineAppointments, setOfflineAppointments] = useState<OfflineAppointment[]>([])

  useEffect(() => {
    // Check initial online status
    setIsOnline(navigator.onLine)

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load cached appointments from localStorage
    loadOfflineData()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const loadOfflineData = () => {
    try {
      const cachedAppointments = localStorage.getItem("cached_appointments")
      if (cachedAppointments) {
        setOfflineAppointments(JSON.parse(cachedAppointments))
      }
    } catch (error) {
      console.error("Error loading offline data:", error)
    }
  }

  const handleRetry = () => {
    window.location.reload()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-10 h-10 text-slate-500" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">You're Offline</h1>
          <p className="text-slate-600 mb-4">
            Don't worry! You can still view your cached appointments and emergency information.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Badge variant={isOnline ? "default" : "secondary"}>{isOnline ? "Back Online" : "Offline Mode"}</Badge>
            <Button onClick={handleRetry} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </div>

        {/* Cached Appointments */}
        {offlineAppointments.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Your Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offlineAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Dr. {appointment.doctorName}</h3>
                        <p className="text-sm text-slate-600">{appointment.type}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(appointment.date)}
                          </span>
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {appointment.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">{appointment.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-red-50">
                <h3 className="font-semibold text-red-900 mb-2">Emergency Services</h3>
                <p className="text-2xl font-bold text-red-600 mb-1">911</p>
                <p className="text-sm text-red-700">For life-threatening emergencies</p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <h3 className="font-semibold text-blue-900 mb-2">Alturos Health Urgent Care</h3>
                <p className="text-xl font-bold text-blue-600 mb-1">(555) 123-4567</p>
                <p className="text-sm text-blue-700">24/7 medical assistance</p>
              </div>
              <div className="p-4 border rounded-lg bg-green-50">
                <h3 className="font-semibold text-green-900 mb-2">Poison Control</h3>
                <p className="text-xl font-bold text-green-600 mb-1">(800) 222-1222</p>
                <p className="text-sm text-green-700">Poison emergencies</p>
              </div>
              <div className="p-4 border rounded-lg bg-purple-50">
                <h3 className="font-semibold text-purple-900 mb-2">Mental Health Crisis</h3>
                <p className="text-xl font-bold text-purple-600 mb-1">988</p>
                <p className="text-sm text-purple-700">Suicide & Crisis Lifeline</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Offline Features */}
        <Card>
          <CardHeader>
            <CardTitle>Available Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Cached Appointments</h3>
                <p className="text-sm text-slate-600">View your recent appointments</p>
              </div>
              <div className="text-center p-4">
                <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Emergency Contacts</h3>
                <p className="text-sm text-slate-600">Access important phone numbers</p>
              </div>
              <div className="text-center p-4">
                <User className="w-8 h-8 text-primary mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Profile Information</h3>
                <p className="text-sm text-slate-600">View your basic profile data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Online Actions */}
        {isOnline && (
          <div className="text-center mt-8">
            <p className="text-green-600 font-semibold mb-4">✓ Connection restored!</p>
            <div className="flex gap-4 justify-center">
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
              <Link href="/book">
                <Button variant="outline">Book Appointment</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
