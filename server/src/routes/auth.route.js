import express from "express";
import {
  signup,
  login,
  refreshToken,
  logout,
  me,
} from "../controllers/auth.controller.js";
import {
  signupValidator,
  loginValidator,
} from "../validators/auth.validators.js";
import { protect } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.post("/refresh", refreshToken);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

export default router;
