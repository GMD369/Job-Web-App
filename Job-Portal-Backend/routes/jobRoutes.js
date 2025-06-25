import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  getJobsByUserId,
  updateJob,
  getJobsByUser
} from "../controllers/jobController.js";
import { protect } from "../middleware/authMiddleware.js";
import { onlyEmployer } from "../middleware/roleMiddleware.js";
import { applyToJob, getMyApplications,getJobApplicants } from "../controllers/jobApplicationController.js";

const router = express.Router();

router.get("/myApplications", protect, getMyApplications);

router.post("/apply/:jobId", protect, applyToJob);

router.get("/:jobId/applicants", protect, getJobApplicants);

// Public Routes
router.get("/", getAllJobs);    // Get all jobs (with search, filter, sort)

// Protected Routes (Employer Only)
router.get("/user", protect, onlyEmployer, getJobsByUser);       //Authenticated user's jobs (used by Employer Dashboard)
router.get("/user/:id", protect, onlyEmployer, getJobsByUserId);

router.get("/:id", getJobById); // Get jobs posted by a specific user (admin maybe?)

router.post("/", protect, onlyEmployer, createJob);              // Create new job
router.delete("/:id", protect, onlyEmployer, deleteJob);         // Delete job by ID
router.put("/:id", protect, onlyEmployer, updateJob);       // Update job by ID

export default router;
