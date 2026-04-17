"use client";
import { useState, useEffect } from "react";
import Checkout from "@/components/pharmacy/Checkout";
import OrderTracking from "@/components/pharmacy/OrderTracking";
import { ShoppingCart, Pill, Plus, Minus, Truck } from "lucide-react";
import { motion } from "framer-motion";

const MEDICINES_CATALOG = [
  { id: "1", name: "Paracetamol 500mg", price: 50, category: "Fever" },
  { id: "2", name: "Amoxicillin 250mg", price: 120, category: "Antibiotic" },
  { id: "3", name: "Vitamin C Zinc", price: 90, category: "Immunity" },
  { id: "4", name: "Cough Syrup 100ml", price: 75, category: "Cold" },
  { id: "5", name: "Ibuprofen 400mg", price: 60, category: "Pain Relief" },
];

export default function PharmacyDashboard() {
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const t = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(t);
  }, [cart]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/pharmacy/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
            // Show tracking for the most recent order if not delivered
            if(data[0].status !== "DELIVERED" && data[0].status !== "CANCELLED") {
                setActiveOrder(data[0]);
            }
        }
      }
    } catch(e) {}
  };

  const addToCart = (med: any) => {
    const existing = cart.find(i => i.id === med.id);
    if (existing) {
      setCart(cart.map(i => i.id === med.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...med, quantity: 1, medicineName: med.name }]);
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }).filter(i => i.quantity > 0));
  };

  if (activeOrder && !isCheckingOut) {
      return (
          <div className="container mx-auto px-4 py-8">
              <div className="flex justify-between items-center mb-8">
                  <h1 className="text-3xl font-bold font-sans">Active Delivery Tracking</h1>
                  <button onClick={() => setActiveOrder(null)} className="px-4 py-2 border rounded hover:bg-muted">Back to Store</button>
              </div>
              <OrderTracking order={activeOrder} />
          </div>
      );
  }

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button onClick={() => setIsCheckingOut(false)} className="mb-4 text-primary hover:underline">
          &larr; Back to Shop
        </button>
        <Checkout 
            items={cart} 
            total={total} 
            onSuccess={(createdOrder) => {
                setIsCheckingOut(false);
                setCart([]);
                setActiveOrder(createdOrder);
            }} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        
        {/* Pharmacy Storefront */}
        <div className="w-full md:w-2/3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white mb-8 shadow-xl">
            <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
              <Pill className="h-10 w-10"/> E-Pharmacy Express
            </h1>
            <p className="text-blue-100 text-lg">Fast, reliable medicine delivery at your doorstep.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MEDICINES_CATALOG.map((med) => (
              <motion.div whileHover={{ scale: 1.05 }} key={med.id} className="border rounded-lg p-5 shadow-sm bg-card flex flex-col justify-between">
                <div>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{med.category}</span>
                  <h3 className="font-semibold text-lg mt-3">{med.name}</h3>
                  <p className="text-2xl font-bold text-primary mt-2">₹{med.price}</p>
                </div>
                <button 
                  onClick={() => addToCart(med)}
                  className="mt-4 w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-md font-medium transition-colors"
                >
                  Add to Cart
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-full md:w-1/3 border rounded-xl p-6 sticky top-24 bg-card shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart /> Your Cart
          </h2>
          
          {cart.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Truck className="mx-auto h-12 w-12 mb-3 opacity-50" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-muted/50 p-3 rounded">
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 rounded bg-background shadow hover:bg-muted"><Minus className="w-4 h-4" /></button>
                    <span className="w-4 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 rounded bg-background shadow hover:bg-muted"><Plus className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4 mt-6">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg font-bold mt-6 hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
