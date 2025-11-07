import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";

import authRoutes from "./src/routes/auth.routes.js";
import protectedRoutes from "./src/routes/protected.routes.js";
import postRoutes from "./src/routes/post.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";

// Load .env from this directory regardless of CWD
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
// Request ID for correlation
app.use((req, res, next) => {
  const id = req.headers["x-request-id"] || uuidv4();
  res.locals.requestId = id;
  res.setHeader("x-request-id", id);
  next();
});

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic rate limit (per IP)
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// ✅ Healthcheck & root
app.get(["/", "/health"], (req, res) => {
  res.status(200).json({ ok: true, service: "backend", mongo: !!mongoose.connection.readyState });
});

// 🔗 Routes
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
