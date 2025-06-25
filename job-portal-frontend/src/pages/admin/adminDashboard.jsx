import { useEffect, useState } from "react";
import api from "../../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsRes = await api.get("/admin/stats");
        const usersRes = await api.get("/admin/users");
        const jobsRes = await api.get("/admin/jobs");

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setJobs(jobsRes.data);
      } catch (err) {
        toast.error("Failed to fetch admin data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const handleDeleteJob = async (id) => {
    if (!window.confirm("Are you sure to delete this job?")) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
      toast.success("Job deleted");
    } catch (err) {
      toast.error("Failed to delete job");
    }
  };

  if (loading)
    return (
  <div className="flex flex-col items-center justify-center min-h-[200px] text-center text-gray-600 space-y-3">
    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-lg font-medium tracking-wide">Loading Admin Dashboard...</p>
  </div>
);


  return (
    <div className="p-6 space-y-10 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      <motion.h1
        className="text-4xl font-extrabold text-indigo-700 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🛡️ Admin Dashboard
      </motion.h1>

      {/* 📊 Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Total Users", value: stats.totalUsers },
          { label: "Seekers", value: stats.seekers },
          { label: "Employers", value: stats.employers },
          { label: "Admins", value: stats.admins },
          { label: "Total Jobs", value: stats.totalJobs },
          { label: "New Users This Month", value: stats.newUsersThisMonth },
          { label: "Jobs This Month", value: stats.jobsThisMonth },
          { label: "Applications", value: stats.totalApplications },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="bg-white shadow-xl border border-gray-200 rounded-2xl p-5 text-center hover:shadow-2xl transition duration-300"
            whileHover={{ scale: 1.03 }}
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-2xl font-bold text-indigo-700">{item.value}</p>
          </motion.div>
        ))}
      </div>

      {/* 👥 Users Table */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-xl font-bold mb-4 text-indigo-800">👥 Users</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-indigo-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Role</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-indigo-50">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2 capitalize">{u.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 💼 Jobs Table */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4 text-indigo-800">💼 Jobs</h2>
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-sm">
            <thead>
              <tr className="bg-indigo-100 text-left">
                <th className="p-2">Title</th>
                <th className="p-2">Company</th>
                <th className="p-2">Posted By</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id} className="border-t hover:bg-indigo-50">
                  <td className="p-2">{j.title}</td>
                  <td className="p-2">{j.company}</td>
                  <td className="p-2">{j.createdBy?.email || "N/A"}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteJob(j._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
