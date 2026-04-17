"use client";
import { useState, useEffect } from "react";
import Checkout from "@/components/pharmacy/Checkout";
import OrderTracking from "@/components/pharmacy/OrderTracking";
import { ShoppingCart, Search, Pill, ShieldCheck, Tag } from "lucide-react";
import { motion } from "framer-motion";

export default function PharmacyDashboard() {
  const [catalog, setCatalog] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState({ mrp: 0, discount: 0, final: 0 });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    fetchOrders();
    fetchCatalog("");
  }, []);

  const fetchCatalog = async (q: string) => {
    const res = await fetch(`/api/pharmacy/catalog?q=${q}`);
    const data = await res.json();
    setCatalog(data);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/pharmacy/orders");
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0 && data[0].status !== "DELIVERED" && data[0].status !== "CANCELLED") {
            setActiveOrder(data[0]);
        }
      }
    } catch(e) {}
  };

  useEffect(() => {
    let mrp = 0; let final = 0;
    cart.forEach(item => {
      mrp += item.mrp * item.quantity;
      final += (item.discountPrice || item.mrp) * item.quantity;
    });
    setTotal({ mrp, discount: mrp - final, final });
  }, [cart]);

  const addToCart = (med: any) => {
    const existing = cart.find(i => i.id === med.id);
    if (existing) {
      setCart(cart.map(i => i.id === med.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...med, quantity: 1, price: med.discountPrice || med.mrp }]);
    }
  };

  const hasRxItems = cart.some(i => i.prescriptionRequired);

  if (activeOrder && !isCheckingOut) {
      return (
          <div className="container mx-auto px-4 py-8">
              <OrderTracking order={activeOrder} onBack={() => setActiveOrder(null)} />
          </div>
      );
  }

  if (isCheckingOut) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button onClick={() => setIsCheckingOut(false)} className="mb-4 text-primary font-bold hover:underline">
          &larr; Back to Shop
        </button>
        <Checkout 
            items={cart} 
            totalAmount={total.final} 
            requiresRx={hasRxItems}
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
    <div className="container mx-auto px-4 py-8 bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Main Storefront */}
        <div className="w-full md:w-3/4">
          <div className="bg-gradient-to-br from-teal-500 to-indigo-600 rounded-2xl p-8 text-white mb-6 shadow-xl relative overflow-hidden">
            <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
              <Pill className="h-10 w-10"/> 1mg Clone <span className="text-sm font-medium bg-yellow-300 text-black px-2 py-1 rounded-full">PRO</span>
            </h1>
            <p className="text-indigo-100 text-lg mb-6">India&apos;s Most Trusted Pharmacy Network.</p>
            
            <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search medicines, salts or categories..." 
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        fetchCatalog(e.target.value);
                    }}
                    className="w-full pl-10 pr-4 py-3 rounded-full text-black outline-none shadow-md"
                />
            </div>
          </div>

          <h2 className="text-xl font-bold mb-4 px-2">Featured & Verified Medications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalog.map((med) => (
              <motion.div whileHover={{ y: -3 }} key={med.id} className="bg-white dark:bg-black border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
                {med.discountPrice && med.mrp > med.discountPrice && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl flex items-center">
                        <Tag className="w-3 h-3 mr-1"/> {Math.round(((med.mrp - med.discountPrice)/med.mrp)*100)}% OFF
                    </div>
                )}
                
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">{med.category}</p>
                <h3 className="font-bold text-lg leading-tight mb-1">{med.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-1 mb-2" title={med.saltComposition}>{med.saltComposition}</p>
                
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-500 mb-3 bg-green-50 dark:bg-green-950 w-fit px-2 py-1 rounded">
                    <ShieldCheck className="w-3 h-3"/> By {med.manufacturer}
                </div>

                <div className="flex items-end justify-between mt-auto pt-4">
                  <div>
                    <p className="text-xs text-muted-foreground line-through">₹{med.mrp}</p>
                    <p className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">₹{med.discountPrice || med.mrp}</p>
                  </div>
                  <button 
                    onClick={() => addToCart(med)}
                    className="bg-zinc-900 dark:bg-zinc-100 dark:text-black hover:bg-zinc-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
                  >
                    ADD
                  </button>
                </div>
                {med.prescriptionRequired && (
                   <p className="text-[10px] text-red-500 mt-3 font-semibold absolute bottom-2">* Prescription Required</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dynamic Cart */}
        <div className="w-full md:w-1/4">
          <div className="bg-white dark:bg-black border rounded-2xl p-6 sticky top-8 shadow-sm">
            <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
              <ShoppingCart size={20} /> Your Cart
            </h2>
            
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b pb-3">
                    <div className="w-2/3">
                      <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">₹{item.price} x {item.quantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <p className="font-bold text-sm">₹{item.price * item.quantity}</p>
                        <div className="flex items-center border rounded">
                            <button onClick={() => addToCart({...item, quantity: -1})} className="px-2 text-xs hover:bg-muted">-</button>
                            <span className="px-2 text-xs border-x">{item.quantity}</span>
                            <button onClick={() => addToCart(item)} className="px-2 text-xs hover:bg-muted">+</button>
                        </div>
                    </div>
                  </div>
                ))}

                <div className="pt-2 text-sm text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span>Item Total (MRP)</span> <span>₹{total.mrp}</span></div>
                  <div className="flex justify-between text-green-600"><span>Discount</span> <span>-₹{total.discount}</span></div>
                  <div className="flex justify-between font-bold text-black dark:text-white pt-2 border-t text-lg mt-2">
                    <span>To Pay</span>
                    <span>₹{total.final}</span>
                  </div>
                </div>

                {hasRxItems && (
                  <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 border border-orange-200 p-2 rounded text-xs font-semibold mt-4">
                    Requires Doctor&apos;s Prescription. You&apos;ll upload it in the next step.
                  </div>
                )}

                <button 
                  onClick={() => setIsCheckingOut(true)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold mt-4 shadow-lg transition-all"
                >
                  Checkout ₹{total.final}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
