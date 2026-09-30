import { Router } from "express";
import { processPayment } from "../controllers/snailPay.controller.js";

const router = Router();

router.post("/charge", processPayment);

export default router;