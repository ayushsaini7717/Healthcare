"use client";

import React, { useState, useEffect } from "react";
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
// STAND-IN HOOKS (Replace with real imports in production)
// --------------------------------------------------------------------
const useSession = () => ({
  data: {
    user: {
      id: "mock-patient-id-123",
      name: "Mock Patient",
      email: "patient@example.com",
      phone: "9876543210",
    },
  },
  status: "authenticated",
});

const Script = (props: any) => {
  useEffect(() => {
    if (document.querySelector(`script[src="${props.src}"]`)) return;
    const script = document.createElement("script");
    script.src = props.src;
    script.async = true;
    document.body.appendChild(script);
  }, [props.src]);
  return null;
};

// --------------------------------------------------------------------
// TYPES
// --------------------------------------------------------------------
interface Hospital {
  id: string;
  name: string;
  city: string;
}
interface Service {
  id: string;
  name: string;
  price: number;
}
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
const NotificationBox: React.FC<NotificationBoxProps> = ({
  type,
  title,
  message,
}) => {
  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? AlertCircle
      : Info;
  const colorClasses =
    type === "success"
      ? "bg-green-100 border-green-200 text-green-700"
      : type === "error"
      ? "bg-red-100 border-red-200 text-red-700"
      : "bg-blue-100 border-blue-200 text-blue-700";
  const iconColor =
    type === "success"
      ? "text-green-600"
      : type === "error"
      ? "text-red-600"
      : "text-blue-600";

  return (
    <div
      className={`p-4 rounded-lg border flex gap-3 shadow-md ${colorClasses}`}
    >
      <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
};

// --------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------
const formatPrice = (price: number) =>
  (price / 100).toLocaleString("en-IN", { style: "currency", currency: "INR" });

const formatTime = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// --------------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------------
export default function PatientBookingForm() {
  const { data: session, status: sessionStatus } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [appointmentType, setAppointmentType] = useState<
    "IN_PERSON" | "VIDEO_CALL"
  >("IN_PERSON");
  const [notes, setNotes] = useState("");

  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  // --------------------------------------------------------------------
  // Fetch Hospitals, Services, Doctors, and Slots
  // --------------------------------------------------------------------
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${PUBLIC_API_URL}?type=hospitals`);
        if (!res.ok) throw new Error("Failed to fetch hospitals.");
        setHospitals(await res.json());
      } catch (err: any) {
        setError(err.message);
        setHospitals([{ id: "hosp-1", name: "Demo Hospital", city: "DemoCity" }]);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
  }, []);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${PUBLIC_API_URL}?type=services&hospitalId=${selectedHospital.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch services.");
        setServices(await res.json());
      } catch (err: any) {
        setError(err.message);
        setServices([{ id: "serv-1", name: "Demo Consultation", price: 50000 }]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [selectedHospital]);

  useEffect(() => {
    if (!selectedHospital) return;
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${PUBLIC_API_URL}?type=doctors&hospitalId=${selectedHospital.id}`
        );
        if (!res.ok) throw new Error("Failed to fetch doctors.");
        setDoctors(await res.json());
      } catch (err: any) {
        setError(err.message);
        setDoctors([
          {
            id: "doc-1",
            name: "Dr. Demo",
            specialty: "General",
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, [selectedHospital]);

  useEffect(() => {
    if (!selectedHospital || !selectedDoctor) return;
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const doctorQuery =
          selectedDoctor.id === "video-doc"
            ? ""
            : `&doctorId=${selectedDoctor.id}`;
        const url = `${PUBLIC_API_URL}?type=slots&hospitalId=${selectedHospital.id}&date=${selectedDate}${doctorQuery}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch slots.");
        setTimeSlots(await res.json());
      } catch (err: any) {
        setError(err.message);
        setTimeSlots([
          {
            id: "slot-1",
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            doctorId: "doc-1",
            doctor: { name: "Dr. Demo" },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [selectedHospital, selectedDoctor, selectedDate, appointmentType]);

  // --------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------
  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  // --------------------------------------------------------------------
  // Payment
  // --------------------------------------------------------------------
  const handlePayment = async () => {
    if (!razorpayKeyId) {
      setError("Payment gateway not configured.");
      return;
    }
    if (
      !session?.user ||
      !selectedHospital ||
      !selectedDoctor ||
      !selectedService ||
      !selectedTimeSlot
    ) {
      setError("Missing booking details.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(INITIATE_PAYMENT_URL, {
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
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment init failed.");

      const { appointment, razorpayOrder }: { appointment: Appointment; razorpayOrder: RazorpayOrder } = data;

      const options = {
        key: razorpayKeyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "HealthCare+ Appointment",
        description: `Booking for ${selectedService.name}`,
        order_id: razorpayOrder.id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(VERIFY_PAYMENT_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment.id,
              }),
            });
            if (!verifyRes.ok) throw new Error("Payment verification failed.");
            setStep(5);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: session.user.name,
          email: session.user.email,
          contact: (session.user as any)?.phone || "",
        },
        theme: { color: "#3B82F6" },
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------------------
  // Render Steps
  // --------------------------------------------------------------------
  const renderStep = () => {
    if (loading && step < 4)
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      );

    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 1: Select Appointment Type & Hospital
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={
                  appointmentType === "IN_PERSON" ? "default" : "outline"
                }
                onClick={() => setAppointmentType("IN_PERSON")}
              >
                <User className="h-4 w-4 mr-2" /> In-Person
              </Button>
              <Button
                variant={
                  appointmentType === "VIDEO_CALL" ? "default" : "outline"
                }
                onClick={() => setAppointmentType("VIDEO_CALL")}
              >
                <Video className="h-4 w-4 mr-2" /> Video Call
              </Button>
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Available Hospitals</label>
              {hospitals.map((h) => (
                <Button
                  key={h.id}
                  variant={
                    selectedHospital?.id === h.id ? "secondary" : "outline"
                  }
                  className="w-full justify-between"
                  onClick={() => setSelectedHospital(h)}
                >
                  <span>{h.name}</span>
                  <Building className="h-5 w-5 text-primary" />
                </Button>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!selectedHospital}>
              Next <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 2: Select Service & Doctor
            </h2>
            <div className="space-y-2">
              <label className="font-semibold">Services</label>
              {services.map((s) => (
                <Button
                  key={s.id}
                  variant={
                    selectedService?.id === s.id ? "secondary" : "outline"
                  }
                  onClick={() => setSelectedService(s)}
                  className="w-full justify-between"
                >
                  <span>{s.name}</span>
                  <span className="text-primary">{formatPrice(s.price)}</span>
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="font-semibold">Doctors</label>
              {appointmentType === "VIDEO_CALL" && (
                <Button
                  variant={
                    selectedDoctor?.id === "video-doc" ? "secondary" : "outline"
                  }
                  onClick={() =>
                    setSelectedDoctor({
                      id: "video-doc",
                      name: "General Video Call",
                      specialty: "Online Doctor",
                      createdAt: new Date().toISOString(),
                    })
                  }
                >
                  <Video className="h-4 w-4 mr-2" /> General Video Call
                </Button>
              )}
              {appointmentType === "IN_PERSON" &&
                doctors.map((d) => (
                  <Button
                    key={d.id}
                    variant={
                      selectedDoctor?.id === d.id ? "secondary" : "outline"
                    }
                    onClick={() => setSelectedDoctor(d)}
                    className="w-full justify-between"
                  >
                    <span>{d.name}</span>
                    <span className="text-muted-foreground">
                      {d.specialty}
                    </span>
                  </Button>
                ))}
            </div>
            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                onClick={nextStep}
                disabled={!selectedService || !selectedDoctor}
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">
              Step 3: Select Date & Time Slot
            </h2>

            <div>
              <label className="font-semibold">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full mt-2 p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold">
                Available Slots for {formatDate(selectedDate)}
              </label>
              <p className="text-sm text-muted-foreground">
                Doctor: {selectedDoctor?.name}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {timeSlots.length > 0 ? (
                  timeSlots.map((slot) => (
                    <Button
                      key={slot.id}
                      variant={
                        selectedTimeSlot?.id === slot.id ? "default" : "outline"
                      }
                      onClick={() => setSelectedTimeSlot(slot)}
                    >
                      {formatTime(slot.startTime)}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-muted-foreground">
                    No slots available.
                  </p>
                )}
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="w-full border rounded-md p-2 min-h-[80px]"
            />

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

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Step 4: Review & Pay</h2>
            <div className="p-4 border rounded-md bg-muted/50 space-y-3">
              <div className="flex justify-between">
                <span>Hospital:</span>
                <span>{selectedHospital?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Doctor:</span>
                <span>{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Time:</span>
                <span>{formatTime(selectedTimeSlot?.startTime || "")}</span>
              </div>
              <div className="flex justify-between">
                <span>Service:</span>
                <span>{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-bold text-primary">
                  {formatPrice(selectedService?.price || 0)}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={prevStep} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button onClick={handlePayment} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" />{" "}
                {loading ? "Processing..." : "Pay Now"}
              </Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <PartyPopper className="h-12 w-12 text-green-600" />
            <h2 className="text-2xl font-bold">Appointment Confirmed!</h2>
            <p>
              You’ll receive an email confirmation shortly from{" "}
              {selectedHospital?.name}.
            </p>
            <Button onClick={() => window.location.reload()}>
              Book Another
            </Button>
          </div>
        );
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>
            Step {step} of 5{" "}
            {step === 1
              ? "(Select Hospital)"
              : step === 2
              ? "(Select Doctor)"
              : step === 3
              ? "(Select Slot)"
              : step === 4
              ? "(Review & Pay)"
              : "(Success)"}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderStep()}</CardContent>
      </Card>
    </>
  );
}
