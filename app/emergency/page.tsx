"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Phone, MapPin, Clock, Heart, Zap, Car, Shield, Navigation, Plus } from "lucide-react"

export default function EmergencyPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false)
  const [emergencyType, setEmergencyType] = useState("")

  const emergencyContacts = [
    {
      name: "Emergency Services",
      number: "911",
      type: "emergency",
      description: "Police, Fire, Ambulance",
      icon: <AlertTriangle className="h-6 w-6" />,
    },
    {
      name: "Alturos Health Emergency",
      number: "(555) 123-HELP",
      type: "medical",
      description: "24/7 Medical Emergency Line",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      name: "Poison Control",
      number: "1-800-222-1222",
      type: "poison",
      description: "Poison Control Center",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      name: "Crisis Hotline",
      number: "988",
      type: "mental",
      description: "Suicide & Crisis Lifeline",
      icon: <Phone className="h-6 w-6" />,
    },
  ]

  const nearbyHospitals = [
    {
      name: "City General Hospital",
      address: "123 Main St, City, ST 12345",
      distance: "0.8 miles",
      phone: "(555) 123-4567",
      emergencyRoom: true,
      waitTime: "15 min",
    },
    {
      name: "Regional Medical Center",
      address: "456 Oak Ave, City, ST 12345",
      distance: "1.2 miles",
      phone: "(555) 234-5678",
      emergencyRoom: true,
      waitTime: "25 min",
    },
    {
      name: "Community Health Clinic",
      address: "789 Pine St, City, ST 12345",
      distance: "2.1 miles",
      phone: "(555) 345-6789",
      emergencyRoom: false,
      waitTime: "45 min",
    },
  ]

  const emergencyTypes = [
    { id: "chest-pain", label: "Chest Pain", icon: <Heart className="h-5 w-5" />, color: "bg-red-500" },
    { id: "breathing", label: "Difficulty Breathing", icon: <Zap className="h-5 w-5" />, color: "bg-orange-500" },
    { id: "injury", label: "Serious Injury", icon: <AlertTriangle className="h-5 w-5" />, color: "bg-yellow-500" },
    { id: "accident", label: "Car Accident", icon: <Car className="h-5 w-5" />, color: "bg-purple-500" },
    { id: "other", label: "Other Emergency", icon: <Plus className="h-5 w-5" />, color: "bg-gray-500" },
  ]

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  const handleEmergencyRequest = () => {
    // In a real app, this would send emergency request to backend
    alert("Emergency request sent! Help is on the way.")
    setIsEmergencyDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Emergency Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mx-auto">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-red-600">Emergency Services</h1>
          <p className="text-red-600/80 text-lg">Get immediate help when you need it most</p>
        </div>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-red-500 text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Phone className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Call 911</h2>
              <p className="mb-6">For life-threatening emergencies</p>
              <Button
                onClick={() => handleEmergencyCall("911")}
                className="bg-white text-red-500 hover:bg-gray-100 text-lg px-8 py-3 h-auto"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-healthcare-forest text-white border-0 shadow-2xl">
            <CardContent className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Medical Emergency</h2>
              <p className="mb-6">Connect with Alturos Health emergency team</p>
              <Dialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-white text-healthcare-forest hover:bg-gray-100 text-lg px-8 py-3 h-auto">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Request Help
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-red-600">Emergency Request</DialogTitle>
                    <DialogDescription>Describe your emergency so we can send appropriate help</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Type of Emergency</Label>
                      <div className="grid grid-cols-1 gap-2 mt-2">
                        {emergencyTypes.map((type) => (
                          <Button
                            key={type.id}
                            variant={emergencyType === type.id ? "default" : "outline"}
                            onClick={() => setEmergencyType(type.id)}
                            className="justify-start h-auto p-3"
                          >
                            <div className={`w-4 h-4 rounded-full ${type.color} mr-3`}></div>
                            {type.icon}
                            <span className="ml-2">{type.label}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Textarea id="description" placeholder="Briefly describe the situation..." className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="location">Current Location</Label>
                      <Input
                        id="location"
                        placeholder={userLocation ? "Using current location" : "Enter your location"}
                        disabled={!!userLocation}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEmergencyDialogOpen(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEmergencyRequest}
                        disabled={!emergencyType}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                      >
                        Send Emergency Request
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <Card className="bg-white/90 backdrop-blur-sm border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Contacts</span>
            </CardTitle>
            <CardDescription>Important numbers for different types of emergencies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                        {contact.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-600">{contact.name}</h4>
                        <p className="text-red-600/80 text-sm">{contact.description}</p>
                        <p className="text-red-600 font-mono text-lg mt-1">{contact.number}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEmergencyCall(contact.number)}
                      size="sm"
                      className="bg-red-500 hover:bg-red-600"
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Nearby Hospitals */}
        <Card className="bg-white/90 backdrop-blur-sm border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Nearby Hospitals</span>
            </CardTitle>
            <CardDescription>Find the closest medical facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {nearbyHospitals.map((hospital, index) => (
                <div
                  key={index}
                  className="p-4 bg-red-50 rounded-lg border border-red-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-red-600">{hospital.name}</h4>
                        {hospital.emergencyRoom && <Badge className="bg-red-100 text-red-800">Emergency Room</Badge>}
                      </div>
                      <p className="text-red-600/80 text-sm">{hospital.address}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <Navigation className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">{hospital.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">~{hospital.waitTime} wait</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4 text-red-500" />
                          <span className="text-red-600">{hospital.phone}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleGetDirections(hospital.address)}
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Directions
                      </Button>
                      <Button
                        onClick={() => handleEmergencyCall(hospital.phone)}
                        size="sm"
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Tips */}
        <Card className="bg-white/90 backdrop-blur-sm border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Emergency Tips</span>
            </CardTitle>
            <CardDescription>Important information for emergency situations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-600 mb-3">When to Call 911</h4>
                <ul className="space-y-2 text-sm text-red-600/80">
                  <li>• Chest pain or difficulty breathing</li>
                  <li>• Severe bleeding or injuries</li>
                  <li>• Loss of consciousness</li>
                  <li>• Severe allergic reactions</li>
                  <li>• Signs of stroke or heart attack</li>
                  <li>• Any life-threatening situation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-3">What to Tell 911</h4>
                <ul className="space-y-2 text-sm text-red-600/80">
                  <li>• Your exact location</li>
                  <li>• Nature of the emergency</li>
                  <li>• Number of people involved</li>
                  <li>• Current condition of patient(s)</li>
                  <li>• Any immediate dangers</li>
                  <li>• Stay on the line until help arrives</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
