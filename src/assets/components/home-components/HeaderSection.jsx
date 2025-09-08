import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeaderSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        
        {/* Logo / Title */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Hostel<span className="text-gray-800">Portal</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#home" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="#rooms" className="text-gray-700 hover:text-blue-600">Book a Room</a>
          <a href="#students" className="text-gray-700 hover:text-blue-600">Facilities</a>
          <a href="#contact" className="text-gray-700 hover:text-blue-600">Complaints</a>
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Login
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <nav className="flex flex-col space-y-4 p-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
            <Link to=""  href="#rooms" className="text-gray-700 hover:text-blue-600">Book a Room</Link>
            <Link to="" href="#students" className="text-gray-700 hover:text-blue-600">Facilities</Link>
            <Link to="" href="#contact" className="text-gray-700 hover:text-blue-600">Complaints</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition z-50 text-center">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  </>
  );
}
