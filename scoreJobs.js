import fs from "fs/promises";
import { connectDB } from "./db/mongo.js";
import { scoreJob } from "./ai/scorer.js";

const resumeText = await fs.readFile(
  "./data/masterProfile.txt",
  "utf8"
);

const db = await connectDB();

const jobs = await db.collection("jobs")
.find({
  score: null
})
// .limit(25)
.toArray();

console.log(`Scoring ${jobs.length} jobs...`);

for (const job of jobs) {
  try {
    console.log(`Scoring: ${job.title} @ ${job.company}`);

    const result = await scoreJob(job, resumeText);

    await db.collection("jobs").updateOne(
      { _id: job._id },
      {
        $set: {
          score: result.score,
          ai: result,
          scoredAt: new Date()
        }
      }
    );

    console.log(`Score: ${result.score}`);
  } catch (error) {
    console.error(`Failed scoring ${job.title}`);
    console.error(error.message);
  }
}

console.log("Done scoring jobs");
process.exit(0);