import { Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const { user } = useAuth();

  let homePath = "/";
  if (user?.role === "seeker") {
    homePath = "/seeker";
  } else if (user?.role === "employer") {
    homePath = "/employer";
  } else if (user?.role === "admin") {
    homePath = "/admin/dashboard";
  }

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Skill<span className="text-gray-800">Bridge</span>
            </h2>
            <p className="text-gray-600 text-sm">
              Empowering careers. Connecting talent with opportunity.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to={homePath} className="hover:text-green-600 transition">Home</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-green-600 transition">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-green-600 transition">Register</Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Connect with us</h3>
            <div className="flex justify-center sm:justify-start space-x-4 text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-indigo-600 transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-indigo-600 transition"><Instagram size={20} /></a>
              <a href="#" className="hover:text-indigo-600 transition"><Linkedin size={20} /></a>
              <a href="mailto:support@skillbridge.com" className="hover:text-indigo-600 transition"><Mail size={20} /></a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 text-center text-xs text-gray-400 border-t pt-4">
          &copy; {new Date().getFullYear()} SkillBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
