"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Stethoscope,
  Video,
  FileText,
  Truck,
  Pill,
} from "lucide-react";

const services = [
  {
    icon: <Calendar className="h-10 w-10 text-emerald-600" />,
    title: "Book Appointments",
    description:
      "Easily schedule in-person or online consultations with specialists at your convenience.",
  },
  {
    icon: <Video className="h-10 w-10 text-emerald-600" />,
    title: "Virtual Consultations",
    description:
      "Connect with doctors securely via high-quality video or audio calls — anytime, anywhere.",
  },
  {
    icon: <Stethoscope className="h-10 w-10 text-emerald-600" />,
    title: "Patient Health Records",
    description:
      "View and manage your complete medical history, prescriptions, and diagnostic reports in one place.",
  },
  {
    icon: <Truck className="h-10 w-10 text-emerald-600" />,
    title: "Ambulance Requests",
    description:
      "Request emergency ambulance service with live location tracking for fast response.",
  },
  {
    icon: <FileText className="h-10 w-10 text-emerald-600" />,
    title: "Digital Prescriptions",
    description:
      "Receive automatically generated prescriptions from your doctor — downloadable as PDFs.",
  },
  {
    icon: <Pill className="h-10 w-10 text-emerald-600" />,
    title: "Medicine Inventory",
    description:
      "Track medicine stock availability, refill reminders, and get alerts for low supplies.",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-emerald-50">
      <div className="container mx-auto px-6 text-center">
        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-6"
        >
          Our <span className="text-emerald-600">Services</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Explore the wide range of healthcare solutions we provide to make your experience 
          smooth, secure, and efficient.
        </motion.p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="p-8 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all border border-emerald-100"
            >
              <div className="flex justify-center mb-6">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
