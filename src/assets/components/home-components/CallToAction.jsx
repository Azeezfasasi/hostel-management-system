import React from "react";

export default function CallToAction() {
  return (
    <section className="relative bg-blue-700 text-white py-20 mb-12">
      {/* Background pattern / overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
        }}
      ></div>

      {/* Content */}
      <div className="container mx-auto relative z-10 px-6 md:px-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Simplify Your Hostel Life?
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Get started today and manage your room, fees, and daily hostel life with just a few clicks. The portal is designed to help you save time and focus on what matters most—your studies.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#login"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login Now
          </a>
          <a
            href="#contact"
            className="bg-transparent border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition"
          >
            Check Availability
          </a>
        </div>
      </div>
    </section>
  );
}
