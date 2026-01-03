import express from "express";
import { generateOrderPDF } from "../controllers/orderController.js";

const router = express.Router();

router.get("/generate/:id", generateOrderPDF);

export default router;
