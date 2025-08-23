"use client"

import { useEffect, useState, useCallback } from "react"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
}

interface WebSocketMessage {
  type: string
  notification?: Notification
  count?: number
  notifications?: Notification[]
}

export function useWebSocketNotifications() {
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  const connect = useCallback(() => {
    const token = localStorage.getItem("access_token")
    if (!token) return

    const wsUrl = `ws://localhost:8000/ws/notifications/?token=${token}`
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("[v0] WebSocket connected")
      setIsConnected(true)
      setSocket(ws)
    }

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data)
        console.log("[v0] WebSocket message received:", data)

        switch (data.type) {
          case "new_notification":
            if (data.notification) {
              setNotifications((prev) => [data.notification!, ...prev])
              setUnreadCount((prev) => prev + 1)

              // Show browser notification if permission granted
              if (Notification.permission === "granted") {
                new Notification(data.notification.title, {
                  body: data.notification.message,
                  icon: "/favicon.ico",
                })
              }
            }
            break

          case "unread_count":
            if (typeof data.count === "number") {
              setUnreadCount(data.count)
            }
            break

          case "notifications_list":
            if (data.notifications) {
              setNotifications(data.notifications)
            }
            break
        }
      } catch (error) {
        console.error("[v0] Error parsing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      console.log("[v0] WebSocket disconnected")
      setIsConnected(false)
      setSocket(null)

      // Attempt to reconnect after 3 seconds
      setTimeout(() => {
        connect()
      }, 3000)
    }

    ws.onerror = (error) => {
      console.error("[v0] WebSocket error:", error)
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

  const markAsRead = useCallback(
    (notificationId: string) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({
            type: "mark_read",
            notification_id: notificationId,
          }),
        )

        // Update local state
        setNotifications((prev) =>
          prev.map((notif) => (notif.id === notificationId ? { ...notif, is_read: true } : notif)),
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    },
    [socket],
  )

  const requestNotifications = useCallback(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "get_notifications",
        }),
      )
    }
  }, [socket])

  // Request browser notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window && Notification.permission === "default") {
      const permission = await Notification.requestPermission()
      return permission === "granted"
    }
    return Notification.permission === "granted"
  }, [])

  useEffect(() => {
    connect()
    requestNotificationPermission()

    return () => {
      disconnect()
    }
  }, [connect, disconnect, requestNotificationPermission])

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    requestNotifications,
    connect,
    disconnect,
  }
}
