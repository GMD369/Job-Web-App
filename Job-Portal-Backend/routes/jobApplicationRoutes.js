import express from "express";
import { applyToJob, getMyApplications,getJobApplicants } from "../controllers/jobApplicationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/myApplications", protect, getMyApplications);

router.post("/apply/:jobId", protect, applyToJob);

router.get("/:jobId/applicants", protect, getJobApplicants);


export default router;
