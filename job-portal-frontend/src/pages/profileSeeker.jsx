import { useEffect, useState } from "react";
import api from "../api";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/profile/me");
        setUser(data);
        setFormData(data);
      } catch (err) {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const profileFields = ["bio", "skills", "education", "profilePic", "resume"];

  const filledFields = profileFields.filter((field) => {
    const value = user?.[field];
    return Array.isArray(value) ? value.length > 0 : !!value;
  });

  const completionPercent = Math.round(
    (filledFields.length / profileFields.length) * 100
  );

  const profilePicURL = user?.profilePic
    ? user.profilePic
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || "User"
      )}`;

  const handleChangePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("profilePic", file);
    const res = await api.put("/profile/me", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setUser(res.data.user);
    setFormData(res.data.user);
  };

  const handleRemovePhoto = async () => {
    const data = new FormData();
    data.append("removeProfilePic", true);
    const res = await api.put("/profile/me", data);
    setUser(res.data.user);
    setFormData(res.data.user);
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("resume", file);
    const res = await api.put("/profile/me", data);
    setUser(res.data.user);
  };

  const handleRemoveResume = async () => {
    const data = new FormData();
    data.append("removeResume", true);
    const res = await api.put("/profile/me", data);
    setUser(res.data.user);
  };

  const handleEditProfile = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== user[key]) {
        data.append(key, formData[key]);
      }
    });
    const res = await api.put("/profile/me", data);
    setUser(res.data.user);
    setShowEditModal(false);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-slate-600 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium tracking-wide">Loading Profile...</p>
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load profile.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-indigo-700">My Profile</h1>
          <span className="text-sm text-gray-500">
            Completion: {completionPercent}%
          </span>
        </div>

        <div className="flex items-center gap-8 mb-10">
          <div className="relative">
            <a href={profilePicURL} target="_blank" rel="noopener noreferrer">
              <img
                src={profilePicURL}
                alt="Profile"
                className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500 shadow-md hover:opacity-90 cursor-pointer"
              />
            </a>

            {user.profilePic ? (
              <div className="absolute -bottom-3 left-0 flex gap-2 text-xs">
                <input
                  type="file"
                  hidden
                  id="uploadPhoto"
                  onChange={handleChangePhoto}
                />
                <button
                  onClick={() => document.getElementById("uploadPhoto").click()}
                  className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full hover:bg-indigo-200 shadow"
                >
                  Change
                </button>
                <button
                  onClick={handleRemovePhoto}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 shadow"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <input
                  type="file"
                  hidden
                  id="uploadPhoto"
                  onChange={handleChangePhoto}
                />
                <button
                  onClick={() => document.getElementById("uploadPhoto").click()}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 shadow"
                >
                  Upload Photo
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0-1.104.896-2 2-2h6M12 11c0-1.104-.896-2-2-2H4m8 0V7m0 4v4m0 0c0 1.104.896 2 2 2h6m-8-2c0 1.104-.896 2-2 2H4"
              />
            </svg>
            Resume & Documents
          </h3>

          {user.resume ? (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
              <a
                href={user.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white text-sm rounded-full hover:bg-emerald-700 transition duration-200 shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m2-4h.01M12 20.5a8.38 8.38 0 01-6.364-2.636A8.38 8.38 0 013 12.5a8.38 8.38 0 012.636-6.364A8.38 8.38 0 0112 3.5a8.38 8.38 0 016.364 2.636A8.38 8.38 0 0121 12.5a8.38 8.38 0 01-2.636 6.364A8.38 8.38 0 0112 20.5z"
                  />
                </svg>
                View Resume
              </a>

              <div className="flex flex-wrap gap-3">
                <input
                  type="file"
                  hidden
                  id="uploadResume"
                  onChange={handleResumeUpload}
                />
                <button
                  onClick={() =>
                    document.getElementById("uploadResume").click()
                  }
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l8 8 8-8M12 4v12"
                    />
                  </svg>
                  Replace
                </button>

                <button
                  onClick={handleRemoveResume}
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">No resume uploaded.</p>
              <input
                type="file"
                hidden
                id="uploadResume"
                onChange={handleResumeUpload}
              />
              <button
                onClick={() => document.getElementById("uploadResume").click()}
                className="inline-flex items-center gap-2 text-sm px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200 shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l8 8 8-8M12 4v12"
                  />
                </svg>
                Upload Resume
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
          <ProfileField label="Name" value={user.name} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Role" value={user.role} />
          <ProfileField label="Bio" value={user.bio} />
          <ProfileField label="Skills" value={user.skills?.join(", ")} />
          <ProfileField label="Education" value={user.education} />
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full shadow hover:bg-indigo-700"
        >
          Edit Profile
        </button>

        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-xl w-full">
              <h2 className="text-xl font-bold text-indigo-700 mb-4">
                Edit Profile
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {["name", "bio", "education", "skills"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    value={formData[field] || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                ))}
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditProfile}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="bg-indigo-50 p-3 rounded-xl shadow-sm">
    <span className="font-semibold text-indigo-700">{label}:</span>{" "}
    <span className="text-gray-700">
      {value || <span className="italic text-gray-400">Not provided</span>}
    </span>
  </div>
);

export default Profile;
