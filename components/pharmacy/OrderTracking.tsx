"use client";
import { motion } from "framer-motion";
import { Check, Package, Clock, Truck, Home, XCircle, ChevronLeft, ShieldAlert } from "lucide-react";

export default function OrderTracking({ order, onBack }: { order: any, onBack: () => void }) {
  const STEPS = [
    { id: "PAID", label: "Confirmed", icon: Check, desc: "Order assigned to nearest pharmacy" },
    { id: "PROCESSING", label: "Processing", icon: Package, desc: "Being packed by the pharmacist" },
    { id: "SHIPPED", label: "Out for Delivery", icon: Truck, desc: order?.deliveryAgent ? `Agent ${order.deliveryAgent.name} assigned` : "Waiting for agent" },
    { id: "DELIVERED", label: "Delivered", icon: Home, desc: "Order handed over to you" },
  ];

  // If requires verification, inject it into lifecycle
  if (order?.status === "PENDING_VERIFICATION") {
       STEPS.splice(1, 0, { id: "PENDING_VERIFICATION", label: "RX Verification", icon: ShieldAlert, desc: "Pharmacist reviewing your prescription" });
  }

  const currentStatusIndex = STEPS.findIndex(s => s.id === order?.status);

  if (order?.status === "CANCELLED") {
      return (
          <div className="p-12 text-center border border-red-500/20 bg-red-500/10 rounded-2xl">
              <XCircle className="mx-auto h-20 w-20 text-red-500 mb-4" />
              <h2 className="text-3xl font-extrabold text-red-600 mb-2">Order Cancelled</h2>
              <p className="text-red-800/70">Payment failed or rejected by pharmacist.</p>
              <button onClick={onBack} className="mt-8 bg-black text-white px-6 py-2 rounded-lg font-bold">Go Back</button>
          </div>
      )
  }

  return (
    <div className="bg-card shadow-xl border rounded-3xl overflow-hidden relative">
      <div className="bg-indigo-600 text-white p-6 flex items-center justify-between">
          <div>
              <button onClick={onBack} className="flex items-center gap-2 mb-2 text-indigo-200 hover:text-white font-medium text-sm"><ChevronLeft className="w-4 h-4"/> Back to Shop</button>
              <h2 className="text-3xl font-extrabold flex items-center gap-3">Live Tracking</h2>
          </div>
          {order?.pharmacy && (
             <div className="text-right bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                 <p className="text-xs uppercase font-bold text-indigo-100">Fulfilling Pharmacy</p>
                 <p className="font-bold text-lg">{order.pharmacy.name}</p>
             </div>
          )}
      </div>
      
      <div className="p-8">
          <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-8">
            <div>
                <p className="text-sm font-mono text-muted-foreground">Order ID: {order?.id}</p>
                <p className="font-extrabold text-2xl mt-2">₹{order?.totalAmount}</p>
            </div>
            <div className="bg-muted p-4 rounded-xl flex-1 max-w-sm">
                <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Delivering To</p>
                <p className="text-sm font-medium">{order?.deliveryAddress}</p>
            </div>
          </div>

          <div className="relative pt-6">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-800 rounded-full md:-translate-x-1/2"></div>
            
            <div className="absolute left-6 md:left-1/2 top-0 w-1 bg-indigo-500 rounded-full md:-translate-x-1/2 transition-all duration-1000 ease-out z-0" 
                style={{ height: `${currentStatusIndex >= 0 ? (currentStatusIndex / (STEPS.length - 1)) * 100 : 0}%` }}></div>

            <div className="space-y-16 md:space-y-0 md:flex flex-col md:flex-row justify-between items-start relative z-10">
            {STEPS.map((step, idx) => {
                const isCompleted = currentStatusIndex >= idx;
                const isCurrent = currentStatusIndex === idx;
                const Icon = step.icon;

                return (
                <div key={step.id} className={`flex md:flex-col items-center gap-6 md:gap-4 w-full ${isCompleted ? 'text-black dark:text-white' : 'text-gray-400'}`}>
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={{ scale: isCurrent ? 1.2 : 1, boxShadow: isCurrent ? "0 0 20px rgba(99, 102, 241, 0.4)" : "none" }}
                        className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-[4px] bg-background transition-colors duration-500
                        ${isCompleted ? 'border-indigo-500 text-indigo-600' : 'border-gray-200'}
                        `}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                    <div className="md:text-center">
                      <h4 className="font-extrabold text-lg">{step.label}</h4>
                      <p className="text-sm font-medium text-muted-foreground mt-1">{step.desc}</p>
                      {step.id === "SHIPPED" && isCompleted && order?.deliveryAgent && (
                          <div className="mt-3 bg-indigo-50 text-indigo-700 p-3 rounded-xl border border-indigo-100 flex flex-col items-center text-xs md:mx-auto w-fit">
                              <span className="font-bold">{order.deliveryAgent.name}</span>
                              <span className="font-mono">{order.deliveryAgent.vehicleNumber}</span>
                              <a href={`tel:${order.deliveryAgent.phone}`} className="mt-2 font-bold underline">Contact Driver</a>
                          </div>
                      )}
                    </div>
                </div>
                );
            })}
            </div>
          </div>
      </div>
    </div>
  );
}
