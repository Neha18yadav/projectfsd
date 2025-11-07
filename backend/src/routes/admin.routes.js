import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/roleCheck.js";
import User from "../models/user.model.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// List users (Admin only)
router.get("/users", verifyToken, authorizeRoles("Admin"), async (req, res) => {
  const users = await User.find({}, "name email role provider createdAt").sort({ createdAt: -1 });
  res.json(users);
});

// Change role (Admin only)
router.put(
  "/users/:id/role",
  verifyToken,
  authorizeRoles("Admin"),
  body("role").isIn(["Admin", "Editor", "Viewer"]).withMessage("Invalid role"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.role = req.body.role;
    await user.save();
    res.json({ message: "Role updated", user: { id: user._id, role: user.role } });
  }
);

export default router;
