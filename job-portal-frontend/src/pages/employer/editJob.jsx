import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api.js";
import { toast } from "react-hot-toast";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    description: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJobData(data);
      } catch (err) {
        toast.error("Failed to load job data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Handle form change
  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/jobs/${id}`, jobData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Job updated successfully!");
      navigate("/employer/dashboard");
    } catch (err) {
      toast.error("Update failed");
      console.error("Update error", err);
    }
  };

  if (loading) return (
  <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-lg font-medium tracking-wide">Loading job...</p>
  </div>
);


  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl border border-slate-200 p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-6"> Edit Job Posting</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1 font-medium text-slate-700">Job Title</label>
            <input
              type="text"
              name="title"
              value={jobData.title}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Company</label>
            <input
              type="text"
              name="company"
              value={jobData.company}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Location</label>
            <input
              type="text"
              name="location"
              value={jobData.location}
              onChange={handleChange}
              required
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Job Type</label>
            <select
              name="type"
              value={jobData.type}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="internship">Internship</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-slate-700">Job Description</label>
            <textarea
              name="description"
              value={jobData.description}
              onChange={handleChange}
              rows="6"
              required
              className="w-full border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-700 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition shadow"
            >
              <i class="fa-regular fa-pen-to-square"></i> Update Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
