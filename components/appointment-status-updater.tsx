"use client"

import { useEffect, useState } from "react"
import { useWebSocketAppointments } from "@/hooks/use-websocket-appointments"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface AppointmentStatusUpdaterProps {
  appointmentId: string
  currentStatus: string
  userType: "patient" | "doctor"
  onStatusChange?: (newStatus: string) => void
}

const statusOptions = [
  { value: "scheduled", label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  { value: "confirmed", label: "Confirmed", color: "bg-green-100 text-green-800" },
  { value: "in_progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "completed", label: "Completed", color: "bg-purple-100 text-purple-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" },
  { value: "no_show", label: "No Show", color: "bg-gray-100 text-gray-800" },
]

export function AppointmentStatusUpdater({
  appointmentId,
  currentStatus,
  userType,
  onStatusChange,
}: AppointmentStatusUpdaterProps) {
  const [status, setStatus] = useState(currentStatus)
  const [isUpdating, setIsUpdating] = useState(false)
  const { updateAppointmentStatus, isConnected } = useWebSocketAppointments()

  useEffect(() => {
    const handleStatusUpdate = (event: CustomEvent) => {
      const { appointment_id, status: newStatus } = event.detail
      if (appointment_id === appointmentId) {
        setStatus(newStatus)
        onStatusChange?.(newStatus)
        setIsUpdating(false)
      }
    }

    window.addEventListener("appointmentStatusUpdate", handleStatusUpdate as EventListener)
    return () => {
      window.removeEventListener("appointmentStatusUpdate", handleStatusUpdate as EventListener)
    }
  }, [appointmentId, onStatusChange])

  const handleStatusChange = async (newStatus: string) => {
    if (!isConnected) {
      // Fallback to API call if WebSocket is not connected
      try {
        setIsUpdating(true)
        const token = localStorage.getItem("access_token")
        const response = await fetch(`/api/appointments/${appointmentId}/status/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        })

        if (response.ok) {
          setStatus(newStatus)
          onStatusChange?.(newStatus)
        }
      } catch (error) {
        console.error("[v0] Error updating appointment status:", error)
      } finally {
        setIsUpdating(false)
      }
    } else {
      // Use WebSocket for real-time update
      setIsUpdating(true)
      updateAppointmentStatus(appointmentId, newStatus)
    }
  }

  const currentStatusOption = statusOptions.find((option) => option.value === status)

  // Determine which statuses the user can set based on their role
  const allowedStatuses =
    userType === "doctor" ? statusOptions : statusOptions.filter((option) => ["cancelled"].includes(option.value))

  return (
    <div className="flex items-center space-x-3">
      <Badge className={currentStatusOption?.color || "bg-gray-100 text-gray-800"}>
        {currentStatusOption?.label || status}
      </Badge>

      {allowedStatuses.length > 1 && (
        <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Update status" />
          </SelectTrigger>
          <SelectContent>
            {allowedStatuses.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {isUpdating && <div className="text-sm text-gray-500">Updating...</div>}

      {!isConnected && <div className="text-xs text-amber-600">Offline mode</div>}
    </div>
  )
}
