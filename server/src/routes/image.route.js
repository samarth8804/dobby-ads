import express from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), uploadImage);

export default router;