"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowLeft, ChevronRight, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Department {
  id: string;
  name: string;
  price: number;
}

export default function DepartmentsPage({ params }: { params: { hospitalId: string } }) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/hospitals/${params.hospitalId}/departments`)
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch departments", err);
        setLoading(false);
      });
  }, [params.hospitalId]);

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="mb-8">
        <Link href="/appointments/hospitals">
          <Button variant="ghost" className="mb-4 hover:bg-primary/10 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Hospitals
          </Button>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">Select Department</h1>
        <p className="text-muted-foreground text-lg mt-2">Which specialty are you looking for?</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
      ) : departments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept, index) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/appointments/hospitals/${params.hospitalId}/departments/${dept.id}/slots`}>
                <Card className="h-full border-2 border-transparent hover:border-primary/20 hover:shadow-xl transition-all duration-300 rounded-3xl cursor-pointer group bg-card">
                  <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                      <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {dept.name}
                      </CardTitle>
                      <p className="text-primary font-semibold mt-1">
                        ₹{(dept.price / 100).toFixed(2)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-sm">Available Today</span>
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-3xl border-2 border-dashed">
          <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
          <h3 className="text-xl font-semibold">No departments found</h3>
          <p className="text-muted-foreground mt-2">This hospital hasn't listed any services yet.</p>
        </div>
      )}
    </div>
  );
}
