"use client";
import { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Assuming this exists or falls back cleanly

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout({ items, total, onSuccess }: { items: any[], total: number, onSuccess: (order: any) => void }) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast?.() ?? { toast: console.log };

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    const res = await loadRazorpay();
    if (!res) {
      toast({ title: "Error", description: "Razorpay failed to load", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      // 1. Create order
      const initRes = await fetch("/api/pharmacy/orders/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, totalAmount: total, deliveryAddress: address }),
      });
      
      const orderData = await initRes.json();
      if (!initRes.ok) throw new Error(orderData.message);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.razorpayOrder.amount,
        currency: "INR",
        name: "E-Pharmacy Express",
        description: "Payment for Medicine Order",
        order_id: orderData.razorpayOrder.id,
        handler: async function (response: any) {
          // 2. Verify payment
          try {
            const verifyRes = await fetch("/api/pharmacy/orders/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.order.id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              onSuccess(verifyData.order);
              toast({ title: "Success", description: "Payment verified successfully!" });
            } else {
              toast({ title: "Verification Failed", description: verifyData.message, variant: "destructive" });
            }
          } catch(err) {
              toast({ title: "Error", description: "Failed to verify payment." });
          }
        },
        prefill: {
          name: "Patient",
          email: "patient@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4F46E5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Checkout failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Delivery Details</h2>
      <form onSubmit={handleCheckout} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Full Delivery Address
          </label>
          <textarea 
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border rounded-md p-3 focus:ring-2 focus:ring-primary outline-none"
            placeholder="123 Street Name, City, State, ZIP"
          />
        </div>

        <div className="bg-muted p-4 rounded-md">
          <h3 className="font-semibold mb-2">Order Summary</h3>
          <ul className="text-sm space-y-1 mb-4 text-muted-foreground">
            {items.map(i => <li key={i.id}>{i.quantity}x {i.name}</li>)}
          </ul>
          <div className="flex justify-between font-bold text-lg">
            <span>Amount to Pay</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || items.length === 0}
          className="w-full flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Processing..." : "Pay Securely via Razorpay"}
        </button>
      </form>
    </div>
  );
}
