import express from "express";
import {
  createFolder,
  getFolderContents,
} from "../controllers/folder.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create folder
router.post("/", protect, createFolder);

// Get folder contents
router.get("/", protect, getFolderContents);

export default router;