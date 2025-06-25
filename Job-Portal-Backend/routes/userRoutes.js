import express from "express";
import { toggleSaveJob, getSavedJobs } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { onlySeeker } from "../middleware/roleMiddleware.js";

const router = express.Router();
// save/unsave
router.get("/saved-jobs", protect, getSavedJobs);  

router.post("/save-job/:jobId", protect,onlySeeker, toggleSaveJob);       // view saved jobs

export default router;
