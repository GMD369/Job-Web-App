import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api";
import { toast } from "react-toastify";

const SavedJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetail, setJobDetail] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const { data } = await api.get("/user/saved-jobs", {
          params: { page, limit: 5 },
        });

        setJobs(data.jobs);
        setTotalPages(data.totalPages);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      setLoading(true);
    }
  };

  const openJobDetail = async (jobId) => {
    try {
      const { data } = await api.get(`/jobs/${jobId}`);
      setJobDetail(data);
      setSelectedJob(true);
    } catch (err) {
      toast.error("Failed to load job detail");
    }
  };

  const closeModal = () => {
    setSelectedJob(null);
    setJobDetail(null);
  };

  const handleApplyJob = async (jobId) => {
    const confirmApply = window.confirm("Are you sure you want to apply for this job?");
    if (!confirmApply) return;

    try {
      const { data } = await api.post(`/jobs/apply/${jobId}`);
      toast.success(data.message || "Successfully applied!");
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-100 to-indigo-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-semibold mb-10 text-center text-indigo-800">
          Saved Jobs List
        </h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            You haven’t saved any jobs yet.
          </p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => openJobDetail(job._id)}
                className="bg-white p-5 rounded-xl shadow border border-gray-200 cursor-pointer hover:shadow-md transition"
              >
                <h3 className="text-xl font-semibold text-indigo-700">
                  {job.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {job.company} • {job.location}
                </p>
                <div className="mt-2">
                  <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className={`px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow transition-all duration-200 ${
                  page === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                ← Previous
              </button>
              <span className="text-gray-600 text-sm">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 shadow transition-all duration-200 ${
                  page === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Popup Modal for Job Detail */}
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
                    <span className="font-medium">{jobDetail.company}</span> • {jobDetail.location}
                  </p>
                </div>

                <div className="px-6 py-5 space-y-4 text-[15px] text-gray-700">
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-100 rounded-xl px-4 py-2">
                      <strong className="text-gray-800">Type:</strong>{" "}
                      <span className="text-indigo-700 font-medium">{jobDetail.type}</span>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">📄 Job Description</h3>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 h-48 overflow-y-auto text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                      {jobDetail.description}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 text-right">
                  <button
                    onClick={() => handleApplyJob(jobDetail._id)}
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
    </div>
  );
};

export default SavedJobs;
