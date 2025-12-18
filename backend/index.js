import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/**
 * CORS: allow
 * - all Vercel deployments (*.vercel.app)
 * - localhost for dev
 */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or tools like Postman
      if (!origin) return callback(null, true);

      // Allow localhost
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // Allow any Vercel deployment
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // Block everything else
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api", router);

// Root
app.get("/", (req, res) => {
  res.json({ message: "Backend API running 🚀" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
