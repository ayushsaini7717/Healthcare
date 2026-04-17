"use client";
import { useEffect, useState } from "react";
import { Search, Loader2, CheckCircle, Package, Truck, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function AdminPharmacyDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast?.() ?? { toast: console.log };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await fetch("/api/admin/pharmacy/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const handleAction = async (orderId: string, action: string) => {
    try {
        const res = await fetch("/api/admin/pharmacy/orders", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId, action })
        });
        if (res.ok) {
            toast({ title: "Action Successful" });
            fetchOrders();
        } else {
            toast({ title: "Failed", variant: "destructive" });
        }
    } catch(err) {}
  };

  if(loading) return <div className="p-20 text-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-500 mx-auto"/></div>;

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-3">
        <Package className="w-8 h-8 text-indigo-500" />
        Pharmacy Logistics Hub
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
             <div key={order.id} className="border rounded-2xl p-6 bg-card shadow hover:shadow-lg transition-shadow relative">
                 <div className="flex justify-between items-start mb-4 border-b pb-4">
                     <div>
                         <p className="font-mono text-xs text-muted-foreground">#{order.id}</p>
                         <h3 className="font-bold text-lg mt-1">{order.patient?.name || "Guest"}</h3>
                         <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-muted mt-2 inline-block">
                             {order.status}
                         </span>
                     </div>
                     <p className="font-extrabold text-xl text-indigo-600">₹{order.totalAmount}</p>
                 </div>

                 <div className="text-sm space-y-2 mb-6">
                     <p>Items: <strong>{order.items?.length}</strong></p>
                     <p>Delivering To: <br/><span className="text-muted-foreground">{order.deliveryAddress}</span></p>
                     {order.pharmacy && <p className="text-green-600 bg-green-50 p-2 rounded">Assigned: {order.pharmacy.name}</p>}
                     
                     {order.prescriptionUrl && (
                         <div className="mt-4 border border-blue-200 bg-blue-50 p-3 rounded-lg flex items-center justify-between text-blue-800">
                             <div className="flex items-center gap-2 font-semibold">
                                 <ImageIcon className="w-4 h-4"/> Rx Document
                             </div>
                             <a href={order.prescriptionUrl} target="_blank" className="underline text-xs" rel="noreferrer">View</a>
                         </div>
                     )}
                 </div>

                 <div className="flex flex-col gap-2">
                     {order.status === "PENDING_VERIFICATION" && (
                         <button onClick={() => handleAction(order.id, 'VERIFY_RX')} className="w-full bg-green-600 text-white rounded-lg py-2 font-bold flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4"/> Verify & Approve Rx
                         </button>
                     )}
                     {(order.status === "PAID" || order.status === "PROCESSING") && (
                         <button onClick={() => handleAction(order.id, 'DISPATCH')} className="w-full bg-indigo-600 text-white rounded-lg py-2 font-bold flex items-center justify-center gap-2">
                            <Truck className="w-4 h-4"/> Assign Driver & Dispatch
                         </button>
                     )}
                     {order.status === "SHIPPED" && (
                         <div className="bg-muted p-2 rounded-lg text-center text-xs font-medium border border-indigo-200">
                             Out with {order.deliveryAgent?.name} ({order.deliveryAgent?.vehicleNumber})
                             <button onClick={() => handleAction(order.id, 'MARK_DELIVERED')} className="mt-2 w-full border border-indigo-600 text-indigo-600 rounded py-1">Mark as Delivered</button>
                         </div>
                     )}
                     {order.status === "DELIVERED" && (
                         <div className="bg-green-100 text-green-800 font-bold text-center py-2 rounded-lg">Order Complete</div>
                     )}
                 </div>
             </div> 
          ))}
      </div>
    </div>
  );
}
