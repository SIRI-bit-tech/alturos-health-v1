"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, CheckCircle, AlertCircle, Timer } from "lucide-react"

interface AppointmentStatus {
  id: string
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled"
  estimatedWaitTime?: number
  doctorReady?: boolean
}

interface AppointmentTrackerProps {
  appointmentId: string
}

export function AppointmentTracker({ appointmentId }: AppointmentTrackerProps) {
  const [appointment, setAppointment] = useState<AppointmentStatus>({
    id: appointmentId,
    status: "scheduled",
    estimatedWaitTime: 15,
  })
  const [countdown, setCountdown] = useState(900) // 15 minutes in seconds

  useEffect(() => {
    // Real-time appointment tracking using WebSocket or polling
    const fetchAppointmentUpdates = async () => {
      try {
        const response = await fetch(`/api/appointments/${appointmentId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          },
        })
        
        if (response.ok) {
          const updatedAppointment = await response.json()
          setAppointment(updatedAppointment)
        }
      } catch (error) {
        console.error('Error fetching appointment updates:', error)
      }
    }

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchAppointmentUpdates, 30000)
    
    // Initial fetch
    fetchAppointmentUpdates()
    
    return () => clearInterval(interval)
  }, [appointmentId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
              Appointment Status
            </CardTitle>
            <CardDescription>ID: {appointmentId}</CardDescription>
          </div>
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Countdown Timer */}
        <div className="text-center bg-primary/5 rounded-lg p-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Timer className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Time Until Appointment</span>
          </div>
          <div className="text-4xl font-bold text-primary font-mono">{formatTime(countdown)}</div>
          <p className="text-sm text-muted-foreground mt-2">Your doctor will be ready soon</p>
        </div>

        {/* Status Timeline */}
        <div className="space-y-4">
          <h3 className="font-semibold">Appointment Progress</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Appointment Booked</p>
                <p className="text-sm text-muted-foreground">Confirmation sent to your email</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Doctor Assigned</p>
                <p className="text-sm text-muted-foreground">Dr. Sarah Johnson confirmed</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-medium">Preparing for Visit</p>
                <p className="text-sm text-muted-foreground">Please arrive 10 minutes early</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="flex-1 min-h-[48px] bg-transparent">
            <Phone className="w-4 h-4 mr-2" />
            Call Clinic
          </Button>
          <Button variant="outline" className="flex-1 min-h-[48px] bg-transparent">
            <MapPin className="w-4 h-4 mr-2" />
            Get Directions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
