import { BedDouble, Users, CreditCard } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <BedDouble className="w-12 h-12 text-blue-600" />,
      title: "Room Management",
      description:
        "Easily manage hostel blocks, rooms, and bed spaces with a simple and intuitive interface.",
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Student Records",
      description:
        "Maintain detailed student profiles, allocate rooms, and keep track of hostel occupancy.",
    },
    {
      icon: <CreditCard className="w-12 h-12 text-blue-600" />,
      title: "Payments",
      description:
        "Track hostel fee payments, generate receipts, and ensure smooth financial management.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
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
