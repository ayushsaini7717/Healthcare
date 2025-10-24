"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export default function AppointmentManagement() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Calendar className="h-5 w-5" /> Appointment Review
        </CardTitle>
        <CardDescription>View and manage pending patient bookings</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This section will display pending appointments for confirmation/cancellation and video links.
        </p>
      </CardContent>
    </Card>
  );
}
