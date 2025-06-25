import { useEffect, useState } from "react";
import api from "../../api.js";
import { useAuth } from "../../context/authContext.jsx";
import { BriefcaseIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loadingApplied, setLoadingApplied] = useState(true);
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await api.get("/jobs/myApplications");
        setAppliedJobs(res.data || []);
      } catch (err) {
        console.error("Failed to load applied jobs", err.message);
      } finally {
        setLoadingApplied(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/user/saved-jobs");
        setSavedJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Failed to load saved jobs", err.message);
      } finally {
        setLoadingSaved(false);
      }
    };
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err.message);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  if (loadingApplied || loadingSaved || loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium tracking-wide">
          Loading Your Dashboard...
        </p>
      </div>
    );
  }

  //  Correct profile picture logic
  const profilePicURL = profile?.profilePic
    ? profile.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        profile?.name || "User"
      )}&color=4f46e5&background=ffffff`;
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-emerald-100 py-10 px-6 sm:px-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">
            Welcome back,{" "}
            <span className="text-green-600">{profile?.name || "User"}</span>
          </h1>
          <p className="text-sm text-gray-600">
            Here's your current job search activity and profile summary.
          </p>
        </div>
        <div className="flex flex-col items-center mt-6 sm:mt-0">
          <img
            src={profilePicURL}
            alt={`${profile?.name || "User"}'s profile picture`}
            onError={(e) => {
              e.target.onerror = null; // prevent infinite loop
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                profile?.name || "User"
              )}&color=4f46e5&background=ffffff`;
            }}
            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-indigo-500 shadow-lg transition-transform duration-200 hover:scale-105"
          />

          <button
            onClick={() => navigate("/profile")}
            className="mt-3 text-indigo-600 text-sm font-medium hover:underline"
          >
            View Profile
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <div className="bg-white border border-indigo-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <BriefcaseIcon className="w-10 h-10 text-indigo-600" />
            <div>
              <p className="text-sm text-gray-500">Applied Jobs</p>
              <h2 className="text-3xl font-bold text-indigo-700">
                {appliedJobs.length}
              </h2>
            </div>
          </div>
        </div>
        <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <BookmarkIcon className="w-10 h-10 text-emerald-600" />
            <div>
              <p className="text-sm text-gray-500">Saved Jobs</p>
              <h2 className="text-3xl font-bold text-emerald-700">
                {savedJobs.length}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Job Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Applied Jobs */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">
            📩 Jobs You Applied For
          </h3>
          {appliedJobs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You haven’t applied to any jobs yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {appliedJobs.map((job) => (
                <li
                  key={job._id}
                  className="border p-4 rounded-xl hover:bg-indigo-50 transition"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                  <span className="inline-block mt-2 text-xs font-medium bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Saved Jobs */}
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
          <h3 className="text-xl font-semibold text-emerald-700 mb-4">
            Saved Job Posts
          </h3>
          {savedJobs.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You haven’t saved any jobs yet.
            </p>
          ) : (
            <ul className="space-y-4">
              {savedJobs.map((job) => (
                <li
                  key={job._id}
                  className="border p-4 rounded-xl hover:bg-emerald-50 transition"
                >
                  <h4 className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {job.company} • {job.location}
                  </p>
                  <span className="inline-block mt-2 text-xs font-medium bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                    {job.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
