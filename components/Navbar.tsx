"use client";

import { useState } from "react";
import Link from "next/link"; // Keep Link for navigation
import Image from "next/image"; // Add Image for optimized images
import { useSession, signOut, signIn } from "next-auth/react";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Building2,
  ChevronDown, // Keep ChevronDown for dropdowns
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedLink from "./ProtectedLink"; // New import

export const Navbar = () => {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex justify-center items-center gap-2">
          <Image height={100} width={100} src="/digital.png" alt="Digital Logo"></Image>
          <Image height={50} width={50} src="/btkitlogo1.jpeg" alt="BTKIT Logo"></Image>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">
            Health<span className="text-emerald-600">Care+</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#services" className="text-gray-600 hover:text-emerald-600 font-medium">
            Services
          </Link>
          {/* <Link href="#doctors" className="text-gray-600 hover:text-emerald-600 font-medium">
            Doctors
          </Link> */}
          <Link href="#contact" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">
            Contact
          </Link>

          <ProtectedLink
            href="/appointments/hospitals"
            requiredRoles={["PATIENT", "DOCTOR", "HOSPITAL_STAFF", "HOSPITAL_ADMIN", "SUPER_ADMIN"]}
            className="text-gray-600 hover:text-emerald-600 font-medium"
          >
            Book Appointment
          </ProtectedLink>

          {/* Admin Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              className="rounded-full flex items-center gap-2"
              onClick={() => setShowAdminMenu(!showAdminMenu)}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Button>
            {showAdminMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border">
                <ProtectedLink
                  href="/HospitalAdminPanel"
                  requiredRoles={["HOSPITAL_ADMIN", "HOSPITAL_STAFF"]}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  <Building2 className="w-4 h-4 text-emerald-600" /> Hospital Admin
                </ProtectedLink>
                <ProtectedLink
                  href="/super-admin/dashboard"
                  requiredRoles={["SUPER_ADMIN"]}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  <Shield className="w-4 h-4 text-emerald-600" /> Super Admin
                </ProtectedLink>
              </div>
            )}
          </div>

          {/* Auth Buttons */}
          {!session ? (
            <div className="flex items-center gap-3">
              <Link href="/signup">
                <Button className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Sign Up
                </Button>
              </Link>
              <Button
                onClick={() => signIn()}
                variant="outline"
                className="rounded-full"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-600 text-white font-semibold"
              >
                {session.user?.email?.slice(0, 1).toUpperCase()}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg border">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <User className="w-4 h-4 text-emerald-600" /> My Profile
                  </Link>
                  {(session.user as any)?.role === "DOCTOR" && (
                    <Link
                      href="/doctor/workspace"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                    >
                      <Shield className="w-4 h-4 text-emerald-600" /> Doctor Workspace
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    <LogOut className="w-4 h-4 text-red-500" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-gray-800" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-md py-4 space-y-3">
          <Link href="#services" className="block text-center text-gray-700 hover:text-emerald-600">
            Services
          </Link>
          <Link href="#doctors" className="block text-center text-gray-700 hover:text-emerald-600">
            Doctors
          </Link>
          <Link href="#contact" className="block text-center text-gray-700 hover:text-emerald-600">
            Contact
          </Link>


          {/* Mobile Auth Buttons */}
          {!session ? (
            <div className="flex flex-col items-center gap-2 pt-3">
              <Link href="/signup" className="w-3/4">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-full">
                  Sign Up
                </Button>
              </Link>
              <Button
                onClick={() => signIn()}
                variant="outline"
                className="w-3/4 rounded-full"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 pt-3">
              <Link href="/dashboard" className="text-gray-700 hover:text-emerald-600">
                My Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="text-gray-600 hover:text-red-500 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>

            </div>
          )}
        </div>
      )}
    </header>
  );
};
