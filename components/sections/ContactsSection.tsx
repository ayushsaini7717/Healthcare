"use client";

import { motion } from "framer-motion";
import { Phone, MapPin, Mail, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 bg-emerald-50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-emerald-100/40" />

      <div className="container mx-auto px-6 relative z-10">
        {/* 🏥 Header */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-gray-900 mb-6"
        >
          Get In <span className="text-emerald-600">Touch</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-center text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          Have questions or need medical assistance? We’re always here to help.
          Contact us or visit our hospital directly.
        </motion.p>

        {/* 📍 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-md text-center"
          >
            <Phone className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Phone</h4>
            <p className="text-gray-600">+91 98000 00067</p>
            <p className="text-gray-500 text-sm">24/7 Emergency Helpline</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-md text-center"
          >
            <MapPin className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Location</h4>
            <p className="text-gray-600">123 Health Street</p>
            <p className="text-gray-500 text-sm">Almora, Uttarakhand</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-8 shadow-md text-center"
          >
            <Mail className="h-8 w-8 text-emerald-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg text-gray-900 mb-2">Email</h4>
            <p className="text-gray-600">support@healthcareplus.in</p>
            <p className="text-gray-500 text-sm">We reply within 24 hours</p>
          </motion.div>
        </div>

        {/* 📝 Contact Form */}
        <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-md">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-700 font-medium">Name</label>
              <input
                type="text"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="text-gray-700 font-medium">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-gray-700 font-medium">Message</label>
              <textarea
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                rows={4}
                placeholder="Write your message here..."
              ></textarea>
            </div>

            <div className="md:col-span-2 text-center">
              <Button className="rounded-full px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-700 text-white">
                Send Message
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ❤️ Bottom Decorative Icon */}
      <div className="absolute bottom-8 right-8 opacity-20">
        <HeartPulse className="h-32 w-32 text-emerald-500" />
      </div>
    </section>
  );
}

