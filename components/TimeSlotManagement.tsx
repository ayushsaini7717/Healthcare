"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Loader,
  Plus,
  List,
  Stethoscope,
  Video,
  Trash2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// --------------------------------------------------------------------
// STAND-IN SESSION HOOK (Replace with actual import in production)
// --------------------------------------------------------------------
const useSession = () => ({
  data: {
    user: {
      role: "HOSPITAL_ADMIN", // Mock role
      hospitalId: "mock-hospital-123", // Mock ID
    },
  },
  status: "authenticated",
});

// --------------------------------------------------------------------
// TYPES (from the original file)
// --------------------------------------------------------------------
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  createdAt: string; // Assuming ISO string
}

interface TimeSlot {
  id: string;
  startTime: string; // ISO DateTime string from API
  endTime: string; // ISO DateTime string from API
  doctorId: string | null;
  doctor: {
    name: string;
  } | null;
  isBooked: boolean;
}

// ====================================================================
// API URLs
// ====================================================================
const DOCTORS_API_URL = '/api/admin/doctors';
const SLOTS_API_URL = '/api/admin/slots';

// ====================================================================
// Helper Functions
// ====================================================================
const formatDateTimeToTimeString = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (e) {
        console.error("Error formatting date:", e);
        return "Invalid Time";
    }
};

// ====================================================================
// Notification Component (Dependency for TimeSlotManagement)
// ====================================================================
interface NotificationBoxProps {
  type: "success" | "error";
  title: string;
  message: string;
}

const NotificationBox: React.FC<NotificationBoxProps> = ({ type, title, message }) => {
  const isSuccess = type === "success";
  const Icon = isSuccess ? CheckCircle : AlertCircle;
  
  const baseClasses = "p-4 rounded-lg border flex gap-3 shadow-md";
  const colorClasses = isSuccess
    ? "bg-green-100 border-green-200"
    : "bg-red-100 border-red-200";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const titleColor = isSuccess ? "text-green-700" : "text-red-700";
  const textColor = isSuccess ? "text-green-600/90" : "text-red-600/90";

  return (
    <div className={`${baseClasses} ${colorClasses}`}>
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        <h3 className={`font-semibold ${titleColor}`}>{title}</h3>
        <p className={`text-sm ${textColor}`}>{message}</p>
      </div>
    </div>
  );
};

// ====================================================================
// TIME SLOT MANAGEMENT COMPONENT
// ====================================================================
const TimeSlotManagement = () => {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSlot, setNewSlot] = useState({
    startTime: "09:00", // Default start time
    endTime: "10:00",   // Default end time
    doctorId: "general", // 'general' for video calls
  });

  // Fetch both Doctors (for the dropdown) and existing Slots
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [docResponse, slotResponse] = await Promise.all([
        fetch(DOCTORS_API_URL),
        fetch(SLOTS_API_URL),
      ]);
      if (!docResponse.ok) throw new Error("Failed to fetch doctors");
      if (!slotResponse.ok) {
        const errData = await slotResponse.json();
        throw new Error(errData.message || "Failed to fetch slots");
      }

      const docData: Doctor[] = await docResponse.json();
      const slotData: TimeSlot[] = await slotResponse.json();
      
      setDoctors(docData);
      setSlots(slotData);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    if (hospitalId) fetchData();
  }, [hospitalId, fetchData]);

  // Add Time Slot
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      startTime: newSlot.startTime, // Send as "HH:MM"
      endTime: newSlot.endTime,     // Send as "HH:MM"
      doctorId: newSlot.doctorId === "general" ? null : newSlot.doctorId,
    };

    try {
      const response = await fetch(SLOTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to add slot.");
      }

      const addedSlot: TimeSlot = await response.json();
      setSlots((prev) => [...prev, addedSlot].sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())); // Keep sorted
      setSuccess("Time slot added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Error adding time slot.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Time Slot
  const handleDeleteSlot = async (slotId: string) => {
    if (!window.confirm("Are you sure you want to delete this time slot? This cannot be undone.")) {
      return;
    }
    
    setError("");
    setSuccess("");
    try {
      const response = await fetch(`${SLOTS_API_URL}?id=${slotId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to delete slot.");
      }
      
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
      setSuccess("Time slot deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any)      {
      setError(err.message || "Error deleting time slot.");
    }
  };

  return (
    <div className="space-y-6">
      {success && <NotificationBox type="success" title="Success" message={success} />}
      {error && <NotificationBox type="error" title="Error" message={error} />}

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" />
            Create New Time Slot
          </CardTitle>
          <CardDescription>
            Define availability for in-person or video appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Doctor Select */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Assign To <span className="text-red-500">*</span>
                </label>
                <select
                  value={newSlot.doctorId}
                  onChange={(e) => setNewSlot({ ...newSlot, doctorId: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                >
                  <option value="general">General (Video Call)</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.specialty})
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-full h-10">
              {isSubmitting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating Slot...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Create Slot
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary">
              <List className="h-5 w-5" />
              Active Time Slots
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {slots.length} Slots
            </Badge>
          </div>
          <CardDescription>All available appointment slots for your hospital</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading slots...</span>
            </div>
          ) : error && slots.length === 0 ? (
             <NotificationBox type="error" title="Error" message={error} />
          ) : slots.length === 0 ? (
             <p className="text-center text-muted-foreground py-4">No time slots created. Add your first slot above.</p>
          ) : (
            <div className="space-y-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors flex justify-between items-center shadow-sm"
                >
                  <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-full ${slot.doctorId ? 'bg-primary/10' : 'bg-green-500/10'}`}>
                      {slot.doctorId ? (
                        <Stethoscope className="h-5 w-5 text-primary" />
                      ) : (
                        <Video className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {formatDateTimeToTimeString(slot.startTime)} – {formatDateTimeToTimeString(slot.endTime)}
                      </p>
                      <p className="text-sm text-muted-foreground font-medium">
                        {slot.doctor ? slot.doctor.name : "General Video Call"}
                      </p>
                    </div>
                  </div>
                  {/* Disable delete if slot is booked */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`text-muted-foreground hover:text-destructive hover:bg-destructive/10 ${slot.isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => !slot.isBooked && handleDeleteSlot(slot.id)}
                    disabled={slot.isBooked}
                    title={slot.isBooked ? "Cannot delete a booked slot" : "Delete slot"}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeSlotManagement;
