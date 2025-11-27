import { Mail, Phone } from "lucide-react";
import SubscribeToNewsletter from "./SubscribeToNewsletter";

export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-6 md:px-12 grid gap-10 md:grid-cols-3">
        
        {/* Logo / About */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Unizik Hostel <span className="text-blue-500">Portal</span>
          </h2>
          <p className="text-gray-400">
            A modern hostel management system for students and admins. Manage
            rooms, records, and payments with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <a href="#home" className="hover:text-blue-500 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#rooms" className="hover:text-blue-500 transition">
                Rooms
              </a>
            </li>
            <li>
              <a href="#students" className="hover:text-blue-500 transition">
                Students
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-blue-500 transition">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span>support@unizikhostel.edu.ng</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-500" />
              <span>+234  806 735 5116</span>
            </li>
          </ul>
        </div>

        <div>
          <SubscribeToNewsletter />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} UnizikHostel. All rights reserved.
      </div>
    </footer>
  );
}
