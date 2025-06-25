import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/authContext"; // ✅ Make sure path is correct

const heroImg = "/assets/job.jpg";
const logos = [
  "/assets/1.jpg",
  "/assets/2.jpg",
  "/assets/3.jpg",
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // ✅ Redirect if user is logged in
  useEffect(() => {
    if (!user) return;

    if (user.role === "seeker") {
      navigate("/seeker");
    } else if (user.role === "employer") {
      navigate("/employer");
    } else if (user.role === "admin") {
      navigate("/admin/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 md:px-12 py-12">
      {/* Hero Section */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full max-w-6xl gap-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 leading-tight">
            Welcome to SkillBridge – Your Gateway to Opportunities
          </h1>
          <p className="text-lg text-slate-600 mb-6">
            A modern job application platform where seekers and employers
            connect effortlessly. Discover, apply, hire, and succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button
              onClick={() => navigate("/register")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 transition"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate("/login")}
              className="bg-white border border-slate-300 px-6 py-3 rounded-lg text-lg font-medium hover:bg-slate-100 transition text-slate-700"
            >
              Login
            </button>
          </div>
        </div>

        <div className="md:w-1/2">
          <img
            src={heroImg}
            alt="Job Search Illustration"
            className="w-full h-auto max-h-[400px]"
          />
        </div>
      </div>

      {/* Trusted Logos - Dark Style */}
      <div className="mt-16 w-full max-w-5xl bg-green-950 py-10 px-6 rounded-2xl shadow-lg">
        <p className="text-center text-slate-200 text-sm mb-6 font-semibold">
          Trusted by companies like
        </p>
        <div className="flex justify-center gap-8 flex-wrap items-center">
          {logos.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Logo ${idx + 1}`}
              className="h-10 object-contain grayscale hover:grayscale-0 transition"
            />
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-20 max-w-5xl w-full">
        <h2 className="text-2xl font-semibold text-slate-800 text-center mb-10">
          What Our Users Say
        </h2>
        <div className="grid gap-8 md:grid-cols-3 text-center px-4">
          {[
            {
              quote: "Landed a great job within days!",
              name: "Ali Raza",
              role: "Frontend Developer",
            },
            {
              quote: "We hired a front-end and backend developer.",
              name: "TechHive",
              role: "Startup Team",
            },
            {
              quote: "Interface is clean, fast & efficient!",
              name: "Zara Ahmed",
              role: "UI/UX Designer",
            },
          ].map((t, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-lg shadow-sm">
              <p className="text-slate-700 italic mb-3">"{t.quote}"</p>
              <h4 className="font-semibold text-slate-800">{t.name}</h4>
              <span className="text-sm text-slate-500">{t.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Light "Our Users" Section */}
      <div className="mt-20 w-full max-w-6xl bg-slate-100 rounded-2xl p-10 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-6">
          Our Growing Community
        </h3>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-8">
          Over 10,000+ professionals and companies use SkillBridge to connect,
          grow, and achieve more together.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-left">
          <div className="bg-white rounded-xl p-6 shadow w-72">
            <p className="font-semibold text-slate-800">👩‍💼 5000+ Job Seekers</p>
            <p className="text-sm text-slate-600 mt-1">
              Find your dream role in tech, business, and more.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow w-72">
            <p className="font-semibold text-slate-800">🏢 3000+ Employers</p>
            <p className="text-sm text-slate-600 mt-1">
              Hire quality talent across domains effortlessly.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow w-72">
            <p className="font-semibold text-slate-800">🌍 20+ Countries</p>
            <p className="text-sm text-slate-600 mt-1">
              Connecting talent across borders and industries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
