"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, VideoOff, Mic, MicOff, PhoneOff, Settings } from "lucide-react"
import { toast } from "react-hot-toast"

interface VideoCallProps {
  appointmentId: string
  isDoctor?: boolean
  patientName?: string
  doctorName?: string
}

export default function VideoCall({ appointmentId, isDoctor = false, patientName, doctorName }: VideoCallProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "disconnected">("connecting")
  const [isInCall, setIsInCall] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const localStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    initializeCall()
    return () => {
      cleanup()
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isCallActive])

  const initializeCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Simulate connection process
      setTimeout(() => {
        setConnectionStatus("connected")
        setIsCallActive(true)
      }, 2000)
    } catch (error) {
      console.error("Error accessing media devices:", error)
      setConnectionStatus("disconnected")
    }
  }

  const handleJoinCall = async () => {
    try {
      // Real video call connection process
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      setIsInCall(true)
      setLocalStream(stream)
      
      // Connect to WebRTC or video call service
      // This would integrate with your backend video call infrastructure
      
    } catch (error) {
      console.error('Error accessing camera/microphone:', error)
      toast.error('Unable to access camera or microphone')
    }
  }

  const cleanup = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
    }
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const endCall = () => {
    setIsCallActive(false)
    setConnectionStatus("disconnected")
    cleanup()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isDoctor ? `Consultation with ${patientName}` : `Consultation with Dr. ${doctorName}`}
            </h1>
            <p className="text-slate-600">Appointment ID: {appointmentId}</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant={connectionStatus === "connected" ? "default" : "secondary"}>
              {connectionStatus === "connecting" && "Connecting..."}
              {connectionStatus === "connected" && `Connected • ${formatDuration(callDuration)}`}
              {connectionStatus === "disconnected" && "Disconnected"}
            </Badge>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Remote Video */}
          <Card className="relative overflow-hidden bg-slate-900">
            <CardContent className="p-0 aspect-video">
              <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
              {connectionStatus !== "connected" && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">{isDoctor ? patientName : `Dr. ${doctorName}`}</p>
                    <p className="text-slate-400">
                      {connectionStatus === "connecting" ? "Connecting..." : "Waiting to join"}
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">{isDoctor ? patientName : `Dr. ${doctorName}`}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Local Video */}
          <Card className="relative overflow-hidden bg-slate-900">
            <CardContent className="p-0 aspect-video">
              <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <VideoOff className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">Camera Off</p>
                  </div>
                </div>
              )}
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary">You</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isAudioEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleAudio}
                className="w-14 h-14 rounded-full"
              >
                {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
              </Button>

              <Button
                variant={isVideoEnabled ? "default" : "destructive"}
                size="lg"
                onClick={toggleVideo}
                className="w-14 h-14 rounded-full"
              >
                {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </Button>

              <Button variant="destructive" size="lg" onClick={endCall} className="w-14 h-14 rounded-full">
                <PhoneOff className="w-6 h-6" />
              </Button>

              <Button variant="outline" size="lg" className="w-14 h-14 rounded-full bg-transparent">
                <Settings className="w-6 h-6" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Medical Notes Section (for doctors) */}
        {isDoctor && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-32 p-3 border rounded-lg resize-none"
                placeholder="Add consultation notes..."
              />
              <div className="flex justify-end mt-4">
                <Button>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
