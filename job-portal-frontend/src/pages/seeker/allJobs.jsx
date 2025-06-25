import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingJobId, setPendingJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetail, setJobDetail] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);

  const [keyword, setKeyword] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get("/jobs", {
          params: {
            keyword,
            location: locationFilter,
            type: typeFilter,
            sort: sortOrder,
          },
        });
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchSavedJobs = async () => {
      try {
        const { data } = await api.get("/user/saved-jobs");
        setSavedJobs(data.jobs.map((job) => job._id));
      } catch (err) {
        console.error("Failed to fetch saved jobs", err);
      }
    };

    fetchJobs();
    fetchSavedJobs();
  }, [keyword, locationFilter, typeFilter, sortOrder]);

  const handleApply = async (jobId) => {
    const confirmApply = window.confirm(
      "Are you sure you want to apply for this job?"
    );
    if (!confirmApply) return;

    try {
      const { data: profile } = await api.get("/profile/me");

      // Check for resume
      if (!profile.resume || profile.resume.trim() === "") {
        setPendingJobId(jobId);
        setShowProfileModal(true);
        return;
      }

      const response = await api.post(`/jobs/apply/${jobId}`);
      toast.success(
        response.data.message || "Application submitted successfully!"
      );
      closeModal();
      return;
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to apply for this job.";
      toast.error(errMsg);
    }
  };

  const openJobDetail = async (jobId) => {
    try {
      const { data } = await api.get(`/jobs/${jobId}`);
      setJobDetail(data);
      setSelectedJob(true);
    } catch (err) {
      console.error("Failed to fetch job details", err);
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setJobDetail(null);
  };

  const handleSaveJob = async (jobId) => {
    try {
      const { data } = await api.post(`/user/save-job/${jobId}`);
      if (savedJobs.includes(jobId)) {
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
        toast.success("Job removed from saved list!");
      } else {
        setSavedJobs([...savedJobs, jobId]);
        toast.success("Job saved successfully!");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to save job.";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 py-12 px-4 sm:px-8">
      {/* 🟪 Moving Headlines */}
      <div className=" bg-gradient-to-r from-[#0f172a] to-[#38bdf8] overflow-hidden mb-6 rounded-xl shadow">
        <div className="whitespace-nowrap py-2">
          <div className="inline-block animate-marquee text-white font-semibold text-sm px-4">
            🚀 Post Your Jobs | 🔍 Explore Opportunities | 💼 Apply Now | 📁
            Save Jobs | 🔔 Get Notified Instantly | 📝 Build Your Profile | 🌟
            SkillBridge Empowers Careers
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="bg-white/90 border border-indigo-200 p-10 rounded-3xl shadow-xl mb-10 text-center backdrop-blur-md"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-extrabold text-indigo-800 mb-2">
            Explore New Job Opportunities
          </h1>
          <p className="text-gray-600 text-sm">
            Browse fresh listings and start your next career move!
          </p>
        </motion.div>

        {/* Filters */}
        <div className="bg-white/90 border border-gray-300 p-6 rounded-2xl shadow-sm mb-10 grid grid-cols-1 md:grid-cols-4 gap-4 backdrop-blur-md">
          <input
            type="text"
            placeholder="🔍 Title or Company"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-full focus:ring-indigo-500 focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="📍 Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-full focus:ring-indigo-500 focus:border-indigo-500"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-full bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-xl px-4 py-2 text-sm w-full bg-white focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Job Listings */}
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium tracking-wide">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            ❌ No jobs found. Try changing filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <motion.div
                key={job._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white/90 border border-gray-200 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => openJobDetail(job._id)}
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-indigo-700 group-hover:underline">
                    {job.title}
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveJob(job._id);
                    }}
                    className="text-indigo-500 hover:text-indigo-700 text-xl"
                    title={
                      savedJobs.includes(job._id) ? "Unsave Job" : "Save Job"
                    }
                  >
                    {savedJobs.includes(job._id) ? (
                      <i class="fa-solid fa-bookmark"></i>
                    ) : (
                      <i class="fa-regular fa-bookmark"></i>
                    )}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mt-1">
                  <span className="font-medium">{job.company}</span> •{" "}
                  {job.location}
                </p>
                <div className="mt-3">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {selectedJob && jobDetail && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden relative"
                initial={{ scale: 0.95, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-2xl font-bold z-10"
                >
                  &times;
                </button>

                <div className="bg-indigo-600 p-6 text-white">
                  <h2 className="text-3xl font-bold">{jobDetail.title}</h2>
                  <p className="text-sm mt-1">
                    <span className="font-medium">{jobDetail.company}</span> •{" "}
                    {jobDetail.location}
                  </p>
                </div>

                <div className="px-6 py-5 space-y-4 text-[15px] text-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-100 rounded-xl px-4 py-2">
                      <strong className="text-gray-800">Type:</strong>{" "}
                      <span className="text-indigo-700 font-medium">
                        {jobDetail.type}
                      </span>
                    </div>
                    <div className="bg-gray-100 rounded-xl px-4 py-2">
                      <strong className="text-gray-800">Salary:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          jobDetail.salary ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {jobDetail.salary ? jobDetail.salary : "No"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      📄 Job Description
                    </h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 overflow-y-auto text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                      {jobDetail.description}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 text-right">
                  <button
                    onClick={() => handleApply(jobDetail._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200"
                  >
                    Apply Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-md w-full p-6 rounded-2xl shadow-2xl text-center space-y-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl font-bold text-indigo-800">
                Complete Your Profile
              </h2>
              <p className="text-gray-700 text-sm">
                Please upload your resume to apply for jobs on SkillBridge.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    navigate("/profile");
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-full text-sm hover:bg-indigo-700"
                >
                  Go to Profile
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    setPendingJobId(null);
                  }}
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AllJobs;
