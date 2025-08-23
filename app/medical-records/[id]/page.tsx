"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Pill, TestTube, Calendar, User, Download, Share, Edit, AlertCircle } from "lucide-react"

export default function MedicalRecordDetail() {
  const params = useParams()
  const router = useRouter()
  const recordId = params.id as string

  const [record, setRecord] = useState({
    id: recordId,
    patient: {
      name: "John Smith",
      age: 45,
      gender: "Male",
      bloodType: "O+",
      mrn: "MRN12345678",
    },
    doctor: {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      license: "MD123456",
    },
    appointment: {
      date: "2024-01-15",
      time: "10:30 AM",
      type: "Consultation",
    },
    record: {
      title: "Cardiac Consultation - Chest Pain Evaluation",
      type: "consultation",
      date: "2024-01-15",
      chiefComplaint: "Patient presents with intermittent chest pain for the past 2 weeks",
      historyOfPresentIllness:
        "45-year-old male presents with a 2-week history of intermittent chest pain. Pain is described as pressure-like, located in the center of the chest, lasting 5-10 minutes. Pain occurs with exertion and resolves with rest. No associated shortness of breath, nausea, or diaphoresis.",
      physicalExamination: {
        vitals: {
          bloodPressure: "140/90 mmHg",
          heartRate: "78 bpm",
          temperature: "98.6°F",
          respiratoryRate: "16/min",
          oxygenSaturation: "98%",
        },
        cardiovascular: "Regular rate and rhythm, no murmurs, rubs, or gallops",
        pulmonary: "Clear to auscultation bilaterally",
        general: "Well-appearing male in no acute distress",
      },
      assessment: "Stable angina pectoris, likely coronary artery disease",
      plan: [
        "Start metoprolol 25mg twice daily",
        "Initiate atorvastatin 40mg daily",
        "Order stress test",
        "Lifestyle modifications: diet and exercise",
        "Follow-up in 2 weeks",
      ],
      followUpRequired: true,
      followUpDate: "2024-01-29",
    },
    prescriptions: [
      {
        id: "1",
        medication: "Metoprolol",
        dosage: "25mg",
        frequency: "Twice daily",
        duration: "30 days",
        instructions: "Take with food",
        startDate: "2024-01-15",
      },
      {
        id: "2",
        medication: "Atorvastatin",
        dosage: "40mg",
        frequency: "Once daily",
        duration: "30 days",
        instructions: "Take at bedtime",
        startDate: "2024-01-15",
      },
    ],
    labResults: [
      {
        id: "1",
        testName: "Lipid Panel",
        date: "2024-01-15",
        results: {
          "Total Cholesterol": "245 mg/dL (High)",
          "LDL Cholesterol": "165 mg/dL (High)",
          "HDL Cholesterol": "35 mg/dL (Low)",
          Triglycerides: "200 mg/dL (Borderline High)",
        },
        status: "abnormal",
      },
      {
        id: "2",
        testName: "Basic Metabolic Panel",
        date: "2024-01-15",
        results: {
          Glucose: "95 mg/dL (Normal)",
          Creatinine: "1.0 mg/dL (Normal)",
          "Blood Urea Nitrogen": "15 mg/dL (Normal)",
        },
        status: "normal",
      },
    ],
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-cream to-healthcare-sage/20">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-healthcare-forest">{record.record.title}</h1>
              <p className="text-healthcare-forest/70 mt-1">
                {record.patient.name} • {record.record.date}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="bg-healthcare-forest hover:bg-healthcare-forest/90">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
          <CardHeader>
            <CardTitle className="text-healthcare-forest flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Patient Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-healthcare-forest mb-2">Patient Details</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-healthcare-forest/70">Name:</span> {record.patient.name}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Age:</span> {record.patient.age}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Gender:</span> {record.patient.gender}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Blood Type:</span> {record.patient.bloodType}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">MRN:</span> {record.patient.mrn}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-healthcare-forest mb-2">Provider Details</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-healthcare-forest/70">Doctor:</span> {record.doctor.name}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Specialty:</span> {record.doctor.specialty}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">License:</span> {record.doctor.license}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-healthcare-forest mb-2">Appointment Details</h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-healthcare-forest/70">Date:</span> {record.appointment.date}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Time:</span> {record.appointment.time}
                  </p>
                  <p>
                    <span className="text-healthcare-forest/70">Type:</span> {record.appointment.type}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="record" className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-healthcare-sage/20">
            <TabsTrigger
              value="record"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Medical Record
            </TabsTrigger>
            <TabsTrigger
              value="prescriptions"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              <Pill className="h-4 w-4 mr-2" />
              Prescriptions
            </TabsTrigger>
            <TabsTrigger
              value="labs"
              className="data-[state=active]:bg-healthcare-forest data-[state=active]:text-white"
            >
              <TestTube className="h-4 w-4 mr-2" />
              Lab Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <CardTitle className="text-healthcare-forest">Clinical Documentation</CardTitle>
                <CardDescription>Detailed medical record and examination findings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-healthcare-forest mb-2">Chief Complaint</h4>
                  <p className="text-healthcare-forest/80">{record.record.chiefComplaint}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-healthcare-forest mb-2">History of Present Illness</h4>
                  <p className="text-healthcare-forest/80">{record.record.historyOfPresentIllness}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-healthcare-forest mb-3">Physical Examination</h4>
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-healthcare-forest mb-2">Vital Signs</h5>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        {Object.entries(record.record.physicalExamination.vitals).map(([key, value]) => (
                          <div key={key} className="bg-healthcare-cream/30 p-2 rounded">
                            <span className="text-healthcare-forest/70 capitalize">
                              {key.replace(/([A-Z])/g, " $1").trim()}:
                            </span>
                            <span className="ml-1 font-medium text-healthcare-forest">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-healthcare-forest mb-2">System Review</h5>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-healthcare-forest/70">Cardiovascular:</span>{" "}
                          {record.record.physicalExamination.cardiovascular}
                        </p>
                        <p>
                          <span className="text-healthcare-forest/70">Pulmonary:</span>{" "}
                          {record.record.physicalExamination.pulmonary}
                        </p>
                        <p>
                          <span className="text-healthcare-forest/70">General:</span>{" "}
                          {record.record.physicalExamination.general}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-healthcare-forest mb-2">Assessment</h4>
                  <p className="text-healthcare-forest/80">{record.record.assessment}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold text-healthcare-forest mb-2">Treatment Plan</h4>
                  <ul className="space-y-1">
                    {record.record.plan.map((item, index) => (
                      <li key={index} className="flex items-start space-x-2 text-healthcare-forest/80">
                        <span className="text-healthcare-forest/60 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {record.record.followUpRequired && (
                  <>
                    <Separator />
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-amber-600" />
                        <h4 className="font-semibold text-amber-800">Follow-up Required</h4>
                      </div>
                      <p className="text-amber-700 mt-1">Next appointment scheduled for {record.record.followUpDate}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <CardTitle className="text-healthcare-forest">Prescribed Medications</CardTitle>
                <CardDescription>Current prescriptions from this visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {record.prescriptions.map((prescription) => (
                    <div
                      key={prescription.id}
                      className="p-4 bg-healthcare-cream/30 rounded-lg border border-healthcare-sage/20"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-healthcare-forest text-lg">{prescription.medication}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                            <div>
                              <span className="text-healthcare-forest/70">Start Date:</span>
                              <p className="font-medium text-healthcare-forest">{prescription.startDate}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-healthcare-forest/70">Instructions:</span>
                            <p className="text-healthcare-forest/80">{prescription.instructions}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labs" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
              <CardHeader>
                <CardTitle className="text-healthcare-forest">Laboratory Results</CardTitle>
                <CardDescription>Test results and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {record.labResults.map((lab) => (
                    <div key={lab.id} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-healthcare-forest text-lg">{lab.testName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              lab.status === "normal"
                                ? "bg-green-100 text-green-800"
                                : lab.status === "abnormal"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {lab.status}
                          </Badge>
                          <span className="text-sm text-healthcare-forest/70">{lab.date}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries(lab.results).map(([test, result]) => (
                          <div
                            key={test}
                            className={`p-3 rounded-lg border ${
                              result.includes("High") || result.includes("Low")
                                ? "bg-red-50 border-red-200"
                                : "bg-healthcare-cream/30 border-healthcare-sage/20"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-healthcare-forest/70">{test}</span>
                              {(result.includes("High") || result.includes("Low")) && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <p className="font-medium text-healthcare-forest">{result}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
