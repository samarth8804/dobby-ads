import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  createApiKey,
  getApiKeys,
  revokeApiKey,
} from "../controllers/apiKey.controller.js";

const router = express.Router();

router.get("/", protect, getApiKeys);
router.post("/", protect, createApiKey);
router.delete("/:id", protect, revokeApiKey);

export default router;
