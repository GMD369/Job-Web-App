import { useEffect, useState } from "react";
import api from "../../api.js";
import { useAuth } from "../../context/authContext.jsx";
import { motion } from "framer-motion";

const Home = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showApplicantModal, setShowApplicantModal] = useState(false);
  const [applicantDetail, setApplicantDetail] = useState(null);
  // At the top inside Home component
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  // Derived filtered jobs list
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get(`/jobs/user`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicantDetail = async (id) => {
    try {
      const { data } = await api.get(`/profile/${id}`);
      setApplicantDetail(data.data);
      setShowApplicantModal(true);
    } catch (error) {
      console.error("Failed to fetch applicant detail", error);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchJobs();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="w-full bg-gradient-to-r from-[#0f172a] to-[#38bdf8] py-2 overflow-hidden relative rounded-md mb-6">
          <div className="animate-marquee whitespace-nowrap text-white text-sm font-medium px-4">
            <span className="mx-6">🚀 Post Jobs Instantly</span>
            <span className="mx-6">
              📊 Track Applicants with Real-Time Insights
            </span>
            <span className="mx-6">✅ Review Profiles & Resumes Easily</span>
            <span className="mx-6">🛡️ 100% Secure Hiring Platform</span>
            <span className="mx-6">💼 Build Your Dream Team Efficiently</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-6xl mx-auto"
          >
            <h1 className="text-4xl font-bold text-slate-800 mb-4">
              Welcome, <span className="text-indigo-600">{user?.name}</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10">
              Here’s an overview of your posted jobs and applicants.
            </p>
          </motion.div>

          {/* 🔍 Search Bar */}
          <div className="mb-8 max-w-xl mx-auto">
            <div className="relative text-gray-600">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search jobs by title..."
                className="w-full py-3 pl-12 pr-4 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition duration-200"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Display Jobs */}
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg font-medium tracking-wide">
                Loading jobs...
              </p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-slate-500 text-center italic">
              No matching jobs found.
            </div>
          ) : (
            <>
              <div className="grid gap-8">
                {currentJobs.map((job) => (
                  <div
                    key={job._id}
                    onClick={() => {
                      setSelectedJob(job);
                      setShowModal(true);
                    }}
                    className="cursor-pointer bg-white shadow-md hover:shadow-lg transition p-6 rounded-2xl border border-slate-200"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-indigo-700">
                        {job.title}
                      </h2>
                      <p className="text-slate-600">
                        {job.company} • {job.location} •{" "}
                        <span className="uppercase text-sm bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                          {job.type}
                        </span>
                      </p>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-slate-700 mb-2">
                        👥 Applicants ({job.applicants?.length || 0})
                      </h3>
                      {job.applicants?.length > 0 ? (
                        <ul className="divide-y divide-slate-200">
                          {job.applicants.map((applicant, i) => (
                            <li key={i} className="py-3">
                              <p className="font-medium text-slate-800">
                                {applicant.name}
                              </p>
                              <p className="text-sm text-slate-500">
                                {applicant.email}
                              </p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm italic text-slate-500">
                          No applicants yet.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-6 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>
            </>
          )}
        </div>

        {/* 🔍 Modal for Job Details & Applicants */}
        {showModal && selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-fade-in">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b bg-indigo-50">
                <div>
                  <h2 className="text-2xl font-bold text-indigo-700">
                    {selectedJob.title}
                  </h2>
                  <p className="text-sm text-gray-600">{selectedJob.company}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setShowModal(false);
                  }}
                  className="text-gray-400 hover:text-red-500 text-3xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-sm text-slate-700 max-h-[80vh] overflow-y-auto">
                <p>
                  <strong className="text-slate-800">Location:</strong>{" "}
                  {selectedJob.location}
                </p>
                <p>
                  <strong className="text-slate-800">Type:</strong>{" "}
                  {selectedJob.type}
                </p>
                <p>
                  <strong className="text-slate-800">Salary:</strong>{" "}
                  {selectedJob.salary || "N/A"}
                </p>
                <p>
                  <strong className="text-slate-800">Description:</strong>{" "}
                  {selectedJob.description}
                </p>

                <div>
                  <h3 className="font-semibold text-lg text-indigo-700 mb-3">
                    👥 Applicants ({selectedJob.applicants.length})
                  </h3>
                  {selectedJob.applicants.length === 0 ? (
                    <p className="italic text-gray-500">No applicants yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {selectedJob.applicants.map((applicant, index) => (
                        <li
                          key={index}
                          className="p-4 border rounded-lg bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
                          onClick={() =>
                            fetchApplicantDetail(applicant.user._id)
                          }
                        >
                          <div>
                            <p className="font-medium text-gray-900">
                              {applicant.user?.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {applicant.user?.email}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Applicant Detail */}
        {showApplicantModal && applicantDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-fade-in space-y-6">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-3 rounded-t-xl -mt-6 -mx-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  👤 Applicant Details
                </h2>
                <button
                  onClick={() => {
                    setShowApplicantModal(false);
                    setApplicantDetail(null);
                  }}
                  className="text-white text-2xl hover:text-red-300"
                >
                  &times;
                </button>
              </div>

              {/* Body */}
              <div className="text-slate-700 text-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Name</p>
                    <p className="text-base font-medium">
                      {applicantDetail.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Email
                    </p>
                    <p className="text-base font-medium">
                      {applicantDetail.email}
                    </p>
                  </div>
                  {applicantDetail.location && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Location
                      </p>
                      <p className="text-base font-medium">
                        {applicantDetail.location}
                      </p>
                    </div>
                  )}
                  {applicantDetail.education && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Education
                      </p>
                      <p className="text-base font-medium">
                        {applicantDetail.education}
                      </p>
                    </div>
                  )}
                  {applicantDetail.companyName && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        Company
                      </p>
                      <p className="text-base font-medium">
                        {applicantDetail.companyName}
                      </p>
                    </div>
                  )}
                  {applicantDetail.website && (
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-500">
                        Website
                      </p>
                      <a
                        href={applicantDetail.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:underline"
                      >
                        {applicantDetail.website}
                      </a>
                    </div>
                  )}
                </div>

                {applicantDetail.bio && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Bio</p>
                    <p className="text-sm">{applicantDetail.bio}</p>
                  </div>
                )}

                {applicantDetail.skills?.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {applicantDetail.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {applicantDetail.resume && (
                  <div className="flex gap-4 mt-4">
                    <a
                      href={applicantDetail.resume}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                    >
                      Preview Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
