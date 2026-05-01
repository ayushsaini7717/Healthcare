"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Search, ChevronRight, Stethoscope } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  specialties: string[];
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/hospitals")
      .then((res) => res.json())
      .then((data) => {
        setHospitals(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hospitals", err);
        setLoading(false);
      });
  }, []);

  const filteredHospitals = hospitals.filter((h) =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Select Hospital</h1>
          <p className="text-muted-foreground text-lg">Choose a healthcare facility to book your appointment.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or city..."
            className="pl-10 h-12 rounded-xl shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-3xl" />
          ))}
        </div>
      ) : filteredHospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden group">
                <div className="h-3 bg-primary/80" />
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="rounded-full px-3">
                      Approved
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold mt-4 group-hover:text-primary transition-colors">
                    {hospital.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1.5 mt-1 text-base">
                    <MapPin className="h-4 w-4" />
                    {hospital.city}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {hospital.specialties.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="bg-muted/50 border-muted-foreground/20">
                          {spec}
                        </Badge>
                      ))}
                      {hospital.specialties.length > 3 && (
                        <Badge variant="outline">+{hospital.specialties.length - 3} more</Badge>
                      )}
                    </div>
                    
                    <Link href={`/appointments/hospitals/${hospital.id}/departments`} className="block w-full">
                      <Button className="w-full h-12 rounded-xl text-base font-semibold group-hover:gap-3 transition-all">
                        Book Appointment
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-semibold">No hospitals found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search query.</p>
        </div>
      )}
    </div>
  );
}
