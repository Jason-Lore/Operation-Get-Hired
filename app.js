import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import jobsRouter from "./routes/jobs.js";
import { connectDB } from "./db/mongo.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/jobs", jobsRouter);

app.get("/", (req, res) => {
  res.send("Operation Get Hired API Running");
});

const port = process.env.PORT || 3005;

await connectDB();

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});