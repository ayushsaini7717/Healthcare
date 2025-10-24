"use client";

import React,{ useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage=()=>{
    const Amount = 100;
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        try {
            const response = await fetch('/api/create-order', {
                method: 'POST',
            });
            const data = await response.json();
            const orderId = data.orderId;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: Amount * 100,
                currency: "INR",
                name: "HealthCare+",
                description: "Appointment Payment",
                order_id: orderId,
                handler: function (response: any) {
                    alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                },
                prefill: {
                    name: "John Doe",
                    email: "johndo@gmail.com",
                    contact: "9999999999",
                },
                theme: {
                    color: "#3399cc",
                }
            };
            
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-background min-h-screen flex flex-col items-center justify-center p-6">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <div className="max-w-md w-full bg-card text-card-foreground p-8 rounded-lg shadow-lg border border-border">
                <h1 className="text-2xl font-bold mb-6 text-center">Make a Payment</h1>
                <p className="text-lg mb-4">Amount to Pay: ₹{Amount}</p>
                <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition disabled:opacity-50"
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </div>
    );
}
export default PaymentPage;