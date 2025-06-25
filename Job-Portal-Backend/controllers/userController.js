import User from "../models/User.js";
import Job from "../models/Job.js";

// ⭐ Save or Unsave a Job
export const toggleSaveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const jobId = req.params.jobId;

    const index = user.savedJobs.indexOf(jobId);
    if (index === -1) {
      user.savedJobs.push(jobId);
      await user.save();
      console.log(jobId)
      res.status(200).json({ message: "Job saved" });
    } else {
      user.savedJobs.splice(index, 1); // remove
      await user.save();
      res.status(200).json({ message: "Job removed from saved list" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle saved job", error: err.message });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Step 1: Get user with populated savedJobs
    const user = await User.findById(req.user.id).populate("savedJobs");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalSaved = user.savedJobs.length;

    // Step 2: Get paginated slice from populated jobs
    const paginatedJobs = user.savedJobs.slice(skip, skip + limit);

    res.status(200).json({
      total: totalSaved,
      page,
      limit,
      totalPages: Math.ceil(totalSaved / limit),
      jobs: paginatedJobs,
    });
  } catch (err) {
    console.error("❌ Error in getSavedJobs:", err);
    res.status(500).json({ message: "Failed to get saved jobs", error: err.message });
  }
};
