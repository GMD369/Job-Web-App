import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  getAllUsers,
  deleteUser,
  getAllJobs,
  deleteJobByAdmin,getDashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

router.use(protect, isAdmin); // All routes protected by admin

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getAllJobs);
router.delete("/jobs/:id", deleteJobByAdmin);
router.get("/stats", isAdmin, getDashboardStats);

export default router;
