"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Globe } from "lucide-react";

const features = [
  {
    icon: <ShieldCheck className="h-10 w-10 text-emerald-600" />,
    title: "Trusted & Secure",
    description:
      "Your data and privacy are protected with hospital-grade encryption and compliance standards.",
  },
  {
    icon: <Stethoscope className="h-10 w-10 text-emerald-600" />,
    title: "Expert Doctors",
    description:
      "Connect with verified healthcare professionals across multiple specialties anytime you need care.",
  },
  {
    icon: <Globe className="h-10 w-10 text-emerald-600" />,
    title: "Accessible Anywhere",
    description:
      "Book, consult, and track your health — all from the comfort of your home, wherever you are.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-gray-900 mb-6"
        >
          Why Choose <span className="text-emerald-600">HealthCare+</span>?
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-gray-600 mb-14 max-w-2xl mx-auto"
        >
          We combine advanced technology with compassionate care to make healthcare
          simple, fast, and reliable for everyone.
        </motion.p>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="p-8 bg-emerald-50 rounded-3xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
