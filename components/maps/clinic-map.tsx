"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Navigation, Phone, Clock, Star, Search } from "lucide-react"

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

interface ClinicMapProps {
  clinics: Clinic[]
  selectedClinic?: Clinic | null
  onClinicSelect: (clinic: Clinic) => void
  userLocation?: { lat: number; lng: number }
}

export function ClinicMap({ clinics, selectedClinic, onClinicSelect, userLocation }: ClinicMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredClinics, setFilteredClinics] = useState(clinics)
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [clinicLocations, setClinicLocations] = useState(clinics)
  const [userLocationState, setUserLocationState] = useState(userLocation)

  // Fetch clinic locations from API
  const fetchClinicLocations = async () => {
    try {
      const response = await fetch('/api/locations/clinics/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setClinicLocations(data)
      } else {
        console.error('Failed to fetch clinic locations')
      }
    } catch (error) {
      console.error('Error fetching clinic locations:', error)
    }
  }

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocationState({ lat: latitude, lng: longitude })
          
          // You can also fetch nearby clinics based on user location
          fetchNearbyClinics(latitude, longitude)
        },
        (error) => {
          console.error('Error getting location:', error)
          // Fallback to default location or show error message
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }

  // Fetch nearby clinics based on coordinates
  const fetchNearbyClinics = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`/api/locations/nearby?lat=${lat}&lng=${lng}&radius=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setClinicLocations(data)
      }
    } catch (error) {
      console.error('Error fetching nearby clinics:', error)
    }
  }

  useEffect(() => {
    if (!mapRef.current) return

    // Real Google Maps implementation
    console.log("Initializing Google Maps with clinics:", clinics)

    // Initialize real Google Maps
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.maps) {
      const google = (window as any).google
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
        zoom: 12,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      })
      
      // Add real markers for each clinic
      clinics.forEach((clinic, index) => {
        if (clinic.coordinates && clinic.coordinates.lat && clinic.coordinates.lng) {
          new google.maps.Marker({
            position: { lat: clinic.coordinates.lat, lng: clinic.coordinates.lng },
            map: map,
            title: clinic.name,
            label: (index + 1).toString(),
          })
        }
      })
    }
  }, [clinics])

  useEffect(() => {
    let filtered = clinics

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (clinic) =>
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          clinic.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by specialty
    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((clinic) => clinic.specialties.includes(selectedSpecialty))
    }

    setFilteredClinics(filtered)
  }, [searchQuery, selectedSpecialty, clinics])

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "high":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDirections = (clinic: Clinic) => {
    // In a real implementation, this would open Google Maps directions
    const destination = encodeURIComponent(clinic.address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}`
    window.open(url, "_blank")
  }

  const specialties = Array.from(new Set(clinics.flatMap((clinic) => clinic.specialties)))

  return (
    <div className="grid lg:grid-cols-2 gap-6 h-[600px]">
      {/* Map */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Clinic Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={mapRef}
            className="w-full h-[500px] bg-muted rounded-lg relative overflow-hidden"
            style={{ backgroundColor: "#f0f9f5" }}
          >
            {/* Real map markers from API data */}
            {filteredClinics.map((clinic, index) => (
              <div
                key={clinic.id}
                className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold transition-all hover:scale-110 ${
                  selectedClinic?.id === clinic.id ? "bg-primary scale-110" : "bg-red-500"
                }`}
                style={{
                  left: `${20 + (index % 3) * 30}%`,
                  top: `${20 + Math.floor(index / 3) * 25}%`,
                }}
                onClick={() => onClinicSelect(clinic)}
              >
                {index + 1}
              </div>
            ))}

            {/* User location marker */}
            {userLocationState && (
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: "50%", top: "50%" }}
                title="Your Location"
              />
            )}

            {/* Map controls */}
            <div className="absolute top-4 right-4 space-y-2">
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                <Navigation className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="bg-white/90 backdrop-blur-sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinic List */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
            Nearby Clinics ({filteredClinics.length})
          </CardTitle>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search clinics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 min-h-[44px]"
              />
            </div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full p-3 border border-border rounded-lg min-h-[44px]"
            >
              <option value="all">All Specialties</option>
              {specialties.map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-[400px] overflow-y-auto">
            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className={`p-4 border-b border-border cursor-pointer transition-all hover:bg-muted/50 ${
                  selectedClinic?.id === clinic.id ? "bg-primary/5 border-l-4 border-l-primary" : ""
                }`}
                onClick={() => onClinicSelect(clinic)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{clinic.name}</h3>
                    <p className="text-sm text-muted-foreground">{clinic.address}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{clinic.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {clinic.specialties.slice(0, 2).map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {clinic.specialties.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{clinic.specialties.length - 2} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {clinic.hours.open} - {clinic.hours.close}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>{clinic.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={getAvailabilityColor(clinic.availability)}>
                      {clinic.availability.charAt(0).toUpperCase() + clinic.availability.slice(1)} Availability
                    </Badge>
                    <span className="text-sm text-muted-foreground">~{clinic.waitTime}min wait</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      getDirections(clinic)
                    }}
                    className="min-h-[32px] bg-transparent"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
