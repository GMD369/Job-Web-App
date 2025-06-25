import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext.jsx";
import api from "../../api";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-Time",
    description: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    try {
      const response = await api.post(
        "/jobs",
        { ...formData, postedBy: user._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/employer/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white/80 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-gray-200 animate-fade-in">
        <h2 className="text-4xl md:text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 mb-8 tracking-tight drop-shadow-md">
        Post a New Job
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Text Inputs */}
          {[
            {
              label: "Job Title",
              name: "title",
              placeholder: "e.g. Frontend Developer",
            },
            {
              label: "Company Name",
              name: "company",
              placeholder: "e.g. Google, TechHive",
            },
            {
              label: "Location",
              name: "location",
              placeholder: "e.g. Remote, Lahore, Karachi",
            },
            {
              label: "Salary (Optional)",
              name: "salary",
              placeholder: "e.g. 80,000 PKR/month",
            },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-800 font-semibold mb-1">
                {field.label}
              </label>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name !== "salary"}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200 shadow-sm"
                placeholder={field.placeholder}
              />
            </div>
          ))}

          {/* Job Type */}
          <div>
            <label className="block text-gray-800 font-semibold mb-1">
              Job Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200 shadow-sm bg-white"
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-800 font-semibold mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition duration-200 shadow-sm"
              placeholder="Describe responsibilities, required skills, etc."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 rounded-xl text-lg font-semibold shadow-md transition duration-200"
          >
            {loading ? "Posting..." : " Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
