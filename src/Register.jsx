import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderSection from "./assets/components/home-components/HeaderSection";
import FooterSection from "./assets/components/home-components/FooterSection";
import { UserContext } from "./assets/context-api/user-context/UserContext";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    otherName: "",
    email: "",
    matricNumber: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, loading, error: contextError } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (success && !error) {
      const timer = setTimeout(() => {
        navigate("/account/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, error, navigate]);

  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword || !form.matricNumber || !form.phone) {
      setError("All fields are required.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        otherName: form.otherName,
        phone: form.phone,
        matricNumber: form.matricNumber,
        password: form.password
      });
      setSuccess("Registration successful!");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <>
      <HeaderSection />
      <div className="min-h-screen flex items-center justify-center bg-transparent pt-[120px] pb-[60px] ml-4 mr-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Create an Account
          </h2>
          <p className="text-gray-500 text-center mb-6">
            Get started with Hostel Management
          </p>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}
          {success && <div className="text-green-600 text-center mb-4">{success}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Other Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Other Name
              </label>
              <input
                type="text"
                name="otherName"
                value={form.otherName}
                onChange={handleChange}
                placeholder="Optional"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Matric Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Matric Number
              </label>
              <input
                type="text"
                name="matricNumber"
                value={form.matricNumber}
                onChange={handleChange}
                placeholder="Enter your matric number"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Matric Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            {/* Sign up button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-lg transition"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Already have an account */}
          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
