import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext.jsx";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavbarLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "employer") return "/employer";
    if (user.role === "seeker") return "/seeker";
    return "/";
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "admin") return "/admin/dashboard";
    if (user.role === "employer") return "/employer/dashboard";
    return "/seeker/dashboard";
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* 🔥 Logo */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-black tracking-tight"
        >
          <Link
            to={getNavbarLink()}
            className="bg-gradient-to-r from-green-500 via-emerald-400 to-teal-500 text-transparent bg-clip-text drop-shadow-[0_1px_6px_rgba(16,185,129,0.6)] hover:drop-shadow-[0_1px_12px_rgba(16,185,129,0.8)] transition-all duration-300"
          >
            Skill<span className="text-gray-800">Bridge</span>
          </Link>
        </motion.div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-emerald-500 text-emerald-600 font-semibold rounded-lg hover:bg-emerald-500 hover:text-white transition-all duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-all duration-200"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to={getDashboardLink()}
                className="px-4 py-2 border border-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-red-500 text-red-600 font-semibold rounded-lg hover:bg-red-600 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-4 pb-4"
          >
            <div className="space-y-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 rounded-md border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to={getDashboardLink()}
                    className="block px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-emerald-600 hover:text-white transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 rounded-md border border-red-500 text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
