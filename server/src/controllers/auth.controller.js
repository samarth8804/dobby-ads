import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import Folder from "../models/Folder.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.utils.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    await Folder.create({
      name: "root",
      parentId: null,
      userId: user._id,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      accessToken,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Refresh Token
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({
      message: "No refresh token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const newAccessToken = generateAccessToken(decoded.id);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({
      message: "Invalid refresh token",
    });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// me
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("_id username email");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
