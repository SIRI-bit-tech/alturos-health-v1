"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Plus, Search, Clock, AlertTriangle, CheckCircle, FileText } from "lucide-react"

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "1",
      patient: "John Smith",
      medication: "Metoprolol",
      dosage: "25mg",
      frequency: "Twice daily",
      duration: "30 days",
      instructions: "Take with food",
      startDate: "2024-01-15",
      endDate: "2024-02-14",
      status: "active",
      doctor: "Dr. Sarah Johnson",
      refillsRemaining: 2,
    },
    {
      id: "2",
      patient: "Emily Davis",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "90 days",
      instructions: "Take in the morning",
      startDate: "2024-01-10",
      endDate: "2024-04-10",
      status: "active",
      doctor: "Dr. Michael Chen",
      refillsRemaining: 5,
    },
    {
      id: "3",
      patient: "Robert Wilson",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      duration: "10 days",
      instructions: "Take with meals",
      startDate: "2024-01-05",
      endDate: "2024-01-15",
      status: "completed",
      doctor: "Dr. Lisa Anderson",
      refillsRemaining: 0,
    },
    {
      id: "4",
      patient: "Sarah Johnson",
      medication: "Atorvastatin",
      dosage: "40mg",
      frequency: "Once daily",
      duration: "30 days",
      instructions: "Take at bedtime",
      startDate: "2024-01-20",
      endDate: "2024-02-19",
      status: "pending",
      doctor: "Dr. Sarah Johnson",
      refillsRemaining: 3,
    },
  ])

  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const matchesSearch =
      prescription.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || prescription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "pending":
        return <Clock className="h-4 w-4" />
      case "expired":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cream to-healthcare-sage/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-healthcare-forest">Prescription Management</h1>
            <p className="text-healthcare-forest/70 mt-1">Manage patient prescriptions and medications</p>
          </div>
          <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
            <DialogTrigger asChild>
              <Button className="bg-healthcare-forest hover:bg-healthcare-forest/90">
                <Plus className="h-4 w-4 mr-2" />
                New Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Prescription</DialogTitle>
                <DialogDescription>Fill out the prescription details for the patient</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient">Patient</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select patient" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="emily">Emily Davis</SelectItem>
                        <SelectItem value="robert">Robert Wilson</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication</Label>
                    <Input placeholder="Enter medication name" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input placeholder="e.g., 25mg" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">Once daily</SelectItem>
                        <SelectItem value="twice">Twice daily</SelectItem>
                        <SelectItem value="three">Three times daily</SelectItem>
                        <SelectItem value="four">Four times daily</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input placeholder="e.g., 30 days" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea placeholder="Special instructions for the patient" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refills">Refills</Label>
                    <Input type="number" placeholder="Number of refills" />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-healthcare-forest hover:bg-healthcare-forest/90">Create Prescription</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Active Prescriptions</p>
                  <p className="text-2xl font-bold text-healthcare-forest">
                    {prescriptions.filter((p) => p.status === "active").length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Pending Approval</p>
                  <p className="text-2xl font-bold text-healthcare-forest">
                    {prescriptions.filter((p) => p.status === "pending").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Completed</p>
                  <p className="text-2xl font-bold text-healthcare-forest">
                    {prescriptions.filter((p) => p.status === "completed").length}
                  </p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-healthcare-forest/70">Expiring Soon</p>
                  <p className="text-2xl font-bold text-healthcare-forest">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-healthcare-forest">All Prescriptions</CardTitle>
                <CardDescription>Manage and monitor patient prescriptions</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-healthcare-forest/60" />
                  <Input
                    placeholder="Search prescriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPrescriptions.map((prescription) => (
                <div
                  key={prescription.id}
                  className="p-6 bg-healthcare-cream/30 rounded-lg border border-healthcare-sage/20 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-healthcare-forest/10 rounded-full">
                        <Pill className="h-6 w-6 text-healthcare-forest" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-semibold text-healthcare-forest text-lg">{prescription.medication}</h4>
                          <Badge className={getStatusColor(prescription.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(prescription.status)}
                              <span>{prescription.status}</span>
                            </div>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-healthcare-forest/70">Patient:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.patient}</p>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">Dosage:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.dosage}</p>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">Frequency:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.frequency}</p>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">Duration:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.duration}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-healthcare-forest/70">Start Date:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.startDate}</p>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">End Date:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.endDate}</p>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">Refills Remaining:</span>
                            <p className="font-medium text-healthcare-forest">{prescription.refillsRemaining}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-healthcare-forest/70">Instructions:</span>
                          <p className="text-healthcare-forest/80">{prescription.instructions}</p>
                        </div>
                        <div>
                          <span className="text-healthcare-forest/70">Prescribed by:</span>
                          <p className="text-healthcare-forest/80">{prescription.doctor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Refill
                      </Button>
                      <Button variant="outline" size="sm">
                        Print
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
