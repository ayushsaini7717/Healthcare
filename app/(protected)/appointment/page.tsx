"use client"

import React, { useState } from "react"
import { AppointmentBooking } from "@/components/appointment-booking"
import { Button } from "@/components/ui/button"

export default function AppointmentPage() {
  const [showBooking, setShowBooking] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
      <div className="w-full max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Book Your Appointment
        </h1>

        {!showBooking && (
          <div className="text-center">
            <Button onClick={() => setShowBooking(true)} className="rounded-full">
              Start Booking
            </Button>
          </div>
        )}

        {showBooking && <AppointmentBooking onClose={() => setShowBooking(false)} />}
      </div>
    </div>
  )
}
