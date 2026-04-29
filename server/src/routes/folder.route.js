import express from "express";
import {
  createFolder,
  deleteFolder,
  getFolderData,
} from "../controllers/folder.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Create folder
router.post("/", protect, createFolder);

// Get folder data
router.get("/", protect, getFolderData);

// Delete folder
router.delete("/:id", protect, deleteFolder);

export default router;
