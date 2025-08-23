"use client"

import { useState, useEffect, useCallback } from "react"

interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

interface UseNotificationsReturn {
  permission: NotificationPermission
  requestPermission: () => Promise<boolean>
  sendNotification: (title: string, options?: NotificationOptions) => void
  isSupported: boolean
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true,
  })

  const isSupported = typeof window !== "undefined" && "Notification" in window

  useEffect(() => {
    if (!isSupported) return

    const updatePermission = () => {
      const perm = Notification.permission
      setPermission({
        granted: perm === "granted",
        denied: perm === "denied",
        default: perm === "default",
      })
    }

    updatePermission()
  }, [isSupported])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const result = await Notification.requestPermission()
      const granted = result === "granted"

      setPermission({
        granted,
        denied: result === "denied",
        default: result === "default",
      })

      return granted
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return false
    }
  }, [isSupported])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!isSupported || !permission.granted) return

      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        })

        // Auto-close after 5 seconds
        setTimeout(() => {
          notification.close()
        }, 5000)

        return notification
      } catch (error) {
        console.error("Error sending notification:", error)
      }
    },
    [isSupported, permission.granted],
  )

  return {
    permission,
    requestPermission,
    sendNotification,
    isSupported,
  }
}
