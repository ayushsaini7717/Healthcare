"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import BookingProgress from "@/components/appointments/BookingProgress";
import {
  Building2,
  MapPin,
  Search,
  ChevronRight,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Baby,
  Users,
  Zap,
  Shield,
  Clock,
  Star,
  CheckCircle2,
  Filter,
  X,
} from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  specialties: string[];
}

// Map specialty names to icons and colors
const SPECIALTY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Cardiology:       { icon: <Heart className="h-3.5 w-3.5" />,       color: "text-rose-600",   bg: "bg-rose-50 border-rose-200" },
  Neurology:        { icon: <Brain className="h-3.5 w-3.5" />,        color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  Orthopedics:      { icon: <Bone className="h-3.5 w-3.5" />,         color: "text-amber-600",  bg: "bg-amber-50 border-amber-200" },
  Pediatrics:       { icon: <Baby className="h-3.5 w-3.5" />,         color: "text-pink-600",   bg: "bg-pink-50 border-pink-200" },
  Gynecology:       { icon: <Users className="h-3.5 w-3.5" />,        color: "text-fuchsia-600",bg: "bg-fuchsia-50 border-fuchsia-200" },
  Emergency:        { icon: <Zap className="h-3.5 w-3.5" />,          color: "text-red-600",    bg: "bg-red-50 border-red-200" },
  "General Medicine":{ icon: <Stethoscope className="h-3.5 w-3.5" />, color: "text-blue-600",   bg: "bg-blue-50 border-blue-200" },
};

const DEFAULT_SPECIALTY = { icon: <Shield className="h-3.5 w-3.5" />, color: "text-slate-600", bg: "bg-slate-50 border-slate-200" };

// Pull the specialty base name from "General Medicine - OPD Consultation" → "General Medicine"
function extractSpecialty(fullName: string): string {
  return fullName.split(" - ")[0].trim();
}

// Hero stats
const STATS = [
  { label: "Hospitals", value: "10+", icon: <Building2 className="h-5 w-5" /> },
  { label: "Specialists", value: "20+", icon: <Stethoscope className="h-5 w-5" /> },
  { label: "Departments", value: "8+",  icon: <Shield className="h-5 w-5" /> },
  { label: "Cities Covered", value: "8+", icon: <MapPin className="h-5 w-5" /> },
];

// Gradient accent colors per hospital index
const ACCENT_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-sky-600",
  "from-fuchsia-500 to-pink-600",
  "from-lime-500 to-green-600",
  "from-red-500 to-rose-600",
  "from-teal-500 to-cyan-600",
];

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All");

  useEffect(() => {
    fetch("/api/hospitals")
      .then((res) => res.json())
      .then((data) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const districts = useMemo(() => {
    const all = hospitals.map((h) => h.city);
    return ["All", ...Array.from(new Set(all))];
  }, [hospitals]);

  const filteredHospitals = useMemo(() =>
    hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDistrict = selectedDistrict === "All" || h.city === selectedDistrict;
      return matchesSearch && matchesDistrict;
    }),
    [hospitals, searchQuery, selectedDistrict]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20">

      {/* ── Hero Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white">
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-60 w-60 rounded-full bg-teal-400/10 blur-2xl" />

        <div className="container mx-auto px-4 py-16 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-5">
              <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              Uttarakhand Government Hospitals
            </div>
            <h1 className="text-5xl font-black tracking-tight leading-tight mb-4">
              Book Your OPD<br />
              <span className="text-emerald-200">Appointment Online</span>
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-xl">
              Skip the queues. Select a government hospital near you, choose your department
              and preferred time slot — all in under 2 minutes.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12"
          >
            {STATS.map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 text-emerald-200 mb-1">{s.icon}<span className="text-xs font-semibold uppercase tracking-widest">{s.label}</span></div>
                <p className="text-3xl font-black">{s.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Booking Progress ── */}
      <BookingProgress currentStep={0} />

      {/* ── Search + Filter Bar ── */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200/70 shadow-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              placeholder="Search hospitals, cities, districts..."
              className="pl-12 h-12 rounded-2xl border-slate-200 bg-white text-base shadow-sm focus:ring-2 focus:ring-emerald-500/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* District Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none flex-shrink-0">
            <Filter className="h-4 w-4 text-slate-500 shrink-0" />
            <div className="flex gap-2">
              {districts.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDistrict(d)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    selectedDistrict === d
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                      : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 py-10 max-w-7xl">

        {/* Results count */}
        {!loading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 font-medium mb-6"
          >
            Showing <span className="text-emerald-600 font-bold">{filteredHospitals.length}</span> hospital{filteredHospitals.length !== 1 ? "s" : ""}
            {selectedDistrict !== "All" && <> in <span className="text-emerald-600 font-bold">{selectedDistrict}</span></>}
          </motion.p>
        )}

        {/* Cards Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-md animate-pulse">
                  <div className="h-36 bg-slate-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-slate-200 rounded-full w-3/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-1/2" />
                    <div className="flex gap-2 mt-2">
                      {[1, 2].map((j) => <div key={j} className="h-6 w-20 bg-slate-100 rounded-full" />)}
                    </div>
                    <div className="h-11 bg-slate-200 rounded-2xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredHospitals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredHospitals.map((hospital, index) => {
                const gradient = ACCENT_GRADIENTS[index % ACCENT_GRADIENTS.length];
                // Deduplicate specialty base names
                const uniqueSpecialties = Array.from(
                  new Set(hospital.specialties.map(extractSpecialty))
                );

                return (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.35 }}
                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 flex flex-col"
                  >
                    {/* Gradient Header */}
                    <div className={`relative h-36 bg-gradient-to-br ${gradient} flex flex-col justify-between p-5`}>
                      {/* Top row */}
                      <div className="flex justify-between items-start">
                        <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-2xl">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs font-bold">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                          Accepting Appointments
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
                        <MapPin className="h-4 w-4 text-white/70 shrink-0" />
                        <span>{hospital.address}, {hospital.city}</span>
                      </div>

                      {/* Decorative circle */}
                      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-white/5" />
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex flex-col flex-1 gap-4">
                      {/* Hospital Name */}
                      <div>
                        <h2 className="text-xl font-black text-slate-800 leading-tight group-hover:text-emerald-700 transition-colors">
                          {hospital.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-slate-500">Government Hospital · Verified</span>
                        </div>
                      </div>

                      {/* Specialties */}
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Departments</p>
                        <div className="flex flex-wrap gap-1.5">
                          {uniqueSpecialties.slice(0, 4).map((spec) => {
                            const cfg = SPECIALTY_CONFIG[spec] ?? DEFAULT_SPECIALTY;
                            return (
                              <span
                                key={spec}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color} ${cfg.bg}`}
                              >
                                {cfg.icon} {spec}
                              </span>
                            );
                          })}
                          {uniqueSpecialties.length > 4 && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-slate-50 border-slate-200 text-slate-500">
                              +{uniqueSpecialties.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Info Pills */}
                      <div className="flex gap-3 text-xs text-slate-500 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-emerald-500" />
                          Mon – Sat · 9 AM – 5 PM
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="h-3.5 w-3.5 text-emerald-400" />
                          OPD Available
                        </div>
                      </div>

                      <Link
                        href={`/appointments/hospitals/${hospital.id}/departments`}
                        className="mt-auto block"
                      >
                        <Button
                          className="w-full h-12 rounded-2xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200 transition-all group/btn"
                        >
                          Book Appointment
                          <ChevronRight className="h-5 w-5 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner"
            >
              <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-5">
                <Building2 className="h-10 w-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-700">No hospitals found</h3>
              <p className="text-slate-400 mt-2 mb-6">Try a different search term or district filter.</p>
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(""); setSelectedDistrict("All"); }}
                className="rounded-2xl px-6"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom note */}
        {!loading && filteredHospitals.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-slate-400 text-sm mt-12"
          >
            All hospitals listed are government-verified. For emergencies, call <span className="font-bold text-rose-500">112</span>.
          </motion.p>
        )}
      </div>
    </div>
  );
}
