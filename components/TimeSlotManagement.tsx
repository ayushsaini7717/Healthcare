"use client";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Clock, Loader, PlusCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import FeedbackAlert from "./FeedbackAlert";

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  doctorId?: string;
  createdAt?: string;
}

const API_URL = "/api/admin/slots";

export default function TimeSlotManagement() {
  const { data: session } = useSession() as any;
  const hospitalId = session?.user?.hospitalId;

  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [newSlot, setNewSlot] = useState({ startTime: "", endTime: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Fetch all time slots
  const fetchSlots = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch time slots");
      setSlots(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // Add new time slot
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newSlot, hospitalId }),
      });

      if (!res.ok) throw new Error("Failed to add time slot");
      const addedSlot = await res.json();

      setSlots((prev) => [...prev, addedSlot]);
      setNewSlot({ startTime: "", endTime: "" });
      setSuccess(`Time slot ${addedSlot.startTime} - ${addedSlot.endTime} added successfully!`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Feedback Messages */}
      {success && <FeedbackAlert type="success" message={success} />}
      {error && <FeedbackAlert type="error" message={error} />}

      {/* Add Time Slot Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <PlusCircle className="h-5 w-5" /> Add New Time Slot
          </CardTitle>
          <CardDescription>Create a new consultation slot for doctors</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSlot} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Start Time</label>
                <Input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">End Time</label>
                <Input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" /> Adding Slot...
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Slot
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* List of Time Slots */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Clock className="h-5 w-5" /> Current Time Slots
          </CardTitle>
          <Badge>{slots.length} Slots</Badge>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6">
              <Loader className="animate-spin inline h-6 w-6" />
            </div>
          ) : slots.length === 0 ? (
            <p className="text-center text-muted-foreground py-6">No time slots available.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="border rounded-lg p-3 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-lg font-semibold text-primary">
                    {slot.startTime} - {slot.endTime}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Added on {new Date(slot.createdAt || "").toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
