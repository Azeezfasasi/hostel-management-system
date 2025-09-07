import React from "react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white h-[90vh] flex items-center"
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
            Manage Your Hostel <br /> With Ease & Efficiency
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            A modern solution for managing hostel rooms, students, payments, and requests —
            all in one platform.
          </p>
          <div className="flex space-x-4">
            <button className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold">
                Get Started
            </button>
            <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 font-semibold">
                Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
