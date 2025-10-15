import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      name: "General Consultation",
      description: "Comprehensive health checkups and consultations",
      price: 500,
      time: "30 min",
      href: "/services/general-consultation",
    },
    {
      name: "Specialist Care",
      description: "Expert care from certified specialists",
      price: 800,
      time: "45 min",
      href: "/services/specialist-care",
    },
    {
      name: "Emergency Care",
      description: "24/7 emergency medical services",
      price: 1200,
      time: "Available 24/7",
      href: "/services/emergency-care",
    },
    {
      name: "Health Screening",
      description: "Preventive health screening packages",
      price: 1500,
      time: "60 min",
      href: "/services/health-screening",
    },
  ];

  return (
    <div className="px-10 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Our Services</h1>
      <p className="text-gray-600 mb-10">
        Comprehensive healthcare services designed to meet all your medical needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <div
            key={service.name}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
            <p className="text-gray-500 mb-4">{service.description}</p>
            <p className="text-teal-600 font-semibold mb-2">
              ₹{service.price} • {service.time}
            </p>
            <Link
              href={service.href}
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
