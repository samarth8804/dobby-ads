import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import folderRoutes from "./routes/folder.route.js";
import imageRoutes from "./routes/image.route.js";
import apiKeyRoutes from "./routes/apiKey.route.js";
import { registerHostedMcpRoutes } from "./mcp/hosted/routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-API-Key",
      "MCP-Session-Id",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/keys", apiKeyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/folder", folderRoutes);
app.use("/api/image", imageRoutes);
app.use("/mcp", express.json({ limit: "15mb" }));

registerHostedMcpRoutes(app);

export default app;
