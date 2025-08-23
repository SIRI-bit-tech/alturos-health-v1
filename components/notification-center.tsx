"use client"

import React, { useState, useEffect } from "react"
import { Bell, X, Check, AlertTriangle, Calendar, MessageSquare, Pill, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Notification {
  id: string
  type: "appointment" | "reminder" | "message" | "prescription" | "alert" | "info"
  title: string
  message: string
  timestamp: Date
  read: boolean
  urgent: boolean
  appointmentId?: string
  actionUrl?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  userType: "patient" | "doctor"
}

export function NotificationCenter({ isOpen, onClose, userType }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch notifications from API
  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/notifications/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const formattedNotifications = data.map((notification: any) => ({
          id: notification.id,
          type: notification.notification_type,
          title: notification.title,
          message: notification.message,
          timestamp: new Date(notification.created_at),
          read: notification.is_read,
          urgent: notification.notification_type === 'appointment_reminder' || notification.notification_type === 'follow_up_required',
          appointmentId: notification.appointment_id,
          actionUrl: notification.action_url,
        }))
        
        setNotifications(formattedNotifications)
        setUnreadCount(formattedNotifications.filter((n) => !n.read).length)
      } else {
        console.error('Failed to fetch notifications')
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/mark-read/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => 
            n.id === notificationId ? { ...n, read: true } : n
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/mark-all-read/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Fetch notifications on component mount and when userType changes
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, userType])

  // Set up real-time updates (WebSocket or polling)
  useEffect(() => {
    if (!isOpen) return

    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchNotifications()
    }, 30000)

    return () => clearInterval(interval)
  }, [isOpen])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5" />
      case "message":
        return <MessageSquare className="w-5 h-5" />
      case "prescription":
        return <Pill className="w-5 h-5" />
      case "alert":
        return <AlertTriangle className="w-5 h-5" />
      default:
        return <Info className="w-5 h-5" />
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return timestamp.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-end p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-sm"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No notifications yet</p>
                  </div>
                ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                    <div
                      key={notification.id}
                  className={`p-3 rounded-lg border transition-colors ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      notification.read ? "text-gray-500" : "text-primary"
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                        <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`font-medium text-sm ${
                          notification.read ? "text-gray-700" : "text-gray-900"
                        }`}>
                              {notification.title}
                        </h4>
                        {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          >
                            <Check className="w-3 h-3" />
                            </Button>
                        )}
                          </div>
                      <p className={`text-sm mt-1 ${
                        notification.read ? "text-gray-600" : "text-gray-700"
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                        {notification.urgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                            {notification.actionUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => {
                            window.location.href = notification.actionUrl!
                            onClose()
                          }}
                        >
                          View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
              ))}
                    </div>
                )}
            </ScrollArea>
      </div>
    </div>
  )
}
