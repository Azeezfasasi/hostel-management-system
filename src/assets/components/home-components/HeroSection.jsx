import React from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white h-[500px] md:h-[90vh] flex items-center pt-[90px] md:pt-0"
    >
      {/* Overlay for background image (optional) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c')" }}
      ></div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-6 md:px-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Welcome to <br /> <span className="text-red-600">Unizik Hostel Portal</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Manage your accommodation, connect with fellow students, and stay updated on all hostel activities in one place.
          </p>
          <div className="flex flex-col md:flex-row gap-6 md:gap-0 space-x-4">
            <Link to="/room-availability" className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
                Check Availability
            </Link>
            <Link to="/login" className="bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 font-semibold text-center">
                Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
