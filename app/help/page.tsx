"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  HelpCircle,
  Phone,
  Mail,
  MessageCircle,
  Video,
  Calendar,
  CreditCard,
  Shield,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const faqData = [
    {
      id: "appointments",
      title: "Appointments & Booking",
      icon: Calendar,
      questions: [
        {
          q: "How do I book an appointment?",
          a: "You can book appointments through our online portal, by calling our office, or using the Book Now button on our homepage. Simply select your preferred doctor, date, and time."
        },
        {
          q: "Can I reschedule my appointment?",
          a: "Yes, you can reschedule appointments up to 24 hours before your scheduled time through the patient portal or by calling our office."
        },
        {
          q: "What if I need to cancel?",
          a: "You can cancel appointments through the patient portal or by calling us. We request at least 24 hours notice for cancellations."
        }
      ]
    },
    {
      id: "telehealth",
      title: "Telehealth Services",
      icon: Video,
      questions: [
        {
          q: "How do telehealth appointments work?",
          a: "Telehealth appointments are conducted via secure video calls. You'll receive a link before your appointment. Make sure you have a stable internet connection and a device with camera and microphone."
        },
        {
          q: "What equipment do I need?",
          a: "You'll need a computer, tablet, or smartphone with a camera and microphone, plus a stable internet connection. We recommend testing your equipment before your appointment."
        }
      ]
    },
    {
      id: "billing",
      title: "Billing & Insurance",
      icon: CreditCard,
      questions: [
        {
          q: "What insurance plans do you accept?",
          a: "We accept most major insurance plans. Please contact our office to verify your specific coverage before your appointment."
        },
        {
          q: "How do I pay my bill?",
          a: "You can pay your bill online through the patient portal, by phone, or by mail. We accept credit cards, debit cards, and checks."
        }
      ]
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      questions: [
        {
          q: "Is my information secure?",
          a: "Yes, we are fully HIPAA compliant and use enterprise-grade security measures to protect your personal and medical information."
        },
        {
          q: "Who can access my medical records?",
          a: "Only authorized healthcare providers and staff members directly involved in your care can access your medical records, in accordance with HIPAA regulations."
        }
      ]
    }
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "24/7 Emergency Line",
      contact: "(555) 911-HELP",
      action: "Call Now",
      onClick: () => window.location.href = 'tel:555-911-HELP'
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "General Inquiries",
      contact: "support@alturoshealth.com",
      action: "Send Email",
      onClick: () => window.location.href = 'mailto:support@alturoshealth.com'
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Available 24/7",
      contact: "Start Chat",
      action: "Chat Now",
      onClick: () => router.push('/chat')
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F3EC] via-[#D2CDB9] to-[#92A378]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                <HelpCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary font-[family-name:var(--font-heading)]">
                  Help Center
                </h1>
                <p className="text-xs text-muted-foreground">We're here to help you</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}> 
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6 font-[family-name:var(--font-heading)]">
            How can we help you?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find answers to common questions, get support, or contact our team directly
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg border-2 border-border focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-primary mb-12 text-center font-[family-name:var(--font-heading)]">
            Get in Touch
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                    <method.icon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-[family-name:var(--font-heading)] mb-2">
                    {method.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg font-semibold text-primary mb-4">{method.contact}</p>
                  <Button onClick={method.onClick} className="w-full">
                    {method.action}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-primary mb-12 text-center font-[family-name:var(--font-heading)]">
            Frequently Asked Questions
          </h3>
          <div className="max-w-4xl mx-auto space-y-6">
            {faqData.map((section) => (
              <Card key={section.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader 
                  className="cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <section.icon className="w-6 h-6 text-primary" />
                      <CardTitle className="text-xl font-[family-name:var(--font-heading)]">
                        {section.title}
                      </CardTitle>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                {expandedSections[section.id] && (
                  <CardContent className="pt-0">
                    <div className="space-y-6">
                      {section.questions.map((item, index) => (
                        <div key={index} className="border-l-4 border-primary/20 pl-4">
                          <h4 className="font-semibold text-foreground mb-2">{item.q}</h4>
                          <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Card className="border-0 shadow-xl bg-primary text-primary-foreground max-w-4xl mx-auto">
            <CardContent className="py-12">
              <h3 className="text-3xl font-bold mb-4 font-[family-name:var(--font-heading)]">
                Still need help?
              </h3>
              <p className="text-lg mb-8 opacity-90">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="text-lg px-8 py-6" onClick={() => router.push('/contact')}>
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
                  onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}