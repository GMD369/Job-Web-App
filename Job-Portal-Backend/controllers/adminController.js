import User from "../models/User.js";
import Job from "../models/Job.js";

// Get all users
export const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.status(200).json(users);
};

// Delete user
export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted" });
};

// Get all jobs
export const getAllJobs = async (req, res) => {
  const jobs = await Job.find().populate("createdBy", "name email");
  res.status(200).json(jobs);
};

// Delete job
export const deleteJobByAdmin = async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Job deleted by admin" });
};



export const getDashboardStats = async (req, res) => {
  try {
    // Total Counts
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();

    // Total Applications (based on job.applicants array lengths)
    const allJobs = await Job.find({}, "applicants");
    const totalApplications = allJobs.reduce(
      (sum, job) => sum + job.applicants.length,
      0
    );

    // Date Range for Monthly Stats
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // New Users This Month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonthStart },
    });

    // Jobs Posted This Month
    const jobsThisMonth = await Job.countDocuments({
      createdAt: { $gte: thisMonthStart },
    });

    // Optional: Split user roles
    const seekers = await User.countDocuments({ role: "seeker" });
    const employers = await User.countDocuments({ role: "employer" });
    const admins = await User.countDocuments({ role: "admin" });

    res.status(200).json({
      totalUsers,
      totalJobs,
      totalApplications,
      newUsersThisMonth,
      jobsThisMonth,
      seekers,
      employers,
      admins,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};
