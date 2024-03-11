import express from "express";
import { createCheckoutSession } from "../controllers/stripeController";

const router = express.Router();

// create-checkout-session
router.post("/create-checkout-session", createCheckoutSession);

export default router;
