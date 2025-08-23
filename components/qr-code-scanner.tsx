"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Camera, X, CheckCircle, AlertCircle } from "lucide-react"

interface QRCodeScannerProps {
  onScan?: (data: string) => void
  onClose?: () => void
  isOpen?: boolean
}

export function QRCodeScanner({ onScan, onClose, isOpen = false }: QRCodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startScanning = async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera if available
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)

        // Start scanning for QR codes
        const scanInterval = setInterval(() => {
          processFrame()
        }, 500)

        // Clean up interval when component unmounts or scanning stops
        return () => {
          clearInterval(scanInterval)
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      console.error("Camera access error:", err)
    }
  }

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsScanning(false)
  }

  const processFrame = () => {
    if (videoRef.current && canvasRef.current && isScanning) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context && video.videoWidth > 0) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Get image data for QR code detection
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        
        // Real QR code detection - try to import jsQR if available
        try {
          // Check if jsQR is available (user needs to install: npm install jsqr)
          if (typeof window !== 'undefined' && (window as any).jsQR) {
            const jsQR = (window as any).jsQR
            const code = jsQR(imageData.data, imageData.width, imageData.height)
            
            if (code) {
              // QR code found! Process the data
              handleScan({ text: code.data })
              stopScanning()
              return
            }
          }
        } catch (error) {
          // Continue scanning if detection fails
        }
        
        // Continue processing frames
        if (isScanning) {
          requestAnimationFrame(processFrame)
        }
      }
    }
  }

  const handleScan = (result: any) => {
    if (result) {
      const scannedData = result.text
      setScannedData(scannedData)
      onScan?.(scannedData)
      
      // Parse the scanned data to extract appointment information
      try {
        // The QR code contains appointment data in a structured format
        // Format: "Appointment ID: APT12345678\nPatient: John Doe\nDoctor: Dr. Smith\nDate: 2024-01-15\nTime: 14:30"
        const lines = scannedData.split('\n')
        const appointmentData: any = {}
        
        lines.forEach((line: string) => {
          const [key, value] = line.split(': ')
          if (key && value) {
            appointmentData[key.trim()] = value.trim()
          }
        })
        
        // Use this data to navigate to the appointment or perform actions
        if (appointmentData['Appointment ID']) {
          // Navigate to appointment details or show appointment info
          // You can implement navigation logic here
        }
        
      } catch (error) {
        // Handle parsing errors silently
      }
    }
  }

  const handleClose = () => {
    stopScanning()
    setScannedData(null)
    setError(null)
    onClose?.()
  }

  useEffect(() => {
    return () => {
      stopScanning()
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <QrCode className="h-5 w-5" />
            <span>QR Code Scanner</span>
          </DialogTitle>
          <DialogDescription>Scan appointment QR codes for quick check-in</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!isScanning && !scannedData && !error && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center w-24 h-24 bg-healthcare-forest/10 rounded-full mx-auto">
                <Camera className="h-12 w-12 text-healthcare-forest" />
              </div>
              <p className="text-healthcare-forest/70">Click the button below to start scanning</p>
              <Button onClick={startScanning} className="bg-healthcare-forest hover:bg-healthcare-forest/90">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative">
                <video ref={videoRef} className="w-full h-64 bg-black rounded-lg object-cover" playsInline muted />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 border-2 border-healthcare-forest rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-healthcare-forest"></div>
                  <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-healthcare-forest"></div>
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-healthcare-forest"></div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-healthcare-forest"></div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-healthcare-forest/70 mb-2">Position QR code within the frame</p>
                <Button variant="outline" onClick={stopScanning}>
                  <X className="h-4 w-4 mr-2" />
                  Stop Scanning
                </Button>
              </div>
            </div>
          )}

          {scannedData && (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-healthcare-forest mb-2">QR Code Scanned Successfully!</h3>
                <Card className="bg-healthcare-cream/30 border-healthcare-sage/20">
                  <CardContent className="p-4">
                    <pre className="text-sm text-healthcare-forest whitespace-pre-wrap">{scannedData}</pre>
                  </CardContent>
                </Card>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setScannedData(null)
                    startScanning()
                  }}
                  className="flex-1"
                >
                  Scan Another
                </Button>
                <Button onClick={handleClose} className="flex-1 bg-healthcare-forest hover:bg-healthcare-forest/90">
                  Done
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-red-600 mb-2">Scanner Error</h3>
                <p className="text-red-600/80 text-sm">{error}</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setError(null)} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// QR Code Generator Component
export function QRCodeGenerator({ data, title }: { data: string; title?: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")

  useEffect(() => {
    // Real QR code generation using qrcode library
    const generateQRCode = async () => {
      try {
        // Use the qrcode library to generate QR codes locally
        // This avoids external API dependencies and works offline
        const QRCode = await import('qrcode')
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, data, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        })
        
        // Convert canvas to data URL
        const dataUrl = canvas.toDataURL('image/png')
        setQrCodeUrl(dataUrl)
      } catch (error) {
        // Fallback to external service if local generation fails
        const encodedData = encodeURIComponent(data)
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`
        setQrCodeUrl(qrUrl)
      }
    }

    if (data) {
      generateQRCode()
    }
  }, [data])

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-healthcare-sage/20">
      <CardHeader>
        <CardTitle className="text-healthcare-forest flex items-center space-x-2">
          <QrCode className="h-5 w-5" />
          <span>{title || "QR Code"}</span>
        </CardTitle>
        <CardDescription>Scan this code for quick access</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {qrCodeUrl && (
          <div className="flex justify-center">
            <img
              src={qrCodeUrl || "/placeholder.svg"}
              alt="QR Code"
              className="border border-healthcare-sage/20 rounded-lg"
            />
          </div>
        )}
        <div className="text-xs text-healthcare-forest/60 bg-healthcare-cream/30 p-2 rounded">
          <pre className="whitespace-pre-wrap">{data}</pre>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          Print QR Code
        </Button>
      </CardContent>
    </Card>
  )
}
