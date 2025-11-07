import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import User from "../models/user.model.js";

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// 🔐 Google login
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) return res.status(400).json({ message: "Missing credential" });

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    if (!payload) return res.status(401).json({ message: "Invalid Google token" });

    const { email, name, sub } = payload;
    if (!email) return res.status(400).json({ message: "Email not available from Google" });

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name: name || email,
        email,
        password: crypto.randomUUID(),
        role: "Viewer",
        provider: "google",
        googleId: sub,
      });
      await user.save();
    }

    const token = generateToken(user);
    return res.json({
      message: "✅ Google login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("Google Login Error:", err?.message || err);
    return res.status(500).json({ message: "Server error during Google login" });
  }
});

// 👤 Guest login (Viewer role, ephemeral)
router.post("/guest", async (req, res) => {
  try {
    const token = generateToken({ _id: "guest", role: "Viewer" });
    return res.json({
      message: "✅ Guest session started",
      token,
      user: { id: "guest", name: "Guest", role: "Viewer" },
    });
  } catch (err) {
    console.error("Guest Login Error:", err?.message || err);
    return res.status(500).json({ message: "Server error during guest login" });
  }
});

// ✅ REGISTER (No email verification)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = new User({
      name,
      email,
      password,
      role: role || "Viewer",
    });

    await user.save();

    const token = generateToken(user);

    res.status(201).json({
      message: "✅ Registered successfully.",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// ✅ LOGIN (No verification check)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      message: "✅ Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

export default router;
