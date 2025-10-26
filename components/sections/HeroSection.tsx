"use client";

import { Button } from "@/components/ui/button";
import { Video, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="py-20 px-4 from-emerald-50 via-white to-white">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* 🏥 Headline */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Your Health, Our Priority
          </h1>

          {/* 💬 Subtext */}
          <p className="text-lg text-gray-600 mb-10 leading-relaxed">
            Experience compassionate care with our expert doctors.  
            Book appointments easily, connect virtually, and manage your health securely — anytime, anywhere.
          </p>

          {/* 🎯 CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* Book Appointment */}
            <Link href="/appointment-book">
              <Button className="rounded-full text-lg px-8 py-6">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>

            {/* Join Consultation */}
            <Link href="/consultation">
              <Button className="rounded-full text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                <Video className="mr-2 h-5 w-5" />
                Join Consultation
              </Button>
            </Link>

            {/* Chat Assistant */}
            <Link href="/chat-assistant">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat Assistant
              </Button>
            </Link>

            {/* Hospital Admin */}
            <Link href="/HospitalAdminPanel">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6"
              >
                Hospital Admin?
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
