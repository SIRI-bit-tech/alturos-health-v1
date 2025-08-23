"use client"

import { useEffect, useState, useCallback } from "react"

interface AppointmentUpdate {
  appointment_id: string
  status: string
  updated_by: string
}

interface WebSocketMessage {
  type: string
  appointment_id?: string
  status?: string
  updated_by?: string
  appointment?: any
  message?: string
}

export function useWebSocketAppointments() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [appointmentUpdates, setAppointmentUpdates] = useState<AppointmentUpdate[]>([])

  const connect = useCallback(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    const wsUrl = `ws://localhost:8000/ws/appointments/?token=${token}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("[v0] Appointment WebSocket connected")
      setIsConnected(true)
      setSocket(ws)
    }

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data)
        console.log("[v0] Appointment WebSocket message:", data)

        switch (data.type) {
          case "status_update":
            if (data.appointment_id && data.status && data.updated_by) {
              const update: AppointmentUpdate = {
                appointment_id: data.appointment_id,
                status: data.status,
                updated_by: data.updated_by,
              }
              setAppointmentUpdates((prev) => [update, ...prev.slice(0, 9)]) // Keep last 10 updates

              // Trigger custom event for components to listen to
              window.dispatchEvent(
                new CustomEvent("appointmentStatusUpdate", {
                  detail: update,
                }),
              )
            }
            break

          case "reminder":
            if (data.appointment && data.message) {
              // Show appointment reminder
              if (Notification.permission === "granted") {
                new Notification("Appointment Reminder", {
                  body: data.message,
                  icon: "/favicon.ico",
                })
              }

              // Trigger custom event
              window.dispatchEvent(
                new CustomEvent("appointmentReminder", {
                  detail: { appointment: data.appointment, message: data.message },
                }),
              )
            }
            break
        }
      } catch (error) {
        console.error("[v0] Error parsing appointment WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      console.log("[v0] Appointment WebSocket disconnected")
      setIsConnected(false)
      setSocket(null)

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect()
      }, 3000)
    }

    ws.onerror = (error) => {
      console.error("[v0] Appointment WebSocket error:", error)
    }

    return ws
  }, [])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.close()
      setSocket(null)
      setIsConnected(false)
    }
  }, [socket])

  const updateAppointmentStatus = useCallback(
    (appointmentId: string, status: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "update_status",
            appointment_id: appointmentId,
            status: status,
          }),
        )
      }
    },
    [socket],
  )

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    isConnected,
    appointmentUpdates,
    updateAppointmentStatus,
    connect,
    disconnect,
  }
}
