import Job from "../models/Job.js";
import {sendEmail} from "../utils/sendEmail.js"
import User from "../models/User.js";
// Create Job
export const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      salary,
      createdBy: req.user.id,
    });

    const employer = await User.findById(req.user.id);

    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    await sendEmail({
      to: employer.email, // ← Make sure this is not undefined
      subject: "🎉 Job Created Successfully",
      html: `
        <h2>Hi ${employer.name},</h2>
        <p>Your job titled <strong>${title}</strong> has been posted successfully on SkillBridge.</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Description:</strong> ${description}</p>
        <br/>
        <p>Thank you for using SkillBridge!</p>
      `,
    });

    res.status(201).json(job);
  } catch (err) {
    console.error("Job creation failed:", err.message);
    res.status(500).json({ message: "Job creation failed", error: err.message });
  }
};

// Get All Jobs (with search, filter, sort)
export const getAllJobs = async (req, res) => {
  try {
    const { keyword, location, type, sort } = req.query;

    // Build dynamic query object
    const query = {};

    if (keyword) {
      const regex = new RegExp(keyword, "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { company: regex }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    // Sorting logic
    let sortOption = { createdAt: -1 }; // default: newest
    if (sort === "oldest") sortOption = { createdAt: 1 };

    const jobs = await Job.find(query).sort(sortOption);
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

// Get Single Job
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ message: "Error fetching job", error: err.message });
  }
};

export const getJobsByUserId = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.params.userId }).populate("applicants", "name email resume");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error getting jobs", error: err.message });
  }
};

// Delete Job (only creator/employer)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    console.log("Job createdBy:", job.createdBy.toString());
    console.log("Request user:", req.user.id);

    if (job.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized to delete this job" });

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ message: "Error deleting job", error: err.message });
  }
};


export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized to update this job" });

    const allowedFields = ["title", "company", "location", "type", "description", "salary"];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        job[field] = req.body[field];
      }
    });

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ message: "Error updating job", error: err.message });
  }
};

//  getJobsByUser
export const getJobsByUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await Job.find({ createdBy: req.user.id })
      .populate("applicants.user", "name email resume"); // 👈 populate user details

    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};


