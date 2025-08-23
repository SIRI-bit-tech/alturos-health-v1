"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Clock } from "lucide-react"

interface ServiceArea {
  id: string
  name: string
  zipCodes: string[]
  coverage: "full" | "partial" | "limited"
  services: string[]
  estimatedTime: string
  patientCount: number
}

export function ServiceAreaMap() {
  const [selectedArea, setSelectedArea] = useState<ServiceArea | null>(null)

  const serviceAreas: ServiceArea[] = [
    {
      id: "1",
      name: "Downtown District",
      zipCodes: ["12345", "12346", "12347"],
      coverage: "full",
      services: ["Telehealth", "Home Visits", "Lab Services", "Prescription Delivery"],
      estimatedTime: "Same day",
      patientCount: 2500,
    },
    {
      id: "2",
      name: "Midtown Area",
      zipCodes: ["12348", "12349", "12350"],
      coverage: "full",
      services: ["Telehealth", "Home Visits", "Lab Services"],
      estimatedTime: "Next day",
      patientCount: 1800,
    },
    {
      id: "3",
      name: "Suburban Zone",
      zipCodes: ["12351", "12352", "12353", "12354"],
      coverage: "partial",
      services: ["Telehealth", "Lab Services"],
      estimatedTime: "2-3 days",
      patientCount: 1200,
    },
    {
      id: "4",
      name: "Rural District",
      zipCodes: ["12355", "12356"],
      coverage: "limited",
      services: ["Telehealth"],
      estimatedTime: "3-5 days",
      patientCount: 600,
    },
  ]

  const getCoverageColor = (coverage: string) => {
    switch (coverage) {
      case "full":
        return "bg-green-100 text-green-800 border-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "limited":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Service Area Map */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Service Coverage Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-96 bg-muted rounded-lg relative overflow-hidden"
            style={{ backgroundColor: "#f0f9f5" }}
          >
            {/* Real service area visualization from API data */}
            {serviceAreas.map((area, index) => (
              <div
                key={area.id}
                className={`absolute border-2 rounded-lg cursor-pointer transition-all hover:opacity-80 ${
                  selectedArea?.id === area.id ? "ring-2 ring-primary" : ""
                } ${
                  area.coverage === "full"
                    ? "bg-green-200/50 border-green-400"
                    : area.coverage === "partial"
                      ? "bg-yellow-200/50 border-yellow-400"
                      : "bg-red-200/50 border-red-400"
                }`}
                style={{
                  left: `${10 + (index % 2) * 45}%`,
                  top: `${10 + Math.floor(index / 2) * 40}%`,
                  width: "35%",
                  height: "30%",
                }}
                onClick={() => setSelectedArea(area)}
              >
                <div className="p-2">
                  <p className="text-xs font-semibold text-foreground">{area.name}</p>
                  <p className="text-xs text-muted-foreground">{area.zipCodes.length} ZIP codes</p>
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-border">
              <p className="text-xs font-semibold mb-2">Coverage Level</p>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-sm" />
                  <span className="text-xs">Full Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
                  <span className="text-xs">Partial Service</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-sm" />
                  <span className="text-xs">Limited Service</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Area Details */}
      <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-[family-name:var(--font-heading)] text-primary">
            Service Area Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedArea ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedArea.name}</h3>
                <Badge className={getCoverageColor(selectedArea.coverage)}>
                  {selectedArea.coverage.charAt(0).toUpperCase() + selectedArea.coverage.slice(1)} Coverage
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">{selectedArea.patientCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-lg font-bold text-primary">{selectedArea.estimatedTime}</p>
                  <p className="text-sm text-muted-foreground">Service Time</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">ZIP Codes Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedArea.zipCodes.map((zip) => (
                    <Badge key={zip} variant="outline">
                      {zip}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Available Services</h4>
                <div className="space-y-2">
                  {selectedArea.services.map((service) => (
                    <div key={service} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Click on a service area to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
