"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RealTimeStatus } from "@/components/real-time-status"
import {
  Users,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  UserCheck,
  AlertTriangle,
  Filter,
  Download,
  Plus,
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 1247,
    totalDoctors: 23,
    todayAppointments: 45,
    pendingApprovals: 8,
    revenue: 125000,
    satisfaction: 4.8,
  })

  const [appointments, setAppointments] = useState([
    {
      id: "1",
      patient: "John Smith",
      doctor: "Dr. Sarah Johnson",
      time: "09:00 AM",
      type: "Consultation",
      status: "confirmed",
    },
    {
      id: "2",
      patient: "Emily Davis",
      doctor: "Dr. Michael Chen",
      time: "10:30 AM",
      type: "Follow-up",
      status: "in_progress",
    },
    {
      id: "3",
      patient: "Robert Wilson",
      doctor: "Dr. Lisa Anderson",
      time: "02:00 PM",
      type: "Emergency",
      status: "scheduled",
    },
  ])

  const [users, setUsers] = useState([
    {
      id: "1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@alturos.com",
      role: "Doctor",
      specialty: "Cardiology",
      status: "active",
      lastLogin: "2 hours ago",
    },
    {
      id: "2",
      name: "John Smith",
      email: "john.smith@email.com",
      role: "Patient",
      specialty: "-",
      status: "active",
      lastLogin: "1 day ago",
    },
    {
      id: "3",
      name: "Dr. Michael Chen",
      email: "michael.chen@alturos.com",
      role: "Doctor",
      specialty: "Dermatology",
      status: "pending",
      lastLogin: "Never",
    },
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cream to-healthcare-sage/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-forest">Admin Dashboard</h1>
            <p className="text-healthcare-forest/70 mt-1">Manage your healthcare platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <RealTimeStatus />
            <Button className="bg-healthcare-forest hover:bg-healthcare-forest/90">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Total Patients</p>
                  <p className="text-2xl font-bold text-healthcare-forest">{stats.totalPatients.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-healthcare-forest/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Total Doctors</p>
                  <p className="text-2xl font-bold text-healthcare-forest">{stats.totalDoctors}</p>
                </div>
                <UserCheck className="h-8 w-8 text-healthcare-forest/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Today's Appointments</p>
                  <p className="text-2xl font-bold text-healthcare-forest">{stats.todayAppointments}</p>
                </div>
                <Calendar className="h-8 w-8 text-healthcare-forest/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Pending Approvals</p>
                  <p className="text-2xl font-bold text-healthcare-forest">{stats.pendingApprovals}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-healthcare-forest">${stats.revenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Satisfaction</p>
                  <p className="text-2xl font-bold text-healthcare-forest">{stats.satisfaction}/5.0</p>
                </div>
                <FileText className="h-8 w-8 text-healthcare-forest/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-healthcare-sage/20">
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              Appointments
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-healthcare-forest">Today's Appointments</CardTitle>
                    <CardDescription>Manage and monitor all appointments</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input placeholder="Search appointments..." className="w-64" />
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-healthcare-cream/30 rounded-lg border border-healthcare-sage/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-healthcare-forest/10 rounded-full">
                          <Clock className="h-6 w-6 text-healthcare-forest" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-healthcare-forest">{appointment.patient}</h4>
                          <p className="text-sm text-healthcare-forest/70">
                            with {appointment.doctor} • {appointment.time}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={
                            appointment.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "in_progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {appointment.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline">{appointment.type}</Badge>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-healthcare-forest">User Management</CardTitle>
                    <CardDescription>Manage doctors, patients, and staff accounts</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="doctors">Doctors</SelectItem>
                        <SelectItem value="patients">Patients</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder="Search users..." className="w-64" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 bg-healthcare-cream/30 rounded-lg border border-healthcare-sage/20"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-healthcare-forest/10 rounded-full">
                          <Users className="h-6 w-6 text-healthcare-forest" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-healthcare-forest">{user.name}</h4>
                          <p className="text-sm text-healthcare-forest/70">{user.email}</p>
                          <p className="text-xs text-healthcare-forest/50">Last login: {user.lastLogin}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{user.role}</Badge>
                        {user.specialty !== "-" && <Badge variant="outline">{user.specialty}</Badge>}
                        <Badge
                          className={
                            user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {user.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
                <CardHeader>
                  <CardTitle className="text-healthcare-forest">Appointment Trends</CardTitle>
                  <CardDescription>Monthly appointment statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-healthcare-forest/60">
                    Chart placeholder - Appointment trends over time
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
                <CardHeader>
                  <CardTitle className="text-healthcare-forest">Revenue Analytics</CardTitle>
                  <CardDescription>Financial performance overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-healthcare-forest/60">
                    Chart placeholder - Revenue analytics
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <CardTitle className="text-healthcare-forest">System Settings</CardTitle>
                <CardDescription>Configure platform settings and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-healthcare-forest">General Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-healthcare-forest/70">Platform Name</span>
                          <Input defaultValue="Alturos Health" className="w-48" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-healthcare-forest/70">Time Zone</span>
                          <Select defaultValue="utc">
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="utc">UTC</SelectItem>
                              <SelectItem value="est">Eastern Time</SelectItem>
                              <SelectItem value="pst">Pacific Time</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-healthcare-forest">Notification Settings</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-healthcare-forest/70">Email Notifications</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-healthcare-forest/70">SMS Notifications</span>
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-healthcare-sage/20">
                    <Button className="bg-healthcare-forest hover:bg-healthcare-forest/90">Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
