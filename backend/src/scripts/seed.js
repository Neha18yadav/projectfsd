import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const users = [
  { name: "Alice Admin", email: "admin@example.com", password: "admin1234", role: "Admin" },
  { name: "Eddie Editor", email: "editor@example.com", password: "editor1234", role: "Editor" },
  { name: "Vicky Viewer", email: "viewer@example.com", password: "viewer1234", role: "Viewer" },
];

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    for (const u of users) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const hashed = await bcrypt.hash(u.password, 10);
        user = await User.create({ ...u, password: hashed, provider: "local" });
        console.log(`Seeded: ${u.email} (${u.role})`);
      } else {
        console.log(`Exists: ${u.email}`);
      }
    }
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
