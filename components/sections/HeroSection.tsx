"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Video, MessageCircle, Ambulance } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-white py-24">
      <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        
        {/* 🩺 Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Your <span className="text-emerald-600">Health</span>, Our Priority
          </h1>

          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Compassionate care powered by technology — book appointments, consult virtually, 
            and access medical assistance anytime, anywhere.
          </p>

          {/* 🎯 Main Action Buttons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/appointment-book">
              <Button className="rounded-full text-lg px-8 py-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                <Calendar className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </Link>

            <Link href="/consultation">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
              >
                <Video className="mr-2 h-5 w-5" />
                Join Consultation
              </Button>
            </Link>

            <Link href="https://medical-chatbot4-1.onrender.com/">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6 border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Chat Assistant
              </Button>
            </Link>

            <Link href="/ambulances">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
              >
                <Ambulance className="mr-2 h-5 w-5" />
                Find Ambulance
              </Button>
            </Link>
            <Link href="/ambulances/register">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
              >
                <Ambulance className="mr-2 h-5 w-5" />
                Register ambulance
              </Button>
            </Link>
            <Link href="/hospital-register">
              <Button
                variant="outline"
                className="rounded-full text-lg px-8 py-6 border-emerald-500 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-all"
              >
                Register hospital
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* 🖼️ Illustration Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
          className="flex justify-center md:justify-end"
        >
          <img
            src="/hero-illustration.png"
            alt="Healthcare illustration"
            className="w-[90%] md:w-[480px] rounded-3xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}