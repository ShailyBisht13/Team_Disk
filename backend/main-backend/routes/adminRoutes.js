import express from "express";
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";

const router = express.Router();

// CREATE ADMIN
router.post("/register", registerAdmin);

// LOGIN ADMIN
router.post("/login", loginAdmin);

export default router;
