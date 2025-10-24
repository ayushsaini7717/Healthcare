"use client";

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader, 
  AlertCircle, 
  CheckCircle, 
  Building, 
  Stethoscope, 
  Package, 
  CalendarDays, 
  Clock,
  ArrowRight,
  Video,
  User,
  Banknote
} from "lucide-react";
import { useSession } from 'next-auth/react'; 

interface Hospital { id: string; name: string; city: string; }
interface Service { id: string; name: string; price: number; }
interface Doctor { id: string; name: string; specialty: string; }
interface TimeSlot { id: string; startTime: string; endTime: string; }

const API_URL = '/api/public/data/getHospital';
const BOOKING_API_URL = '/api/appointments';

const formatPrice = (priceInCents: number): string => {
    if (isNaN(priceInCents)) {
        return "$0.00"; 
    }
    return (priceInCents / 100).toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    });
};
const formatTime = (dateString: string) => new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

export default function PatientBookingForm() {
  const { data: session, status } = useSession();
  
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [step, setStep] = useState(1);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<"IN_PERSON" | "VIDEO_CALL">("IN_PERSON");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(p => ({ ...p, hospitals: true }));
      try {
        const res = await fetch(`${API_URL}?type=hospitals`);
        if (!res.ok) throw new Error("Failed to load hospitals.");
        setHospitals(await res.json());
      } catch (err: any) { setError(err.message); }
      finally { setLoading(p => ({ ...p, hospitals: false })); }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!selectedHospitalId) return;
    setStep(2);
    setSelectedServiceId(null);
    setSelectedDoctorId(null);
    
    const fetchData = async () => {
      setLoading(p => ({ ...p, services: true, doctors: true }));
      try {
        const [resServices, resDoctors] = await Promise.all([
          fetch(`${API_URL}?type=services&hospitalId=${selectedHospitalId}`),
          fetch(`${API_URL}?type=doctors&hospitalId=${selectedHospitalId}`)
        ]);
        if (!resServices.ok) throw new Error("Failed to load services.");
        if (!resDoctors.ok) throw new Error("Failed to load doctors.");
        setServices(await resServices.json());
        setDoctors(await resDoctors.json());
      } catch (err: any) { setError(err.message); }
      finally { setLoading(p => ({ ...p, services: false, doctors: false })); }
    };
    fetchData();
  }, [selectedHospitalId]);

  useEffect(() => {
    if (!selectedHospitalId || !selectedDoctorId || !selectedDate) return;
    setStep(4);
    setSelectedSlot(null);
    
    const fetchSlots = async () => {
      setLoading(p => ({ ...p, slots: true }));
      setSlots([]);
      try {
        const res = await fetch(`${API_URL}?type=slots&hospitalId=${selectedHospitalId}&doctorId=${selectedDoctorId}&date=${selectedDate}`);
        if (!res.ok) throw new Error("Failed to load time slots.");
        setSlots(await res.json());
      } catch (err: any) { setError(err.message); }
      finally { setLoading(p => ({ ...p, slots: false })); }
    };
    fetchSlots();
  }, [selectedHospitalId, selectedDoctorId, selectedDate]);
  
  
  const handleSubmitBooking = async () => {
    setError("");
    setSuccess("");
    
    if (!selectedHospitalId || !selectedServiceId || !selectedDoctorId || !selectedSlot) {
      setError("Please ensure all fields are selected.");
      return;
    }
    
    if (status !== 'authenticated' || !session?.user) {
        setError("You must be logged in to book an appointment.");
        return;
    }

    setLoading(p => ({ ...p, submit: true }));
    try {
      const response = await fetch(BOOKING_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hospitalId: selectedHospitalId,
          serviceId: selectedServiceId,
          doctorId: selectedDoctorId,
          timeSlotId: selectedSlot.id,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          type: appointmentType,
          notes: notes,
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Booking failed.");
      }
      
      setSuccess("Appointment booked successfully! You will receive a confirmation soon.");
      setStep(6); 

    } catch (err: any) {
      setError(err.message); 
    } finally {
      setLoading(p => ({ ...p, submit: false }));
    }
  };

  const getSelectedData = () => ({
    hospital: hospitals.find(h => h.id === selectedHospitalId),
    service: services.find(s => s.id === selectedServiceId),
    doctor: doctors.find(d => d.id === selectedDoctorId),
  });
  
  const { hospital, service, doctor } = getSelectedData();

  if (status === 'loading') {
    return <div className="flex justify-center items-center h-96"><Loader className="animate-spin" /></div>;
  }
  
  if (success) {
     return (
        <Card className="w-full max-w-2xl mx-auto shadow-xl">
           <CardHeader className="text-center">
             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
             </div>
             <CardTitle className="text-2xl">Booking Pending Confirmation!</CardTitle>
             <CardDescription>{success}</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold">Your Appointment Details:</h3>
                <p className="flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> {hospital?.name}</p>
                <p className="flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Dr. {doctor?.name} ({doctor?.specialty})</p>
                <p className="flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> {service?.name}</p>
                <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {new Date(selectedDate).toDateString()}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {formatTime(selectedSlot!.startTime)} - {formatTime(selectedSlot!.endTime)}</p>
              </div>
           </CardContent>
        </Card>
     );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Book an Appointment</CardTitle>
        <CardDescription>Follow the steps below to schedule your visit.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        <div className="space-y-2">
          <label className="text-sm font-semibold flex items-center gap-2"><Building className="h-4 w-4 text-primary" /> Select Hospital</label>
          <Select onValueChange={setSelectedHospitalId} value={selectedHospitalId || ""}>
            <SelectTrigger>{selectedHospitalId ? hospital?.name : "Choose a hospital..."}</SelectTrigger>
            <SelectContent>
              {loading.hospitals ? <SelectItem value="load" disabled>Loading...</SelectItem> :
               hospitals.map(h => <SelectItem key={h.id} value={h.id}>{h.name} - {h.city}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {step >= 2 && selectedHospitalId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Select Service</label>
              <Select onValueChange={(val) => { setSelectedServiceId(val); setStep(3); }} value={selectedServiceId || ""}>
                <SelectTrigger>{selectedServiceId ? `${service?.name} (${formatPrice(service!.price)})` : "Choose a service..."}</SelectTrigger>
                <SelectContent>
                  {loading.services ? <SelectItem value="load" disabled>Loading...</SelectItem> :
                   services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({formatPrice(s.price)})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Visit Type</label>
              <Select onValueChange={(val: any) => setAppointmentType(val)} value={appointmentType}>
                <SelectTrigger>{appointmentType === 'IN_PERSON' ? 'In-Person' : 'Video Call'}</SelectTrigger>
                <SelectContent>
                   <SelectItem value="IN_PERSON"><div className="flex items-center gap-2"><User className="h-4 w-4"/> In-Person</div></SelectItem>
                   <SelectItem value="VIDEO_CALL"><div className="flex items-center gap-2"><Video className="h-4 w-4"/> Video Call</div></SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {step >= 3 && selectedServiceId && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Select Doctor</label>
              <Select onValueChange={setSelectedDoctorId} value={selectedDoctorId || ""}>
                <SelectTrigger>{selectedDoctorId ? `Dr. ${doctor?.name} (${doctor?.specialty})` : "Choose a doctor..."}</SelectTrigger>
                <SelectContent>
                  {loading.doctors ? <SelectItem value="load" disabled>Loading...</SelectItem> :
                   doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.name} ({d.specialty})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
               <label htmlFor="date-select" className="text-sm font-semibold flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> Select Date</label>
               <input
                  type="date"
                  id="date-select"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]} // Today
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-colors"
               />
             </div>
          </div>
        )}

        {step >= 4 && selectedDoctorId && (
          <div className="space-y-3 pt-4 border-t">
            <label className="text-sm font-semibold flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> Select Available Time Slot</label>
            {loading.slots && <div className="flex justify-center"><Loader className="animate-spin" /></div>}
            {!loading.slots && slots.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No available slots for Dr. {doctor?.name} on this day. Please try another date or doctor.</p>}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map(slot => (
                <Button
                  key={slot.id}
                  variant={selectedSlot?.id === slot.id ? 'default' : 'outline'}
                  onClick={() => { setSelectedSlot(slot); setStep(5); }}
                  className="w-full"
                >
                  {formatTime(slot.startTime)}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {step >= 5 && selectedSlot && (
            <div className="space-y-6 pt-4 border-t">
                <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                    <h4 className="font-semibold text-lg">Confirm Your Booking</h4>
                    <p className="text-sm flex items-center gap-2"><Building className="h-4 w-4 text-muted-foreground" /> <strong>{hospital?.name}</strong></p>
                    <p className="text-sm flex items-center gap-2"><Stethoscope className="h-4 w-4 text-muted-foreground" /> <strong>Dr. {doctor?.name}</strong></p>
                    <p className="text-sm flex items-center gap-2"><Package className="h-4 w-4 text-muted-foreground" /> <strong>{service?.name}</strong></p>
                    <p className="text-sm flex items-center gap-2"><CalendarDays className="h-4 w-4 text-muted-foreground" /> <strong>{new Date(selectedDate).toDateString()} at {formatTime(selectedSlot.startTime)}</strong></p>
                    <p className="text-lg font-bold flex items-center gap-2 pt-2"><Banknote className="h-5 w-5 text-primary" /> Total Due: {formatPrice(service!.price)}</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-semibold">Additional Notes (Optional)</label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Please describe your symptoms or reason for visit..."
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-100 border border-red-200 rounded-lg flex gap-3 shadow-md">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-700">Booking Failed</h3>
                      <p className="text-sm text-red-600/90">{error}</p>
                    </div>
                  </div>
                )}

                <Button 
                    onClick={handleSubmitBooking} 
                    disabled={loading.submit} 
                    className="w-full h-12 text-lg rounded-full"
                >
                  {loading.submit ? (
                    <><Loader className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  ) : (
                    <>Book Appointment (Pay {formatPrice(service!.price)}) <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>
            </div>
        )}
      </CardContent>
    </Card>
  );
}