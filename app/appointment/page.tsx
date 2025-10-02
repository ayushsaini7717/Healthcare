"use client";
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Clock, CreditCard, CheckCircle, ArrowLeft, Calendar, User, Heart } from "lucide-react"

// In-memory storage for appointments
const appointments = []

export default function AppointmentBookingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    doctor: "",
    date: "",
    time: "",
    notes: "",
  })
  const [paymentComplete, setPaymentComplete] = useState(false)

  const services = [
    { id: "general", name: "General Consultation", price: 500 },
    { id: "specialist", name: "Specialist Care", price: 800 },
    { id: "emergency", name: "Emergency Care", price: 1200 },
    { id: "screening", name: "Health Screening", price: 1500 },
  ]

  const doctors = [
    { id: "priya", name: "Dr. Priya Sharma", specialty: "General Medicine" },
    { id: "rajesh", name: "Dr. Rajesh Kumar", specialty: "Cardiology" },
    { id: "anita", name: "Dr. Anita Patel", specialty: "Pediatrics" },
  ]

  const timeSlots = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ]

  const handleSubmit = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      const appointment = {
        id: Date.now(),
        ...formData,
        status: "confirmed",
        paymentStatus: "paid",
        createdAt: new Date().toISOString(),
      }
      appointments.push(appointment)
      setPaymentComplete(true)
    }
  }

  const handleBack = () => {
    if (paymentComplete) {
      setPaymentComplete(false)
      setStep(1)
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        doctor: "",
        date: "",
        time: "",
        notes: "",
      })
    }
  }

  const selectedService = services.find((s) => s.id === formData.service)
  const selectedDoctor = doctors.find((d) => d.id === formData.doctor)

  const isStepValid = () => {
    if (step === 1) {
      return formData.name && formData.email && formData.phone
    }
    if (step === 2) {
      return formData.service && formData.doctor && formData.date && formData.time
    }
    return true
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-emerald-500" fill="currentColor" />
                <span className="text-xl font-bold">HealthCare+</span>
              </div>
              <nav className="flex items-center gap-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Doctors</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
                <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-full">
                  Book Appointment
                </Button>
                <Button variant="ghost">Logout</Button>
              </nav>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-12">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Book Another Appointment
          </Button>
          
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-sm border-0">
              <CardHeader className="text-center pb-4 bg-white">
                <div className="mx-auto mb-4 p-4 bg-emerald-50 rounded-full w-fit">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <CardTitle className="text-3xl text-gray-900 mb-2">Appointment Confirmed!</CardTitle>
                <CardDescription className="text-base text-gray-600">Your appointment has been successfully booked</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 bg-white">
                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Service</span>
                    <span className="font-semibold text-gray-900">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Doctor</span>
                    <span className="font-semibold text-gray-900">{selectedDoctor?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold text-gray-900">{formData.date}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold text-gray-900">{formData.time}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-xl font-bold text-emerald-500">₹{selectedService?.price}</span>
                  </div>
                </div>
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    A confirmation email has been sent to <strong className="text-gray-900">{formData.email}</strong>
                  </p>
                  <p className="text-xs text-gray-500">
                    Please arrive 10 minutes before your scheduled appointment time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-emerald-500" fill="currentColor" />
              <span className="text-xl font-bold">HealthCare+</span>
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Doctors</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-full">
                Book Appointment
              </Button>
              <Button variant="ghost">Logout</Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              Book Your Appointment
            </h1>
            <p className="text-gray-600">Schedule your visit with our healthcare professionals</p>
          </div>

          <Card className="shadow-sm border-0">
            <CardHeader className="bg-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    {step === 1 && (
                      <span className="flex items-center gap-2">
                        <User className="h-6 w-6 text-emerald-500" />
                        Personal Information
                      </span>
                    )}
                    {step === 2 && (
                      <span className="flex items-center gap-2">
                        <Calendar className="h-6 w-6 text-emerald-500" />
                        Appointment Details
                      </span>
                    )}
                    {step === 3 && (
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-emerald-500" />
                        Payment
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-600">
                    Step {step} of 3
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full transition-all ${
                      i <= step ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="bg-white">
              <div className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-gray-700">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="rounded-full border-gray-300 mt-2"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="rounded-full border-gray-300 mt-2"
                          placeholder="+91 XXXXX XXXXX"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-full border-gray-300 mt-2"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-gray-700">Additional Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any specific concerns or requirements..."
                        className="rounded-lg min-h-[100px] border-gray-300 mt-2"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700 mb-2">Select Service *</Label>
                      <Select
                        value={formData.service}
                        onValueChange={(value) => setFormData({ ...formData, service: value })}
                      >
                        <SelectTrigger className="rounded-full border-gray-300">
                          <SelectValue placeholder="Choose a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex justify-between items-center w-full">
                                <span>{service.name}</span>
                                <Badge variant="secondary" className="ml-2 bg-emerald-50 text-emerald-700">
                                  ₹{service.price}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700 mb-2">Select Doctor *</Label>
                      <Select
                        value={formData.doctor}
                        onValueChange={(value) => setFormData({ ...formData, doctor: value })}
                      >
                        <SelectTrigger className="rounded-full border-gray-300">
                          <SelectValue placeholder="Choose a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              <div>
                                <div className="font-medium">{doctor.name}</div>
                                <div className="text-sm text-gray-500">{doctor.specialty}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date" className="text-gray-700 mb-2">Preferred Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          min={new Date().toISOString().split("T")[0]}
                          className="rounded-full border-gray-300"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700 mb-2">Preferred Time *</Label>
                        <Select
                          value={formData.time}
                          onValueChange={(value) => setFormData({ ...formData, time: value })}
                        >
                          <SelectTrigger className="rounded-full border-gray-300">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {time}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4 text-lg text-gray-900">Appointment Summary</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium text-gray-900">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Doctor:</span>
                          <span className="font-medium text-gray-900">{selectedDoctor?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time:</span>
                          <span className="font-medium text-gray-900">
                            {formData.date} at {formData.time}
                          </span>
                        </div>
                        <hr className="my-2 border-gray-200" />
                        <div className="flex justify-between text-base">
                          <span className="font-semibold text-gray-900">Total Amount:</span>
                          <span className="font-bold text-lg text-emerald-500">₹{selectedService?.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2 text-lg text-gray-900">
                        <CreditCard className="h-5 w-5 text-emerald-500" />
                        Payment Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber" className="text-gray-700 mb-2">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="rounded-full border-gray-300"
                          />
                        </div>
                        <div>
                          <Label htmlFor="expiryDate" className="text-gray-700 mb-2">Expiry Date *</Label>
                          <Input id="expiryDate" placeholder="MM/YY" className="rounded-full border-gray-300" />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-gray-700 mb-2">CVV *</Label>
                          <Input id="cvv" placeholder="123" type="password" maxLength={3} className="rounded-full border-gray-300" />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="cardName" className="text-gray-700 mb-2">Cardholder Name *</Label>
                          <Input id="cardName" placeholder="John Doe" className="rounded-full border-gray-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="flex-1 rounded-full border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  <Button 
                    onClick={handleSubmit} 
                    disabled={!isStepValid()}
                    className="flex-1 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 3 ? "Pay & Book Appointment" : "Continue"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}