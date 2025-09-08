import { BedDouble, Users, DoorOpen } from "lucide-react";

export default function DashStats() {
  const stats = [
    {
      icon: <BedDouble className="w-10 h-10 text-blue-600" />,
      title: "Available Rooms",
      value: "42",
    },
    {
      icon: <DoorOpen className="w-10 h-10 text-green-600" />,
      title: "Occupied Rooms",
      value: "128",
    },
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Vacant Rooms",
      value: "76",
    },
  ];

  return (
    <section id="dashboard-preview" className="py-20 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Hostel Overview
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl shadow-md hover:shadow-xl transition p-8"
            >
              <div className="flex justify-center mb-4">{stat.icon}</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
