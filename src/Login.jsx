import { useState, useContext, useEffect } from "react";
import { Lock, Mail } from "lucide-react";
import HeaderSection from "./assets/components/home-components/HeaderSection";
import FooterSection from "./assets/components/home-components/FooterSection";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "./assets/context-api/user-context/UserContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading, user, token, error: contextError } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && token) {
      if (user.onboardingCompleted) {
        navigate("/account/dashboard");
      } else {
        navigate("/onboarding/onboarding");
      }
    }
  }, [user, token, navigate]);

  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    try {
      await login({ email, password });
      // Do not navigate here; let useEffect handle redirect only if login is successful
    } catch {
      // error will be set from contextError
    }
  };

  return (
    <>
      <HeaderSection />
      <div className="md:h-screen flex items-center justify-center bg-gray-100 py-12 md:p-0 px-4 mt-[70px] md:mt-0">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          {/* Title */}
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
            Hostel<span className="text-gray-800">Portal</span>
          </h2>
          <p className="text-gray-500 text-center mb-8">
            Login to manage your hostel account
          </p>

          {error && <div className="text-red-600 text-center mb-4">{error}</div>}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Extra Links */}
          <div className="flex justify-between mt-6 text-sm">
            <Link to="/forgetpassword" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
      <FooterSection />
    </>
  );
}
