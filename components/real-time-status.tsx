"use client"

import { useWebSocketNotifications } from "@/hooks/use-websocket-notifications"
import { useWebSocketAppointments } from "@/hooks/use-websocket-appointments"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function RealTimeStatus() {
  const { isConnected: notificationsConnected } = useWebSocketNotifications()
  const { isConnected: appointmentsConnected } = useWebSocketAppointments()

  const isFullyConnected = notificationsConnected && appointmentsConnected

  return (
    <div className="flex items-center space-x-2">
      <Badge
        variant={isFullyConnected ? "default" : "secondary"}
        className={`flex items-center space-x-1 ${
          isFullyConnected
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-600 border-gray-200"
        }`}
      >
        {isFullyConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        <span className="text-xs">{isFullyConnected ? "Live" : "Offline"}</span>
      </Badge>
    </div>
  )
}
