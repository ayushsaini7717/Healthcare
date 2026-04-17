"use client";
import { useState } from "react";
import { Loader2, MapPin, Upload, FileCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Checkout({ items, totalAmount, requiresRx, onSuccess }: any) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [rxUrl, setRxUrl] = useState<string | null>(null);
  const [rxLoading, setRxLoading] = useState(false);
  const { toast } = useToast?.() ?? { toast: console.log };

  // For MVP: Auto-generate a dummy lat/long near our mocked Apollo Pharmacy.
  const MOCK_LAT = 28.6139;
  const MOCK_LNG = 77.2090;

  const handleRxUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setRxLoading(true);
    const fd = new FormData();
    fd.append("file", file);

    try {
        const res = await fetch("/api/pharmacy/upload", { method: "POST", body: fd });
        const data = await res.json();
        setRxUrl(data.url);
        toast({ title: "Prescription Uploaded", description: "Verification pending post-order." });
    } catch(err) {
        toast({ title: "Failed", variant: "destructive" });
    } finally {
        setRxLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    if (requiresRx && !rxUrl) {
      toast({ title: "Missing Prescription", description: "You must attach an Rx to continue.", variant: "destructive" });
      return;
    }

    setLoading(true);

    try {
      // 1. Create order
      const initRes = await fetch("/api/pharmacy/orders/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            items, 
            totalAmount, 
            deliveryAddress: address,
            lat: MOCK_LAT,
            lng: MOCK_LNG,
            prescriptionUrl: rxUrl
        }),
      });
      
      const orderData = await initRes.json();
      if (!initRes.ok) throw new Error(orderData.message);

      toast({ title: "Success", description: "Order placed successfully!" });
      onSuccess(orderData.order);

    } catch (error: any) {
      toast({ title: "Order Rejected", description: error.message || "Failed. Maybe out of stock or out of range.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-2xl p-8 shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Secure Checkout</h2>
      <form onSubmit={handleCheckout} className="space-y-6">
        
        {requiresRx && (
            <div className="p-5 border border-dashed rounded-xl bg-muted/50 relative">
                <h3 className="font-semibold mb-2 flex items-center gap-2 text-orange-600"><FileCheck className="w-5 h-5"/> Prescription Required</h3>
                {rxUrl ? (
                    <div className="flex items-center gap-3 text-sm text-green-600 font-medium bg-green-50 p-3 flex-row rounded-lg w-full">
                       <Check className="w-5 h-5"/> Uploaded! Verified by pharmacist post-order.
                    </div>
                ) : (
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-muted transition relative">
                        <input type="file" required onChange={handleRxUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*,.pdf" />
                        <div className="text-center">
                            {rxLoading ? <Loader2 className="animate-spin w-8 h-8 text-primary mx-auto" /> : <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />}
                            <span className="text-sm font-medium">Click to upload RX (PDF, Image)</span>
                        </div>
                    </div>
                )}
            </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-indigo-500" /> Delivery Location
          </label>
          <div className="relative">
              <textarea 
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none bg-background shadow-inner"
                placeholder="Sector 14, Plot 34, Central Delhi..."
              />
              <div className="absolute right-3 bottom-3 bg-muted px-2 py-1 text-xs rounded text-muted-foreground font-mono">
                  GPS Auth Active
              </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || (requiresRx && !rxUrl)}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center"
        >
          {loading && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
          {loading ? "Processing..." : `Place Order (Mock Payment ₹${totalAmount})`}
        </button>
      </form>
    </div>
  );
}

const Check = ({className}: {className: string}) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
