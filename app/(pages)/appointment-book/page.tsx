"use client";

import React, { useState, useEffect, useCallback } from "react";
// import { useSession } from "next-auth/react"; // Use the real hook
// import Script from "next/script"; // Use the real hook
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Stethoscope,
  DollarSign,
  User,
  Clock,
  Building,
  CreditCard,
  Video,
  Info,
  PartyPopper,
} from "lucide-react";

// --------------------------------------------------------------------
// STAND-IN HOOKS (Replace with real imports in your production app)
// --------------------------------------------------------------------
// This stand-in is used to bypass build errors in this environment
const useSession = () => {
  return {
    data: {
      user: {
        id: "mock-patient-id-123",
        name: "Mock Patient",
        email: "patient@example.com",
        phone: "9876543210",
      },
    },
    status: "authenticated", // "authenticated", "loading", "unauthenticated"
  };
};

// This stand-in is used to bypass build errors in this environment
const Script = (props: any) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${props.src}"]`)) {
      return;
    }
    const script = document.createElement("script");
    script.src = props.src;
    script.async = true;
    document.body.appendChild(script);
  }, [props.src]);

  return null;
};
// --------------------------------------------------------------------


// --------------------------------------------------------------------
// TYPES (from public data)
// --------------------------------------------------------------------
interface Hospital {
  id: string;
  name: string;
  city: string;
}
interface Service {
  id: string;
  name: string;
  price: number; // in cents
}
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  createdAt: string; 
}
interface TimeSlot {
  id: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  doctorId: string | null;
  doctor: { name: string } | null;
}
interface Appointment {
  id: string;
  razorpayOrderId: string;
}
interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
}

// --------------------------------------------------------------------
// API URLs
// --------------------------------------------------------------------
const PUBLIC_API_URL = "/api/public/data"; 
const INITIATE_PAYMENT_URL = "/api/payment/initiate";
const VERIFY_PAYMENT_URL = "/api/payment/verify";

// --------------------------------------------------------------------
// Notification Component
// --------------------------------------------------------------------
interface NotificationBoxProps {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}
const NotificationBox: React.FC<NotificationBoxProps> = ({ type, title, message }) => {
  const Icon = type === "success" ? CheckCircle : type === "error" ? AlertCircle : Info;
  const colorClasses =
    type === "success" ? "bg-green-100 border-green-200 text-green-700" :
    type ==="error" ? "bg-red-100 border-red-200 text-red-700" :
    "bg-blue-100 border-blue-200 text-blue-700";
  const iconColor =
    type === "success" ? "text-green-600" :
    type === "error" ? "text-red-600" :
    "text-blue-600";

  return (
    <div className={`p-4 rounded-lg border flex gap-3 shadow-md ${colorClasses}`}>
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        <h3 className={`font-semibold`}>{title}</h3>
        <p className={`text-sm opacity-90`}>{message}</p>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------
// Helper Functions
// --------------------------------------------------------------------
const formatPrice = (priceInCents: number) => {
  return (priceInCents / 100).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

const formatTime = (isoDate: string) => {
  return new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (isoDate: string) => {
  return new Date(isoDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};


// --------------------------------------------------------------------
// MAIN BOOKING FORM COMPONENT
// --------------------------------------------------------------------
export default function PatientBookingForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Fetched Data
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Selections
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<"IN_PERSON" | "VIDEO_CALL">("IN_PERSON");
  const [notes, setNotes] = useState("");
  
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // --- Data Fetching Effects ---

  // 1. Fetch Hospitals on load
  useEffect(() => {
    const fetchHospitals = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${PUBLIC_API_URL}?type=hospitals`);
        if (!res.ok) throw new Error("Failed to fetch hospitals.");
        setHospitals(await res.json());
      } catch (err: any) {
        setError(err.message);
        setHospitals([
            {id: 'hosp-1', name: 'Demo General Hospital', city: 'Demoville'}
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  // 2. Fetch Services when Hospital is selected
  useEffect(() => {
    if (!selectedHospital) {
      setServices([]);
      setSelectedService(null);
      return;
    }
    const fetchServices = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${PUBLIC_API_URL}?type=services&hospitalId=${selectedHospital.id}`);
        if (!res.ok) throw new Error("Failed to fetch services for this hospital.");
        setServices(await res.json());
      } catch (err: any) {
        setError(err.message);
        setServices([
            {id: 'serv-1', name: 'Demo Consultation', price: 50000} // 500 INR
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedHospital]);

  // 3. Fetch Doctors when Hospital is selected
  useEffect(() => {
    if (!selectedHospital) {
      setDoctors([]);
      setSelectedDoctor(null);
      return;
    }
    const fetchDoctors = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${PUBLIC_API_URL}?type=doctors&hospitalId=${selectedHospital.id}`);
        if (!res.ok) throw new Error("Failed to fetch doctors for this hospital.");
        setDoctors(await res.json());
      } catch (err: any) {
        setError(err.message);
        setDoctors([
            {id: 'doc-1', name: 'Dr. Demo', specialty: 'General', createdAt: new Date().toISOString()}
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [selectedHospital]);

  // 4. Fetch TimeSlots when Hospital and Doctor are selected
  useEffect(() => {
    if (!selectedHospital || !selectedDoctor) {
      setTimeSlots([]);
      setSelectedTimeSlot(null);
      return;
    }
    const fetchTimeSlots = async () => {
      setLoading(true);
      setError("");
      try {
        const doctorIdQuery = selectedDoctor.id === "video-doc" ? "" : `&doctorId=${selectedDoctor.id}`;
        console.log("Selected Doctor ID:", selectedDoctor.id);
        console.log("Doctor ID Query Param:", doctorIdQuery);
        const today = new Date().toISOString().split('T')[0];
        
        const fetchUrl = `${PUBLIC_API_URL}?type=slots&hospitalId=${selectedHospital.id}&date=${today}${doctorIdQuery}`;
        
        // --- DEBUGGING LOG ---
        // This will show you the exact URL being fetched.
        // For video calls, doctorId should be absent.
        console.log("Fetching slots with URL:", fetchUrl);
        // --- END DEBUGGING LOG ---

        const res = await fetch(fetchUrl);
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || "Failed to fetch time slots.");
        }
        
        const allSlots = await res.json();
        
        // const filteredSlots = allSlots.filter((slot: TimeSlot) => 
        //   appointmentType === "VIDEO_CALL" ? !slot.doctorId : !!slot.doctorId
        // );

        setTimeSlots(allSlots);
        
      } catch (err: any) {
        setError(err.message);
        setTimeSlots([
            {id: 'slot-1', startTime: new Date().toISOString(), endTime: new Date().toISOString(), doctorId: 'doc-1', doctor: {name: 'Dr. Demo'}}
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeSlots();
  }, [selectedHospital, selectedDoctor, appointmentType]);
  
  
  // --- Navigation ---
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // --- Payment Handler ---
  const handlePayment = async () => {
    if (!razorpayKeyId) {
        setError("Payment gateway is not configured. Please contact support.");
        return;
    }
    if (!session?.user || !selectedHospital || !selectedDoctor || !selectedService || !selectedTimeSlot) {
      setError("Missing booking details. Please start over.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Initiate Order
      const initResponse = await fetch(INITIATE_PAYMENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId: selectedHospital.id,
          doctorId: selectedDoctor.id === "video-doc" ? null : selectedDoctor.id, 
          serviceId: selectedService.id,
          timeSlotId: selectedTimeSlot.id,
          startTime: selectedTimeSlot.startTime,
          endTime: selectedTimeSlot.endTime,
          type: appointmentType,
          notes: notes,
        }),
      });
      
      const initData = await initResponse.json();
      if (!initResponse.ok) {
        throw new Error(initData.message || "Failed to create appointment order.");
      }

      const { appointment, razorpayOrder }: { appointment: Appointment; razorpayOrder: RazorpayOrder } = initData;

      // 2. Open Razorpay Modal
      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "HealthCare+ Appointment",
        description: `Booking for ${selectedService.name}`,
        image: "https://placehold.co/128x128/3B82F6/FFFFFF?text=H+", // Your logo
        order_id: razorpayOrder.id,
        
        handler: async (response: any) => {
          setLoading(true);
          setError("");
          try {
            const verifyResponse = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment.id,
              }),
            });
            
            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Payment verification failed.");
            }
            
            setLoading(false);
            setStep(5); // Go to Success Step

          } catch (verifyError: any) {
            setLoading(false);
            setError(`Payment verification failed: ${verifyError.message} Please contact support.`);
          }
        },
        prefill: {
          name: session.user.name || "",
          email: session.user.email || "",
          contact: (session.user as any)?.phone || "",
        },
        theme: {
          color: "#3B82F6",
        },
        modal: {
            ondismiss: () => {
                setLoading(false);
                setError("Payment was cancelled. Your slot is no longer reserved.");
            }
        }
      };
      
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (err: any) {
      setLoading(false);
      setError(err.message);
    }
  };
  
  // --- Render Steps ---
  
  const renderStep = () => {
    if (loading && step < 4) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground mt-2">Loading data...</p>
        </div>
      );
    }
    
    switch (step) {
      case 1: // Select Hospital & Type
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 1: Select Appointment Type & Hospital</h2>
            {error && <NotificationBox type="error" title="Error" message={error} />}
            <div className="space-y-2">
                <label className="font-semibold">Appointment Type</label>
                <div className="grid grid-cols-2 gap-4">
                    <Button variant={appointmentType === "IN_PERSON" ? "default" : "outline"} onClick={() => setAppointmentType("IN_PERSON")} className="h-16 flex-col">
                        <User className="h-5 w-5 mb-1" /> In-Person
                    </Button>
                    <Button variant={appointmentType === "VIDEO_CALL" ? "default" : "outline"} onClick={() => setAppointmentType("VIDEO_CALL")} className="h-16 flex-col">
                        <Video className="h-5 w-5 mb-1" /> Video Call
                    </Button>
                </div>
            </div>
            <div className="space-y-2">
                <label className="font-semibold">Available Hospitals</label>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {hospitals.map((h) => (
                    <Button key={h.id} variant={selectedHospital?.id === h.id ? "secondary" : "outline"} className="w-full justify-between h-14" onClick={() => setSelectedHospital(h)}>
                        <div>
                            <p className="font-semibold text-left">{h.name}</p>
                            <p className="text-xs text-muted-foreground font-normal text-left">{h.city}</p>
                        </div>
                        <Building className="h-5 w-5 text-primary" />
                    </Button>
                ))}
                </div>
            </div>
            <Button onClick={nextStep} disabled={!selectedHospital}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2: // Select Service & Doctor
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 2: Select Service & Doctor</h2>
            {error && <NotificationBox type="error" title="Error" message={error} />}
            <div className="space-y-2">
                <label className="font-semibold">Available Services</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                {services.map((s) => (
                    <Button key={s.id} variant={selectedService?.id === s.id ? "secondary" : "outline"} className="w-full justify-between h-14" onClick={() => setSelectedService(s)}>
                        <div>
                            <p className="font-semibold text-left">{s.name}</p>
                            <p className="text-xs text-primary font-normal text-left">{formatPrice(s.price)}</p>
                        </div>
                        <DollarSign className="h-5 w-5 text-green-600" />
                    </Button>
                ))}
                </div>
            </div>
             <div className="space-y-2">
                <label className="font-semibold">Available Doctors</label>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {appointmentType === "VIDEO_CALL" && (
                    <Button variant={selectedDoctor?.id === "video-doc" ? "secondary" : "outline"} className="w-full justify-between h-14" onClick={() => setSelectedDoctor({id: "video-doc", name: "General Video Call", specialty: "Available Online Doctor", createdAt: new Date().toISOString()})}>
                      <div>
                        <p className="font-semibold text-left">General Video Call</p>
                        <p className="text-xs text-muted-foreground font-normal text-left">Any available doctor</p>
                      </div>
                      <Video className="h-5 w-5 text-primary" />
                    </Button>
                  )}
                  {appointmentType === "IN_PERSON" && doctors.map((d) => (
                    <Button key={d.id} variant={selectedDoctor?.id === d.id ? "secondary" : "outline"} className="w-full justify-between h-14" onClick={() => setSelectedDoctor(d)}>
                        <div>
                            <p className="font-semibold text-left">{d.name}</p>
                            <p className="text-xs text-primary font-normal text-left">{d.specialty}</p>
                        </div>
                        <Stethoscope className="h-5 w-5 text-primary" />
                    </Button>
                  ))}
                </div>
            </div>
            <div className="flex gap-4">
                <Button onClick={prevStep} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} disabled={!selectedService || !selectedDoctor}>
                    Next <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
          </div>
        );

      case 3: // Select Time Slot
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 3: Select Time Slot</h2>
            {error && <NotificationBox type="error" title="Error" message={error} />}
            <div className="space-y-2">
                <label className="font-semibold">Available Slots for {formatDate(new Date().toISOString())}</label>
                 <p className="text-sm text-muted-foreground">For: {selectedDoctor?.name}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
                {timeSlots.length > 0 ? timeSlots.map((slot) => (
                    <Button key={slot.id} variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"} className="h-12" onClick={() => setSelectedTimeSlot(slot)}>
                        {formatTime(slot.startTime)}
                    </Button>
                )) : (
                    <p className="text-muted-foreground col-span-3 text-center">No available slots found for this selection.</p>
                )}
                </div>
            </div>
            <div className="space-y-2">
                <label className="font-semibold" htmlFor="notes">Additional Notes (Optional)</label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)} 
                    placeholder="Please describe your symptoms..."
                    className="w-full p-2 border rounded-md min-h-[100px] bg-background"
                />
            </div>
            <div className="flex gap-4">
                <Button onClick={prevStep} variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} disabled={!selectedTimeSlot}>
                    Review & Pay <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 4: Review and Confirm</h2>
            {error && <NotificationBox type="error" title="Error" message={error} />}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Building className="h-4 w-4" /> Hospital</span>
                    <span className="font-semibold">{selectedHospital?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Stethoscope className="h-4 w-4" /> Doctor</span>
                    <span className="font-semibold">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Calendar className="h-4 w-4" /> Date</span>
                    <span className="font-semibold">{selectedTimeSlot ? formatDate(selectedTimeSlot.startTime) : 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" /> Time</span>
                    <span className="font-semibold">{selectedTimeSlot ? formatTime(selectedTimeSlot.startTime) : 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><Video className="h-4 w-4" /> Type</span>
                    <span className="font-semibold">{appointmentType === "VIDEO_CALL" ? "Video Call" : "In-Person"}</span>
                </div>
                <div className="border-t my-2"></div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Service</span>
                    <span className="font-semibold">{selectedService?.name}</span>
                </div>
                 <div className="flex justify-between items-center text-lg">
                    <span className="font-semibold flex items-center gap-2">Total Amount</span>
                    <span className="font-bold text-primary">{selectedService ? formatPrice(selectedService.price) : 'N/A'}</span>
                </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
                By clicking "Pay Now", you agree to our <a href="/terms-and-conditions" target="_blank" className="underline">Terms</a> and <a href="/cancellation-policy" target="_blank" className="underline">Cancellation Policy</a>. 
                Payment will be processed securely by Razorpay.
            </p>
            
            <div className="flex gap-4">
                <Button onClick={prevStep} variant="outline" disabled={loading}>
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={handlePayment} disabled={loading || sessionStatus !== 'authenticated'}>
                    {loading ? (
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {loading ? "Processing..." : "Pay Now"}
                </Button>
            </div>
             {sessionStatus !== 'authenticated' && (
                <NotificationBox type="error" title="Not Logged In" message="You must be logged in to make a payment." />
            )}
          </div>
        );

      case 5: // Success
        return (
            <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                {/* **FIXED TYPO** */}
                <PartyPopper className="h-16 w-16 text-green-600" />
                <h2 className="text-2xl font-bold">Appointment Booked!</h2>
                <p className="text-muted-foreground max-w-md">
                    Your payment was successful and your appointment is now pending confirmation
                    from {selectedHospital?.name}. You will receive an email once it's confirmed.
                </p>
                <Button onClick={() => window.location.reload()}>Book Another Appointment</Button>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* This script is required for Razorpay to work */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription> 
            Step {step} of 5: {
                step === 1 ? "Select Hospital" :
                step === 2 ? "Select Service" :
                step === 3 ? "Select Time Slot" :
                step === 4 ? "Review & Pay" :
                "Confirmation"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            {renderStep()}
        </CardContent>
      </Card>
    </>
  );
}