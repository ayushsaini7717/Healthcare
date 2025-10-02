"use client";

import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = ({ setShowBooking }: { setShowBooking: any }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">HealthCare+</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#services"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </a>
            <a
              href="#doctors"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Doctors
            </a>
            <a
              href="#contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
            <Button
              onClick={() => {
                const token = localStorage.getItem("accessToken");
                if (!token) {
                  window.location.href = "/login"; // redirect if not logged in
                } else {
                  setShowBooking(true);
                }
              }}
              className="rounded-full"
            >
              Book Appointment
            </Button>

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="outline"
                className="rounded-full"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => {
                  // For now redirect → later you’ll integrate OTP modal
                  window.location.href = "/login";
                }}
                variant="outline"
                className="rounded-full"
              >
                Login
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};
