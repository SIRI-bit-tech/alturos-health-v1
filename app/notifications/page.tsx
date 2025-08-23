"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationSettings } from "@/components/notification-settings"
import { useNotifications } from "@/hooks/use-notifications"
import { useWebSocket } from "@/hooks/use-websocket"
import { useToastNotifications, NotificationToast } from "@/components/notification-toast"
import { Bell, Settings, TestTube, Heart } from "lucide-react"
import Link from "next/link"

export default function NotificationsPage() {
  const [showSettings, setShowSettings] = useState(false)
  const { permission, requestPermission, sendNotification, isSupported } = useNotifications()
  const { isConnected, lastMessage } = useWebSocket("wss://api.alturoshealth.com/ws")
  const { notifications, addNotification, removeNotification } = useToastNotifications()

  const testNotification = () => {
    if (permission.granted) {
      sendNotification("Test Notification", {
        body: "This is a test notification from Alturos Health",
        icon: "/favicon.ico",
      })
    } else {
      addNotification({
        type: "warning",
        title: "Permission Required",
        message: "Please enable notifications to receive alerts",
        action: {
          label: "Enable",
          onClick: requestPermission,
        },
      })
    }
  }

  const testToast = () => {
    addNotification({
      type: "success",
      title: "Appointment Confirmed",
      message: "Your appointment with Dr. Sarah Johnson has been confirmed for tomorrow at 2:30 PM",
      action: {
        label: "View Details",
        onClick: () => console.log("View appointment details"),
      },
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                  Alturos Health
                </h1>
                <p className="text-xs text-muted-foreground">Notification Center</p>
              </div>
            </Link>
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-heading)]">
                Notification Center
              </h2>
              <p className="text-muted-foreground text-lg">Manage your notification preferences and test alerts</p>
            </div>
            <Button
              variant={showSettings ? "default" : "outline"}
              onClick={() => setShowSettings(!showSettings)}
              className="min-h-[44px] bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              {showSettings ? "Hide Settings" : "Show Settings"}
            </Button>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Push Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">{permission.granted ? "Enabled" : "Disabled"}</p>
                {!permission.granted && (
                  <Button size="sm" onClick={requestPermission} className="min-h-[40px]">
                    Enable
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
                </div>
                <h3 className="font-semibold mb-2">Real-time Connection</h3>
                <p className="text-sm text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TestTube className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Test Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">Try out different notification types</p>
                <div className="space-y-2">
                  <Button size="sm" onClick={testNotification} className="w-full min-h-[40px]">
                    Test Push
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={testToast}
                    className="w-full min-h-[40px] bg-transparent"
                  >
                    Test Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Last WebSocket Message */}
          {lastMessage && (
            <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm mb-8">
              <CardHeader>
                <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
                  Latest Real-time Update
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Type: {lastMessage.type}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(lastMessage.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
                    {JSON.stringify(lastMessage.data, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {showSettings && <NotificationSettings />}

          {/* Information Card */}
          <Card className="border-0 shadow-lg bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4 font-[family-name:var(--font-heading)]">About Notifications</h3>
              <div className="space-y-3 text-primary-foreground/90">
                <p>
                  <strong>Real-time Updates:</strong> Stay informed about appointment status changes, doctor
                  availability, and important health updates.
                </p>
                <p>
                  <strong>Multiple Channels:</strong> Receive notifications via push notifications, email, and SMS based
                  on your preferences.
                </p>
                <p>
                  <strong>HIPAA Compliant:</strong> All notifications are sent securely and comply with healthcare
                  privacy regulations.
                </p>
                <p>
                  <strong>Smart Timing:</strong> Notifications respect your quiet hours and are sent at appropriate
                  times.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Toast Notifications */}
      <NotificationToast notifications={notifications} onRemove={removeNotification} />
    </div>
  )
}
