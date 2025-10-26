"use client";

import { doctors } from "@/app/constants";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export const DoctorsSection = ({ setShowBooking }: { setShowBooking: (value: boolean) => void }) => {
  return (
    <section id="doctors" className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Doctors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our experienced healthcare professionals are dedicated to your wellbeing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <img
                    src={doctor.image || "/placeholder.svg"}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                </div>
                <CardTitle className="text-xl">{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center gap-4 mb-4">
                  <Badge variant="outline" className="rounded-full">
                    {doctor.experience} experience
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
                <Button className="w-full rounded-full" onClick={() => setShowBooking(true)}>
                  Book Consultation
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
