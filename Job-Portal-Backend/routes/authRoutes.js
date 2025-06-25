import express from "express";
import { register, login,updateRole } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/update-role",updateRole,)


export default router;