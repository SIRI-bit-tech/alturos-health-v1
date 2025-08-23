"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Bell, Mail, MessageSquare, Calendar, Pill, AlertTriangle } from "lucide-react"

interface NotificationSettings {
  email: {
    appointments: boolean
    reminders: boolean
    results: boolean
    prescriptions: boolean
    messages: boolean
  }
  sms: {
    appointments: boolean
    reminders: boolean
    urgent: boolean
  }
  push: {
    appointments: boolean
    doctorReady: boolean
    messages: boolean
    prescriptions: boolean
  }
  preferences: {
    reminderTime: number // hours before appointment
    quietHours: {
      enabled: boolean
      start: string
      end: string
    }
  }
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      appointments: true,
      reminders: true,
      results: true,
      prescriptions: true,
      messages: true,
    },
    sms: {
      appointments: true,
      reminders: true,
      urgent: true,
    },
    push: {
      appointments: true,
      doctorReady: true,
      messages: false,
      prescriptions: true,
    },
    preferences: {
      reminderTime: 24,
      quietHours: {
        enabled: true,
        start: "22:00",
        end: "08:00",
      },
    },
  })

  const updateEmailSetting = (key: keyof typeof settings.email, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }))
  }

  const updateSmsSetting = (key: keyof typeof settings.sms, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      sms: { ...prev.sms, [key]: value },
    }))
  }

  const updatePushSetting = (key: keyof typeof settings.push, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      push: { ...prev.push, [key]: value },
    }))
  }

  const updatePreference = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }))
  }

  const saveSettings = () => {
    // In a real app, this would save to the backend
    console.log("Saving notification settings:", settings)
    // Show success toast
  }

  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Email Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-primary" />
              <Label htmlFor="email-appointments">Appointment confirmations and changes</Label>
            </div>
            <Switch
              id="email-appointments"
              checked={settings.email.appointments}
              onCheckedChange={(checked) => updateEmailSetting("appointments", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-primary" />
              <Label htmlFor="email-reminders">Appointment reminders</Label>
            </div>
            <Switch
              id="email-reminders"
              checked={settings.email.reminders}
              onCheckedChange={(checked) => updateEmailSetting("reminders", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-primary" />
              <Label htmlFor="email-results">Test results and lab reports</Label>
            </div>
            <Switch
              id="email-results"
              checked={settings.email.results}
              onCheckedChange={(checked) => updateEmailSetting("results", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pill className="w-4 h-4 text-primary" />
              <Label htmlFor="email-prescriptions">Prescription updates</Label>
            </div>
            <Switch
              id="email-prescriptions"
              checked={settings.email.prescriptions}
              onCheckedChange={(checked) => updateEmailSetting("prescriptions", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              <Label htmlFor="email-messages">Messages from healthcare team</Label>
            </div>
            <Switch
              id="email-messages"
              checked={settings.email.messages}
              onCheckedChange={(checked) => updateEmailSetting("messages", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-primary" />
              <Label htmlFor="sms-appointments">Appointment confirmations</Label>
            </div>
            <Switch
              id="sms-appointments"
              checked={settings.sms.appointments}
              onCheckedChange={(checked) => updateSmsSetting("appointments", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-primary" />
              <Label htmlFor="sms-reminders">Appointment reminders</Label>
            </div>
            <Switch
              id="sms-reminders"
              checked={settings.sms.reminders}
              onCheckedChange={(checked) => updateSmsSetting("reminders", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <Label htmlFor="sms-urgent">Urgent notifications only</Label>
            </div>
            <Switch
              id="sms-urgent"
              checked={settings.sms.urgent}
              onCheckedChange={(checked) => updateSmsSetting("urgent", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Push Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-primary" />
              <Label htmlFor="push-appointments">Appointment updates</Label>
            </div>
            <Switch
              id="push-appointments"
              checked={settings.push.appointments}
              onCheckedChange={(checked) => updatePushSetting("appointments", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-green-600" />
              <Label htmlFor="push-doctor-ready">Doctor is ready notifications</Label>
            </div>
            <Switch
              id="push-doctor-ready"
              checked={settings.push.doctorReady}
              onCheckedChange={(checked) => updatePushSetting("doctorReady", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-primary" />
              <Label htmlFor="push-messages">New messages</Label>
            </div>
            <Switch
              id="push-messages"
              checked={settings.push.messages}
              onCheckedChange={(checked) => updatePushSetting("messages", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pill className="w-4 h-4 text-primary" />
              <Label htmlFor="push-prescriptions">Prescription ready</Label>
            </div>
            <Switch
              id="push-prescriptions"
              checked={settings.push.prescriptions}
              onCheckedChange={(checked) => updatePushSetting("prescriptions", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reminder-time">Send appointment reminders</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="reminder-time"
                type="number"
                min="1"
                max="168"
                value={settings.preferences.reminderTime}
                onChange={(e) => updatePreference("reminderTime", Number.parseInt(e.target.value))}
                className="w-20 min-h-[44px]"
              />
              <span className="text-sm text-muted-foreground">hours before appointment</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours">Enable quiet hours</Label>
              <Switch
                id="quiet-hours"
                checked={settings.preferences.quietHours.enabled}
                onCheckedChange={(checked) =>
                  updatePreference("quietHours", { ...settings.preferences.quietHours, enabled: checked })
                }
              />
            </div>
            {settings.preferences.quietHours.enabled && (
              <div className="grid grid-cols-2 gap-4 pl-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">From</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={settings.preferences.quietHours.start}
                    onChange={(e) =>
                      updatePreference("quietHours", {
                        ...settings.preferences.quietHours,
                        start: e.target.value,
                      })
                    }
                    className="min-h-[44px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">To</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={settings.preferences.quietHours.end}
                    onChange={(e) =>
                      updatePreference("quietHours", {
                        ...settings.preferences.quietHours,
                        end: e.target.value,
                      })
                    }
                    className="min-h-[44px]"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveSettings} className="w-full min-h-[48px]">
        Save Notification Settings
      </Button>
    </div>
  )
}
