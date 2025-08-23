"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClinicMap } from "@/components/maps/clinic-map"
import { AddressAutocomplete } from "@/components/maps/address-autocomplete"
import { MapPin, Heart, Phone, Clock, Navigation, AlertTriangle, Ambulance } from "lucide-react"
import Link from "next/link"

interface Clinic {
  id: string
  name: string
  address: string
  phone: string
  coordinates: {
    lat: number
    lng: number
  }
  specialties: string[]
  hours: {
    open: string
    close: string
  }
  rating: number
  availability: "high" | "medium" | "low"
  waitTime: number
  distance?: number
}

interface EmergencyService {
  id: string
  name: string
  type: "hospital" | "urgent_care" | "pharmacy"
  address: string
  phone: string
  distance: number
  isOpen: boolean
}

export default function LocationsPage() {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>()
  const [searchAddress, setSearchAddress] = useState("")
  const [showEmergencyServices, setShowEmergencyServices] = useState(false)

  const clinics: Clinic[] = [
    {
      id: "1",
      name: "Alturos Health Downtown",
      address: "123 Main Street, Downtown, City, State 12345",
      phone: "(555) 123-4567",
      coordinates: { lat: 40.7128, lng: -74.006 },
      specialties: ["General Medicine", "Cardiology", "Dermatology"],
      hours: { open: "8:00 AM", close: "6:00 PM" },
      rating: 4.8,
      availability: "high",
      waitTime: 15,
      distance: 0.5,
    },
    {
      id: "2",
      name: "Alturos Health Midtown",
      address: "456 Oak Avenue, Midtown, City, State 12345",
      phone: "(555) 234-5678",
      coordinates: { lat: 40.7589, lng: -73.9851 },
      specialties: ["Pediatrics", "Orthopedics", "Mental Health"],
      hours: { open: "7:00 AM", close: "8:00 PM" },
      rating: 4.9,
      availability: "medium",
      waitTime: 25,
      distance: 1.2,
    },
    {
      id: "3",
      name: "Alturos Health Uptown",
      address: "789 Pine Road, Uptown, City, State 12345",
      phone: "(555) 345-6789",
      coordinates: { lat: 40.7831, lng: -73.9712 },
      specialties: ["General Medicine", "Endocrinology", "Neurology"],
      hours: { open: "9:00 AM", close: "5:00 PM" },
      rating: 4.7,
      availability: "low",
      waitTime: 45,
      distance: 2.1,
    },
    {
      id: "4",
      name: "Alturos Health Westside",
      address: "321 Elm Street, Westside, City, State 12345",
      phone: "(555) 456-7890",
      coordinates: { lat: 40.7505, lng: -74.0134 },
      specialties: ["Urgent Care", "Family Medicine", "Radiology"],
      hours: { open: "24/7", close: "24/7" },
      rating: 4.6,
      availability: "high",
      waitTime: 10,
      distance: 1.8,
    },
  ]

  const emergencyServices: EmergencyService[] = [
    {
      id: "1",
      name: "City General Hospital",
      type: "hospital",
      address: "100 Hospital Drive, City, State 12345",
      phone: "(555) 911-0000",
      distance: 0.8,
      isOpen: true,
    },
    {
      id: "2",
      name: "QuickCare Urgent Center",
      type: "urgent_care",
      address: "200 Quick Street, City, State 12345",
      phone: "(555) 911-1111",
      distance: 1.1,
      isOpen: true,
    },
    {
      id: "3",
      name: "24/7 Pharmacy Plus",
      type: "pharmacy",
      address: "300 Pharmacy Lane, City, State 12345",
      phone: "(555) 911-2222",
      distance: 0.6,
      isOpen: true,
    },
  ]

  useEffect(() => {
    // Get user's current location
    if ("geolocation" in navigator) {
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

  const handleAddressSelect = (place: any) => {
    if (place.geometry?.location) {
      setUserLocation({
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
      })
    }
  }

  const getEmergencyIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return <Heart className="w-5 h-5 text-red-600" />
      case "urgent_care":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "pharmacy":
        return <Ambulance className="w-5 h-5 text-blue-600" />
      default:
        return <MapPin className="w-5 h-5 text-muted-foreground" />
    }
  }

  const callEmergency = (phone: string) => {
    window.location.href = `tel:${phone}`
  }

  const getDirections = (address: string) => {
    const destination = encodeURIComponent(address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(url, "_blank")
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
                <p className="text-xs text-muted-foreground">Find Locations</p>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant={showEmergencyServices ? "default" : "outline"}
                onClick={() => setShowEmergencyServices(!showEmergencyServices)}
                className="min-h-[44px] bg-transparent"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
              <Button variant="outline" asChild className="bg-transparent">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary mb-2 font-[family-name:var(--font-heading)]">
            Find Healthcare Locations
          </h2>
          <p className="text-muted-foreground text-lg">
            Locate nearby clinics, get directions, and check real-time availability
          </p>
        </div>

        {/* Address Search */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
              Search by Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AddressAutocomplete
              value={searchAddress}
              onChange={setSearchAddress}
              onPlaceSelect={handleAddressSelect}
              placeholder="Enter your address to find nearby clinics..."
              className="text-lg"
            />
          </CardContent>
        </Card>

        {/* Emergency Services */}
        {showEmergencyServices && (
          <Card className="border-0 shadow-xl bg-red-50 border-red-200 mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-red-800 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Services
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {emergencyServices.map((service) => (
                  <div key={service.id} className="bg-white rounded-lg p-4 border border-red-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {getEmergencyIcon(service.type)}
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                      </div>
                      <Badge variant={service.isOpen ? "default" : "secondary"} className="text-xs">
                        {service.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{service.address}</p>
                    <p className="text-sm text-muted-foreground mb-4">{service.distance} miles away</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => callEmergency(service.phone)}
                        className="flex-1 min-h-[40px] bg-red-600 hover:bg-red-700"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => getDirections(service.address)}
                        className="flex-1 min-h-[40px] bg-transparent"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Clinic Map */}
        <ClinicMap
          clinics={clinics}
          selectedClinic={selectedClinic}
          onClinicSelect={setSelectedClinic}
          userLocation={userLocation}
        />

        {/* Selected Clinic Details */}
        {selectedClinic && (
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-[family-name:var(--font-heading)] text-primary">
                {selectedClinic.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{selectedClinic.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{selectedClinic.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Hours</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedClinic.hours.open} - {selectedClinic.hours.close}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-medium mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedClinic.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Current Status</p>
                    <div className="flex items-center space-x-4">
                      <Badge
                        className={
                          selectedClinic.availability === "high"
                            ? "bg-green-100 text-green-800"
                            : selectedClinic.availability === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedClinic.availability.charAt(0).toUpperCase() + selectedClinic.availability.slice(1)}{" "}
                        Availability
                      </Badge>
                      <span className="text-sm text-muted-foreground">~{selectedClinic.waitTime}min wait</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <Button asChild className="flex-1 min-h-[48px]">
                  <Link href={`/book?clinic=${selectedClinic.id}`}>Book Appointment</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => getDirections(selectedClinic.address)}
                  className="flex-1 min-h-[48px] bg-transparent"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => callEmergency(selectedClinic.phone)}
                  className="min-h-[48px] bg-transparent"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
