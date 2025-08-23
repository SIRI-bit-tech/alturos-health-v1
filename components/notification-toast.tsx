"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, CheckCircle, AlertCircle, Info, Bell } from "lucide-react"

interface ToastNotification {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationToastProps {
  notifications: ToastNotification[]
  onRemove: (id: string) => void
}

export function NotificationToast({ notifications, onRemove }: NotificationToastProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-600" />
      case "info":
        return <Info className="w-5 h-5 text-blue-600" />
      default:
        return <Bell className="w-5 h-5 text-primary" />
    }
  }

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-white border-border"
    }
  }

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <ToastItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
          getIcon={getIcon}
          getBackgroundColor={getBackgroundColor}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  notification: ToastNotification
  onRemove: (id: string) => void
  getIcon: (type: string) => JSX.Element
  getBackgroundColor: (type: string) => string
}

function ToastItem({ notification, onRemove, getIcon, getBackgroundColor }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)

    // Auto-remove after duration
    const duration = notification.duration || 5000
    const removeTimer = setTimeout(() => {
      handleRemove()
    }, duration)

    return () => {
      clearTimeout(timer)
      clearTimeout(removeTimer)
    }
  }, [notification.duration])

  const handleRemove = () => {
    setIsVisible(false)
    setTimeout(() => onRemove(notification.id), 300)
  }

  return (
    <Card
      className={`border shadow-lg transition-all duration-300 transform ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${getBackgroundColor(notification.type)}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground mb-1">{notification.title}</p>
            <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
            {notification.action && (
              <Button
                size="sm"
                variant="outline"
                onClick={notification.action.onClick}
                className="h-8 text-xs bg-transparent"
              >
                {notification.action.label}
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemove} className="h-6 w-6 p-0 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for managing toast notifications
export function useToastNotifications() {
  const [notifications, setNotifications] = useState<ToastNotification[]>([])

  const addNotification = (notification: Omit<ToastNotification, "id">) => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { ...notification, id }])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  }
}
