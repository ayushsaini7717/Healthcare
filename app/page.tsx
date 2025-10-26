// app/page.tsx
"use client";

import {Navbar} from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import {ServicesSection} from "@/components/sections/ServicesSection";
import {DoctorsSection} from "@/components/sections/DoctorsSection";
import {ContactsSection} from "@/components/sections/ContactsSection";
import {Footer} from "@/components/Footer";
import AboutSection from "@/components/AboutSection";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main>
        <HeroSection />
        <AboutSection/>
        <ServicesSection setShowBooking={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
        <DoctorsSection setShowBooking={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
        <ContactsSection setShowChatbot={function (value: boolean): void {
          throw new Error("Function not implemented.");
        } } />
      </main>

      <Footer />
    </div>
  );
}
