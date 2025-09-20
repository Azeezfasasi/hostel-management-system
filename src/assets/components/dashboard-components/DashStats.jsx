import { BedDouble, Users, DoorOpen, House } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from '@/config/api';

export default function DashStats() {
  const [stats, setStats] = useState({
    hostels: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    vacantBeds: 0,
    totalStudents: 0,
    maleStudents: 0,
    femaleStudents: 0,
    totalStaff: 0,
    totalAdmin: 0,
    totalSuperAdmin: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch hostels
      const hostelRes = await axios.get(`${API_BASE_URL}/hostel`);
      const hostels = hostelRes.data.data || hostelRes.data || [];
      // Fetch rooms
      const roomRes = await axios.get(`${API_BASE_URL}/room`);
      const rooms = roomRes.data.data || roomRes.data || [];
      // Fetch users
      const userRes = await axios.get(`${API_BASE_URL}/users`);
      const users = userRes.data || [];
      // Calculate bed stats
      let availableBeds = 0;
      let occupiedBeds = 0;
      let vacantBeds = 0;
      rooms.forEach(r => {
        const vacant = r.capacity - (r.currentOccupancy || 0);
        availableBeds += r.status === 'available' ? vacant : 0;
        occupiedBeds += r.currentOccupancy || 0;
        vacantBeds += vacant;
      });
      // Calculate user stats
      const totalStudents = users.filter(u => u.role === 'student').length;
      const maleStudents = users.filter(u => u.role === 'student' && u.gender?.toLowerCase() === 'male').length;
      const femaleStudents = users.filter(u => u.role === 'student' && u.gender?.toLowerCase() === 'female').length;
      const totalStaff = users.filter(u => u.role === 'staff').length;
      const totalAdmin = users.filter(u => u.role === 'admin').length;
      const totalSuperAdmin = users.filter(u => u.role === 'super admin').length;
      setStats({
        hostels: Array.isArray(hostels) ? hostels.length : 0,
        availableBeds,
        occupiedBeds,
        vacantBeds,
        totalStudents,
        maleStudents,
        femaleStudents,
        totalStaff,
        totalAdmin,
        totalSuperAdmin,
      });
    } catch (err) {
      // fallback to 0s
      console.log(err);
      setStats({
        hostels: 0,
        availableBeds: 0,
        occupiedBeds: 0,
        vacantBeds: 0,
        totalStudents: 0,
        maleStudents: 0,
        femaleStudents: 0,
        totalStaff: 0,
      });
    }
    setLoading(false);
  };

  const statList = [
    {
      icon: <House className="w-10 h-10 text-amber-700" />,
      title: "Hostel",
      value: stats.hostels,
    },
    {
      icon: <BedDouble className="w-10 h-10 text-blue-600" />,
      title: "Available Beds",
      value: stats.availableBeds,
    },
    {
      icon: <DoorOpen className="w-10 h-10 text-green-600" />,
      title: "Occupied Beds",
      value: stats.occupiedBeds,
    },
    {
      icon: <Users className="w-10 h-10 text-purple-600" />,
      title: "Total Students",
      value: stats.totalStudents,
    },
    {
      icon: <Users className="w-10 h-10 text-blue-800" />,
      title: "Male Students",
      value: stats.maleStudents,
    },
    {
      icon: <Users className="w-10 h-10 text-pink-600" />,
      title: "Female Students",
      value: stats.femaleStudents,
    },
    {
      icon: <Users className="w-10 h-10 text-gray-700" />,
      title: "Total Staff",
      value: stats.totalStaff,
    },
    {
      icon: <Users className="w-10 h-10 text-gray-700" />,
      title: "Total Admins",
      value: stats.totalAdmin,
    },
    {
      icon: <Users className="w-10 h-10 text-gray-700" />,
      title: "Total Super Admins",
      value: stats.totalSuperAdmin,
    },
  ];

  return (
    <section id="dashboard-preview" className="py-8 bg-white">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Hostel Overview
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading stats...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-5">
            {statList.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-200 rounded-2xl shadow-md hover:shadow-xl transition px-6 py-3"
              >
                <div className="flex justify-center mb-4">{stat.icon}</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {stat.title}
                </h3>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
