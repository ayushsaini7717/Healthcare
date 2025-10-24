import React from 'react';
import { Heart, Truck, Package } from 'lucide-react'; // Using icons

/**
 * Shipping Policy Page
 * * This page clarifies that your service is digital/in-person and
 * * does not involve shipping physical goods.
 * This is often a required check for payment gateways like Razorpay.
 */
export default function ShippingPolicyPage() {
  const companyName = "HealthCare+"; // Replace with your actual company/platform name
  const supportEmail = "[Your-Support-Email@example.com]"; // Replace with your support email

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto p-8 md:p-12 bg-card text-card-foreground shadow-lg rounded-xl border border-border">
        
        <div className="flex items-center gap-3 mb-6">
           <Truck className="h-6 w-6 text-primary" />
           <h1 className="text-3xl font-extrabold text-foreground">
             Shipping & Delivery Policy
           </h1>
        </div>
        
        <div className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="p-6 bg-muted/50 rounded-lg border border-border">
            <div className="flex justify-center mb-4">
              <Package className="h-16 w-16 text-primary/50" />
            </div>
            <h2 className="text-2xl font-semibold text-center text-foreground mb-3">
              No Physical Shipping
            </h2>
            <p className="text-center text-lg">
              {companyName} is a platform for booking in-person and digital 
              (video call) healthcare appointments.
            </p>
            <p className="text-center mt-2">
              We do not sell or deliver any physical goods, products, or 
              medications. Therefore, a shipping policy is not applicable
              to our services. All services are rendered either at the 
              hospital's physical location or delivered digitally via video call.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Delivery of Service</h2>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>
                <strong>In-Person Appointments:</strong> Your service is delivered
                at the time and location of your scheduled appointment with the
                healthcare provider.
              </li>
              <li>
                <strong>Video Call Appointments:</strong> Your service is delivered
                digitally. You will receive a confirmation email with a unique
                video link to join your appointment at the scheduled time.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Contact Us</h2>
            <p>
              If you have any questions about how our services are delivered,
              please contact us at:
              <br />
              <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">
                {supportEmail}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}