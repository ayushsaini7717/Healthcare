"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, XCircle, Building2, MapPin, Phone, Mail, Calendar, Loader } from "lucide-react";

type Hospital = {
  id: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  applicantEmail?: string;
  createdAt: string;
};

export default function SuperAdminDashboard() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchPendingHospitals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/super-admin");
      if (!res.ok) {
        throw new Error("Failed to fetch pending hospitals");
      }
      const data = await res.json();
      setHospitals(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingHospitals();
  }, []);

  const handleAction = async (
    hospitalId: string,
    applicantEmail: string | null | undefined,
    action: "APPROVE" | "REJECT"
  ) => {
    if (!applicantEmail && action === "APPROVE") {
      setError("Cannot approve: Applicant email is missing.");
      return;
    }

    setActionLoading(hospitalId);
    try {
      const res = await fetch("/api/super-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hospitalId,
          adminEmail: applicantEmail,
          action,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Failed to process request");
      }

      setSuccessMessage(data.msg);
      setHospitals(hospitals.filter((h) => h.id !== hospitalId));
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Manage and review hospital applications</p>
        </div>
      </div>

      <section className="py-8 px-4">
        <div className="container mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Error</h3>
                <p className="text-sm text-destructive/80">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-600">Success</h3>
                <p className="text-sm text-green-600/80">{successMessage}</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader className="h-8 w-8 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Loading hospital applications...</p>
            </div>
          )}

          {!isLoading && hospitals.length === 0 && (
            <Card className="border-0 shadow-sm text-center py-16">
              <CardContent>
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No Pending Applications</h3>
                <p className="text-muted-foreground">All hospital applications have been reviewed.</p>
              </CardContent>
            </Card>
          )}

          {!isLoading && hospitals.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Pending Applications</h2>
                  <p className="text-muted-foreground">
                    {hospitals.length} application{hospitals.length !== 1 ? "s" : ""} awaiting review
                  </p>
                </div>
                <Badge className="h-fit">{hospitals.length}</Badge>
              </div>

              <div className="grid gap-6">
                {hospitals.map((hospital) => (
                  <Card key={hospital.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-2xl flex items-center gap-2 mb-1">
                            <Building2 className="h-6 w-6 text-primary" />
                            {hospital.name}
                          </CardTitle>
                          <CardDescription>Hospital Registration Application</CardDescription>
                        </div>
                        <Badge variant="outline" className="rounded-full">
                          Pending
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="flex gap-3">
                          <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Location</p>
                            <p className="text-foreground">{hospital.address}</p>
                            <p className="text-foreground">{hospital.city}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Contact</p>
                            <p className="text-foreground">{hospital.phone || "Not provided"}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Applicant Email</p>
                            <p className="text-foreground text-sm break-all">
                              {hospital.applicantEmail || "Not provided"}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                            <p className="text-foreground">
                              {new Date(hospital.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() =>
                            handleAction(hospital.id, hospital.applicantEmail, "APPROVE")
                          }
                          disabled={!hospital.applicantEmail || actionLoading === hospital.id}
                          className="flex-1 rounded-full"
                        >
                          {actionLoading === hospital.id ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAction(hospital.id, hospital.applicantEmail, "REJECT")}
                          disabled={actionLoading === hospital.id}
                          className="flex-1 rounded-full"
                        >
                          {actionLoading === hospital.id ? (
                            <>
                              <Loader className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}