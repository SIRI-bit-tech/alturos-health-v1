"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import VideoCall from "@/components/video-call"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

interface AppointmentDetails {
  id: string
  patientName: string
  doctorName: string
  scheduledTime: string
  status: string
}

export default function VideoCallPage() {
  const params = useParams()
  const { user } = useAuth()
  const appointmentId = params.appointmentId as string
  const [appointment, setAppointment] = useState<AppointmentDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasPermission, setHasPermission] = useState(false)

  useEffect(() => {
    checkPermissions()
    fetchAppointmentDetails()
  }, [appointmentId])

  const checkPermissions = async () => {
    try {
      // Check camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      stream.getTracks().forEach((track) => track.stop())
      setHasPermission(true)
    } catch (error) {
      console.error("Permission denied:", error)
      setHasPermission(false)
    }
  }

  const fetchAppointmentDetails = async () => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const appointment: AppointmentDetails = {
          id: data.appointment_id,
          patientName: `${data.patient.first_name} ${data.patient.last_name}`,
          doctorName: `Dr. ${data.doctor.user.first_name} ${data.doctor.user.last_name}`,
          scheduledTime: data.scheduled_date + 'T' + data.scheduled_time,
          status: data.status,
        }
        setAppointment(appointment)
      } else {
        console.error('Failed to fetch appointment details')
      }
    } catch (error) {
      console.error("Error fetching appointment:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })
      stream.getTracks().forEach((track) => track.stop())
      setHasPermission(true)
    } catch (error) {
      alert(
        "Camera and microphone access is required for video calls. Please enable permissions in your browser settings.",
      )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600">Loading video call...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Permissions Required</h2>
            <p className="text-slate-600 mb-6">To join the video call, we need access to your camera and microphone.</p>
            <div className="space-y-3">
              <Button onClick={requestPermissions} className="w-full">
                Grant Permissions
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Appointment Not Found</h2>
            <p className="text-slate-600 mb-6">
              The requested appointment could not be found or you don't have permission to access it.
            </p>
            <Link href="/dashboard">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <VideoCall
      appointmentId={appointmentId}
      isDoctor={user?.role === "doctor"}
      patientName={appointment.patientName}
      doctorName={appointment.doctorName}
    />
  )
}
