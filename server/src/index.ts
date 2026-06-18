import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRouter);

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});