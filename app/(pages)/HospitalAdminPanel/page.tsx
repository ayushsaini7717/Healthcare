"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, UserPlus, Clock, DollarSign, Heart, LogOut, Stethoscope, Plus, Loader, AlertCircle, CheckCircle, Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";


const signIn = (provider: string) =>
  console.log(`[AUTH STAND-IN] Signing in via ${provider}...`);

interface Role {
    PATIENT: 'PATIENT';
    HOSPITAL_ADMIN: 'HOSPITAL_ADMIN';
    SUPER_ADMIN: 'SUPER_ADMIN';
}
const Role: Role = {
    PATIENT: 'PATIENT',
    HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
    SUPER_ADMIN: 'SUPER_ADMIN',
};


interface Doctor {
  id: string;
  name: string;
  specialty: string;
  createdAt: string;
}

interface TimeSlot {
    id: string;
    startTime: string; 
    endTime: string;   
    isBooked: boolean;
    doctor?: Doctor; 
    doctorId?: string;
    createdAt: string;
}


const DOCTORS_API_URL = '/api/admin/doctors'; 

const DoctorManagement = () => {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newDoctor, setNewDoctor] = useState({ name: "", specialty: "" });
  
  const fetchDoctors = useCallback(async () => {
    if (!hospitalId) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(DOCTORS_API_URL);
      if (!response.ok) {
        throw new Error("Failed to fetch doctors.");
      }
      const data: Doctor[] = await response.json();
      setDoctors(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred while fetching doctors.");
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name || !newDoctor.specialty || !hospitalId) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
        const response = await fetch(DOCTORS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                name: newDoctor.name,
                specialty: newDoctor.specialty,
                hospitalId: hospitalId, 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add doctor.");
        }
        
        const addedDoctor: Doctor = await response.json();
        setDoctors((prev) => [...prev, addedDoctor]);
        setNewDoctor({ name: "", specialty: "" });
        setSuccess(`Dr. ${addedDoctor.name} added successfully!`);
        setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
        setError(err.message || "Error adding doctor. Ensure API route is accessible.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-4 bg-green-100 border border-green-200 rounded-lg flex gap-3 shadow-md">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-700">Success</h3>
            <p className="text-sm text-green-600/90">{success}</p>
          </div>
        </div>
      )}

      <Card className="shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-primary">
            <UserPlus className="h-5 w-5" />
            Register New Doctor
          </CardTitle>
          <CardDescription>
            Add a new doctor to your hospital staff by specialty
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-200 rounded-lg flex gap-3 shadow-md">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-700">Error</h3>
                <p className="text-sm text-red-600/90">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleAddDoctor} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Doctor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDoctor.name}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, name: e.target.value })
                  }
                  placeholder="Dr. Jane Doe"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-foreground">
                  Specialty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDoctor.specialty}
                  onChange={(e) =>
                    setNewDoctor({ ...newDoctor, specialty: e.target.value })
                  }
                  placeholder="Cardiology, Pediatrics..."
                  required
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-full h-10">
              {loading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Adding Doctor...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Add Doctor
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
              <Stethoscope className="h-5 w-5" />
              Current Staff
            </CardTitle>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                {doctors.length} Doctors
            </Badge>
          </div>
          <CardDescription>Manage your hospital’s active medical personnel</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && doctors.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2 text-muted-foreground">Loading staff...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {doctors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No doctors registered yet.</div>
              ) : (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors flex justify-between items-center shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{doctor.name}</p>
                      <p className="text-sm text-primary font-medium">{doctor.specialty}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      Joined: {new Date(doctor.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};



const SLOTS_API_URL = '/api/admin/slots';

const TimeSlotManagement = () => {
    const { data: session } = useSession() as any;
    const hospitalId = session?.user?.hospitalId;

    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [newSlot, setNewSlot] = useState({
        doctorId: 'general', // 'general' for video/non-specific, or a doctor ID
        startTime: '',
        endTime: '',
    });

    const fetchDoctors = useCallback(async () => {
        try {
            const response = await fetch(DOCTORS_API_URL);
            if (response.ok) {
                const data: Doctor[] = await response.json();
                setDoctors(data);
            }
        } catch (e) {
            console.error("Failed to fetch doctors for slot assignment:", e);
        }
    }, []);

    const fetchSlots = useCallback(async () => {
        if (!hospitalId) return;

        setLoading(true);
        setError("");
        try {
            const response = await fetch(SLOTS_API_URL);
            if (!response.ok) {
                throw new Error("Failed to fetch slots.");
            }
            const data: TimeSlot[] = await response.json();
            setSlots(data);
        } catch (err: any) {
            setError(err.message || "An error occurred while fetching time slots.");
        } finally {
            setLoading(false);
        }
    }, [hospitalId]);

    useEffect(() => {
        fetchDoctors();
        fetchSlots();
    }, [fetchDoctors, fetchSlots]);


    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSlot.startTime || !newSlot.endTime || !hospitalId) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                startTime: newSlot.startTime,
                endTime: newSlot.endTime,
                hospitalId: hospitalId,
                doctorId: newSlot.doctorId === 'general' ? null : newSlot.doctorId,
            };

            const response = await fetch(SLOTS_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to add time slot.");
            }

            const addedSlot: TimeSlot = await response.json();
            setSlots(prev => [...prev, addedSlot]);
            setNewSlot({ doctorId: 'general', startTime: '', endTime: '' });
            setSuccess("Time slot added successfully!");
            setTimeout(() => setSuccess(""), 3000);

        } catch (err: any) {
            setError(err.message || "Error adding slot. Check time formats.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSlot = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this time slot?")) return;

        try {
            const response = await fetch(`${SLOTS_API_URL}?id=${id}`, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error("Failed to delete slot.");
            }

            setSlots(prev => prev.filter(slot => slot.id !== id));
            setSuccess("Time slot deleted successfully!");
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message || "Error deleting slot.");
        }
    };

    return (
        <div className="space-y-6">
            {success && (
                <div className="p-4 bg-green-100 border border-green-200 rounded-lg flex gap-3 shadow-md">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 font-medium">{success}</p>
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-100 border border-red-200 rounded-lg flex gap-3 shadow-md">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
            )}

            <Card className="shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Plus className="h-5 w-5" />
                        Define New Availability Slot
                    </CardTitle>
                    <CardDescription>
                        Set recurring time slots for doctors or general video calls.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddSlot} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Doctor Selection */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Assign To
                                </label>
                                <select
                                    value={newSlot.doctorId}
                                    onChange={(e) => setNewSlot({ ...newSlot, doctorId: e.target.value })}
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                                >
                                    <option value="general">General Video/In-Person Slot</option>
                                    {doctors.map(doc => (
                                        <option key={doc.id} value={doc.id}>{doc.name} ({doc.specialty})</option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground mt-1">"General" is for shared availability (e.g., video calls).</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={newSlot.startTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-foreground">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={newSlot.endTime}
                                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
                                />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full rounded-full h-10">
                            {loading ? (
                                <>
                                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                                    Saving Slot...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" /> Add Availability Slot
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
                            <Clock className="h-5 w-5" />
                            Active Slots
                        </CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                            {slots.length} Slots Defined
                        </Badge>
                    </div>
                    <CardDescription>All defined time slots available for booking.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && slots.length === 0 ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader className="h-6 w-6 text-primary animate-spin" />
                            <span className="ml-2 text-muted-foreground">Loading slots...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {slots.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No availability slots defined yet.</div>
                            ) : (
                                slots.map((slot) => {
                                    const assignedDoctor = doctors.find(doc => doc.id === slot.doctorId);
                                    const assignmentText = assignedDoctor 
                                        ? `${assignedDoctor.name} (${assignedDoctor.specialty})`
                                        : "General / Video Slot";
                                    const assignmentColor = assignedDoctor ? 'text-green-600' : 'text-blue-600';

                                    return (
                                        <div
                                            key={slot.id}
                                            className="p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-colors flex justify-between items-center shadow-sm"
                                        >
                                            <div>
                                                <p className="font-semibold text-foreground">
                                                    {slot.startTime} - {slot.endTime}
                                                </p>
                                                <p className={`text-sm font-medium ${assignmentColor}`}>
                                                    Assigned to: {assignmentText}
                                                </p>
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                className="text-muted-foreground hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};



const AppointmentManagement = () => (
  <Card className="shadow-lg h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-primary">
        <Calendar className="h-5 w-5" />
        Appointment Review
      </CardTitle>
      <CardDescription>View and manage pending patient bookings</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        This section will display pending appointments for review (Confirm/Cancel), including generation of video links for remote visits.
      </p>
    </CardContent>
  </Card>
);

const ServiceManagement = () => (
  <Card className="shadow-lg h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-primary">
        <DollarSign className="h-5 w-5" />
        Service & Pricing Setup
      </CardTitle>
      <CardDescription>Configure medical services and their pricing structures</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">
        Define services, procedures, and pricing for use in the patient booking flow. (Next up: Payment Integration!)
      </p>
    </CardContent>
  </Card>
);

const adminTabs = [
  { id: "appointments", name: "Appointments", icon: Calendar, component: AppointmentManagement },
  { id: "doctors", name: "Doctors", icon: Stethoscope, component: DoctorManagement },
  { id: "slots", name: "Time Slots", icon: Clock, component: TimeSlotManagement },
  { id: "services", name: "Services & Pricing", icon: DollarSign, component: ServiceManagement },
];

export default function HospitalAdminPanel() {
  const { data: session, status } = useSession() as any;
  const [activeTab, setActiveTab] = useState("appointments");

  const isLoading = status === "loading";
  const userRole = session?.user?.role;
  const isHospitalAdmin = userRole === Role.HOSPITAL_ADMIN;
  const hospitalName = session?.user?.hospitalName || "Hospital Admin Panel";

  const CurrentComponent = useMemo(() => {
    const tab = adminTabs.find((t) => t.id === activeTab);
    return tab ? tab.component : AppointmentManagement;
  }, [activeTab]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session || !isHospitalAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="max-w-lg border-0 shadow-xl">
          <CardContent className="pt-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Access Denied
            </h1>
            <p className="text-muted-foreground mb-6">
              You must be logged in as a <strong>Hospital Admin</strong> to access this panel.
              Current role: <strong>{userRole || "Unauthorized"}</strong>.
            </p>
            <Button onClick={() => signIn("credentials")} className="rounded-full px-8 h-10">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex antialiased">
      {/* Sidebar */}
      <nav className="w-64 bg-card border-r border-border shadow-lg sticky top-0 h-screen">
        <div className="flex flex-col h-full p-4">
          <div className="mb-8 p-2">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">
                HealthCare+
              </span>
            </div>
            <p className="text-sm text-muted-foreground truncate">{hospitalName}</p>
          </div>

          <div className="flex-1 space-y-1">
            {adminTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => console.log("Log out...")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-foreground">
            {adminTabs.find((t) => t.id === activeTab)?.name} Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview and controls for {hospitalName}
          </p>
        </header>
        <div className="bg-white rounded-xl shadow-lg border border-border min-h-[70vh] p-6">
          <CurrentComponent />
        </div>
      </main>
    </div>
  );
}
