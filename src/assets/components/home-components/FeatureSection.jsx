import { BedDouble, Users, CreditCard } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <BedDouble className="w-12 h-12 text-blue-600" />,
      title: "Room Management",
      description:
        "Find your perfect space. Check room availability, see who your roommates are, and view details about your assigned room—all from one place.",
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Student Records",
      description:
        "Manage your profile. Keep your personal information up-to-date and see your student status at a glance. It's your digital student ID for the hostel.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-blue-600" />,
      title: "Payments",
      description:
        "Pay your fees with ease. View your payment history, track upcoming due dates, and generate receipts for hostel fees and other charges.",
    },
  ];

  return (
    <section id="features" className="py-0 bg-gray-50 mb-12 mt-12">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Key Features
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-center mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
