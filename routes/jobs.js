import express from 'express';
import { connectDB } from '../db/mongo.js';
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/", async (req, res) => {
    const db = await connectDB();

    const jobs = await db
        .collection("jobs")
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();

    res.json(jobs);
})

router.post("/", async (req, res) => {
    const db = await connectDB();

    const job = {
        source: req.body.source,
        externalId: req.body.externalId,
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        url: req.body.url,
        description: req.body.description,

        applied: false,
        score: null,

        createdAt: new Date()
    };

    const result = await db.collection("jobs").updateOne(
        {
            source: job.source,
            externalId: job.externalId
        },
        {
            $setOnInsert: job
        },
        {
            upsert: true
        }
    );

    res.json({
        inserted: result.upsertedCount === 1,
    });
});

router.get("/search", async (req, res) => {
  const db = await connectDB();

  const q = req.query.q || "";
  const company = req.query.company;
  const location = req.query.location;

  const filter = {};

  if (q) {
    filter.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
      { department: { $regex: q, $options: "i" } }
    ];
  }

  if (company) {
    filter.company = { $regex: company, $options: "i" };
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  const jobs = await db
    .collection("jobs")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  res.json({
    count: jobs.length,
    jobs
  });
});

router.get("/matches", async (req, res) => {
  const db = await connectDB();

  const keywords = [
    "network",
    "noc",
    "infrastructure",
    "linux",
    "automation",
    "python",
    "node",
    "devops",
    "datacenter",
    "data center",
    "cisco",
    "fiber"
  ];

  const filter = {
    $or: keywords.flatMap((keyword) => [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { department: { $regex: keyword, $options: "i" } }
    ])
  };

  const jobs = await db
    .collection("jobs")
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  res.json({
    count: jobs.length,
    jobs
  });
});

router.get("/top", async (req, res) => {
  const db = await connectDB();

  const limit = Number(req.query.limit) || 25;

  const jobs = await db
    .collection("jobs")
    .find({ score: { $ne: null } })
    .sort({ score: -1 })
    .limit(limit)
    .toArray();

  res.json({
    count: jobs.length,
    jobs
  });
});

router.post("/:id/apply", async (req, res) => {
  const db = await connectDB();

  await db.collection("jobs").updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        applyStatus: "queued",
        applyQueuedAt: new Date()
      }
    }
  );

  res.json({ success: true, message: "Application queued" });
});

router.get("/:id", async (req, res) => {
  const db = await connectDB();

  const job = await db.collection("jobs").findOne({
    _id: new ObjectId(req.params.id)
  });

  res.json(job);
});

export default router;