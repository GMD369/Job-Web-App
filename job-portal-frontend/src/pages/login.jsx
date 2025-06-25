import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext.jsx";
import { Eye, EyeOff } from "lucide-react"; // 👁️ icons
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // default is hidden
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const user = res.data.user;
      login(user, res.data.token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      // Redirect based on role
      if (user.role === "seeker") {
        navigate("/seeker");
      } else if (user.role === "employer") {
        navigate("/employer");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("Unauthorized role");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-indigo-100 relative px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(#e0e7ff_1px,transparent_1px)] [background-size:40px_40px] opacity-50" />

      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/70 backdrop-blur-md border border-slate-200 shadow-xl rounded-2xl p-6 sm:p-8 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 text-center mb-4 sm:mb-6">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-600 text-center mb-5">
          Sign in to your <span className="text-indigo-600 font-medium">SkillBridge</span> account
        </p>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-200 shadow-md"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-700">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
