import Link from "next/link";

export default function HealthScreeningPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Health Screening</h1>
      <p className="text-gray-600 mb-6">
        Our preventive Health Screening packages help detect health issues early
        through detailed diagnostic tests and medical evaluations, keeping you
        informed about your well-being.
      </p>

      <ul className="list-disc pl-6 text-gray-700 mb-6">
        <li>Full body health screening</li>
        <li>Blood pressure, sugar, and cholesterol checks</li>
        <li>Diagnostic imaging (optional)</li>
        <li>Doctor consultation and result analysis</li>
      </ul>

      <p className="text-lg font-semibold mb-4">Fee: ₹1500 | Duration: 60 min</p>

      <Link
        href="/book-appointment"
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Book Screening
      </Link>
    </div>
  );
}
