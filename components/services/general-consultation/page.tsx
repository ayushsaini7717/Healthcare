"use client";

import { useState } from "react";
import { AppointmentBooking } from "@/components/appointment-booking";

export default function GeneralConsultationPage() {
  const [showBooking, setShowBooking] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">General Consultation</h1>
      <p className="text-gray-600 mb-6">
        Our General Consultation service provides a complete health checkup and
        personalized guidance from experienced doctors. Ideal for routine
        health monitoring and prevention.
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>Comprehensive physical examination</li>
        <li>Medical history evaluation</li>
        <li>Initial diagnosis and prescriptions</li>
        <li>Lifestyle and diet recommendations</li>
      </ul>

      <p className="text-lg font-semibold mb-4">Fee: ₹500 | Duration: 30 min</p>

      <button
        onClick={() => setShowBooking(true)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Book Appointment
      </button>

      {/* Show booking modal */}
      {showBooking && <AppointmentBooking onClose={() => setShowBooking(false)} />}
    </div>
  );
}
