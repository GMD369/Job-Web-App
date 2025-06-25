import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import api from "../api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [pendingUser, setPendingUser] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    setError("");
    setShowRoleModal(true);
    setPendingUser({ name, email, password });
  };

  const handleRoleSelect = async (selectedRole) => {
    try {
      const res = await api.post("/auth/register", {
        ...pendingUser,
        role: selectedRole,
      });

      login(res.data.user, res.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setShowRoleModal(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-100 overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 animate-grid bg-[radial-gradient(#d1fae5_1px,transparent_1px)] [background-size:40px_40px] opacity-30 blur-sm" />

      {/* Register Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 z-10">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleInitialSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter Name here"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition duration-200 shadow-sm"
          >
            Continue
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <span className="text-green-600 hover:underline cursor-pointer">Login</span>
        </p>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Your Role</h3>
            <p className="text-sm text-gray-600 mb-6">Please choose how you'd like to register</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => handleRoleSelect("seeker")}
                className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition"
              >
                Job Seeker
              </button>
              <button
                onClick={() => handleRoleSelect("employer")}
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Employer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
