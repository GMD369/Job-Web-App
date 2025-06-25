import { useEffect, useState } from "react";
import api from "../../api";
import { useAuth } from "../../context/authContext";
import { Link } from "react-router-dom";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get(`/jobs/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch employer jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteJob = async () => {
    try {
      await api.delete(`/jobs/${jobToDelete}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs((prev) => prev.filter((job) => job._id !== jobToDelete));
      setShowConfirm(false);
      setJobToDelete(null);
    } catch (err) {
      alert("Failed to delete job");
      console.error("Failed to delete job", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchJobs();
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              <i className="fa-solid fa-circle-check"></i> Your Job Listings
            </h1>
            <p className="text-slate-600 mt-1">
              View, edit, and manage your posted jobs here.
            </p>
          </div>
          <Link
            to="/employer/post-job"
            className="mt-4 sm:mt-0 inline-block bg-indigo-800 hover:bg-indigo-700 text-white px-5 py-4 rounded-lg text-sm font-extralight shadow"
          >
            ➕ Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg font-medium tracking-wide">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-slate-500 italic">
            No jobs posted yet.
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-indigo-700">
                      {job.title}
                    </h2>
                    <p className="text-slate-600 text-sm">
                      {job.company} • {job.location}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      {job.type}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Link
                      to={`/employer/edit-job/${job._id}`}
                      className="px-4 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      <i className="fa-solid fa-pen"></i> Edit
                    </Link>
                    <button
                      onClick={() => {
                        setJobToDelete(job._id);
                        setShowConfirm(true);
                      }}
                      className="px-4 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      <i className="fa-solid fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔒 Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center space-y-4">
            <h3 className="text-xl font-bold text-red-600">
              Confirm Deletion
            </h3>
            <p className="text-gray-600">
              Are you sure you want to delete this job? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setJobToDelete(null);
                }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
