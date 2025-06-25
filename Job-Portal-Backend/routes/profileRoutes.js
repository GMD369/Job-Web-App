import express from "express";
import { updateProfile, getMyProfile,getUserWithProfile} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();


router.get("/me", protect, getMyProfile);
router.put(
  "/me",
  protect,
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateProfile
);
router.get("/:id",protect,getUserWithProfile );

export default router;
