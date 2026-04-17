"use client";
import { motion } from "framer-motion";
import { Check, Package, Clock, Truck, Home, XCircle } from "lucide-react";

const STEPS = [
  { id: "PAID", label: "Order Confirmed", icon: Check },
  { id: "PROCESSING", label: "Processing", icon: Package },
  { id: "SHIPPED", label: "Shipped", icon: Truck },
  { id: "DELIVERED", label: "Delivered", icon: Home },
];

export default function OrderTracking({ order }: { order: any }) {
  const currentStatusIndex = STEPS.findIndex(s => s.id === order?.status);

  if (!order) return <div className="p-8 text-center"><Clock className="animate-pulse mx-auto opacity-50 mb-4 h-8 w-8"/> Loading order details...</div>;

  if (order.status === "CANCELLED") {
      return (
          <div className="p-12 text-center border border-red-500/20 bg-red-500/10 rounded-xl relative overflow-hidden">
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-3xl font-bold text-red-600 mb-2">Order Cancelled</h2>
              <p className="text-muted-foreground">This order has been cancelled due to payment failure or by the admin.</p>
          </div>
      )
  }

  return (
    <div className="border rounded-xl p-8 bg-card shadow-lg relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Truck className="w-64 h-64 -mr-16 -mt-16" />
      </div>

      <div className="mb-10 border-b pb-6 z-10 relative">
        <h2 className="text-2xl font-bold mb-2">Order #{order.id.slice(-8).toUpperCase()}</h2>
        <p className="text-muted-foreground mb-4">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        <p className="font-semibold text-lg">Total Paid: ₹{order.totalAmount}</p>
        <p className="text-sm mt-2 text-muted-foreground">Delivering to: <span className="font-medium text-foreground">{order.deliveryAddress}</span></p>
      </div>

      <div className="relative pt-4 z-10">
        <div className="absolute left-6 md:left-1/2 top-4 bottom-0 w-1 bg-muted rounded-full -translate-x-1/2"></div>
        
        <div className="absolute left-6 md:left-1/2 top-4 w-1 bg-indigo-500 rounded-full -translate-x-1/2 transition-all duration-1000 ease-out z-0" 
             style={{ height: `${currentStatusIndex >= 0 ? (currentStatusIndex / (STEPS.length - 1)) * 100 : 0}%` }}></div>

        <div className="space-y-12 md:space-y-0 md:flex flex-col md:flex-row justify-between items-center relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStatusIndex >= idx;
            const isCurrent = currentStatusIndex === idx;
            const Icon = step.icon;

            return (
              <div key={step.id} className={`flex md:flex-col items-center gap-6 md:gap-3 ${isCompleted ? 'text-indigo-600 dark:text-indigo-400' : 'text-muted-foreground'}`}>
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isCurrent ? 1.2 : 1, boxShadow: isCurrent ? "0 0 20px rgba(99, 102, 241, 0.5)" : "none" }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 bg-background transition-colors duration-500
                    ${isCompleted ? 'border-indigo-500' : 'border-muted'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </motion.div>
                <div className="md:text-center">
                  <h4 className="font-bold text-lg">{step.label}</h4>
                  {isCurrent && <p className="text-sm text-indigo-500 font-medium">Currently here</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
