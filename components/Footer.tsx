"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* 🏥 Hospital Info */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">HealthCloud</h2>
          <p className="text-sm leading-relaxed">
            A cloud-based hospital management system designed to make healthcare
            smarter, faster, and more connected.
          </p>
        </div>

        {/* ⚙️ Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/appointment-book" className="hover:text-white transition-colors">
                Book Appointment
              </Link>
            </li>
            <li>
              <Link href="/consultation" className="hover:text-white transition-colors">
                Video Consultation
              </Link>
            </li>
            <li>
              <Link href="/contact-us" className="hover:text-white transition-colors">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-and-conditions" className="hover:text-white transition-colors">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* 📞 Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-emerald-400" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-400" />
              support@healthcloud.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-400" />
              123 Health Street, Almora, Uttarakhand
            </li>
          </ul>
        </div>

        {/* 🌐 Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="hover:text-emerald-400 transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="hover:text-emerald-400 transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="hover:text-emerald-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="hover:text-emerald-400 transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} HealthCloud. All rights reserved.
      </div>
    </footer>
  );
};
