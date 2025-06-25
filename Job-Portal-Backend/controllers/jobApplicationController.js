import Job from "../models/Job.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";

// ✅ Apply to a Job
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user.id;

    const job = await Job.findById(jobId).populate("createdBy");
    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check if already applied
    const alreadyApplied = job.applicants.find(app => app.user.toString() === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }

    // Add applicant
    job.applicants.push({ user: userId });
    await job.save();

    // Get applicant info
    const applicant = await User.findById(userId);
    const employer = job.createdBy;

    // ✅ Send email to Applicant
    await sendEmail({
      to: applicant.email,
      subject: "✅ Application Submitted",
      html: `
        <h2>Hi ${applicant.name},</h2>
        <p>You have successfully applied to the job <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
        <p>We wish you the best of luck!</p>
        <br/>
        <p>— SkillBridge Team</p>
      `,
    });

    // ✅ Send email to Employer
    if (employer?.email) {
      await sendEmail({
        to: employer.email,
        subject: "📥 New Job Application Received",
        html: `
          <h2>Hello ${employer.name},</h2>
          <p>You have received a new application for your job post: <strong>${job.title}</strong>.</p>
          <p><strong>Applicant Name:</strong> ${applicant.name}</p>
          <p><strong>Email:</strong> ${applicant.email}</p>
          <br/>
          <p>— SkillBridge Notifications</p>
        `,
      });
    }

    res.status(200).json({ message: "Job application submitted successfully" });

  } catch (err) {
    console.error("Apply to job error:", err.message);
    res.status(500).json({ message: "Application failed", error: err.message });
  }
};


export const getMyApplications = async (req, res) => {
  try {
    const { Types } = mongoose;
    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    const userId =new Types.ObjectId(req.user.id);
    const jobs = await Job.find({ "applicants.user": userId })
      .select("title company location type createdAt")
      .lean();

    res.status(200).json(jobs);
  } catch (err) {
    console.error("getMyApplications error:", err);
    res.status(500).json({ message: "Failed to retrieve applications", error: err.message });
  }
};


// ✅ View Applicants for a Job (Employer Only)
export const getJobApplicants = async (req, res) => {


  try {
    const jobId = req.params.jobId;
    const employerId = req.user.id;

    const job = await Job.findById(jobId)
      .populate("applicants.user", "name email") // show applicant name/email
      .lean();

    if (!job) return res.status(404).json({ message: "Job not found" });

    // Check ownership
    if (job.createdBy.toString() !== employerId) {
      return res.status(403).json({ message: "Access denied. Not your job." });
    }

    res.status(200).json({
      jobTitle: job.title,
      totalApplicants: job.applicants.length,
      applicants: job.applicants
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
};

