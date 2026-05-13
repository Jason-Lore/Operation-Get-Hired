import { connectDB } from "../db/mongo.js";

export const greenhouseCompanies = [
  "cloudflare",
  "canonical",
  "mongodb",
  "datadog",
  "stripe",
  "vercel"
];

function normalizeJobs(jobs, company) {
  return jobs.map((job) => ({
    source: "greenhouse",
    externalId: String(job.id),
    title: job.title,
    company,
    location: job.location?.name || "Unknown",
    department: job.departments?.[0]?.name || "Unknown",
    url: job.absolute_url,
    description: job.content || "",
    applied: false,
    score: null,
    createdAt: new Date()
  }));
}

async function saveJobs(jobs) {
  const db = await connectDB();
  const collection = db.collection("jobs");

  let inserted = 0;
  let skipped = 0;

  for (const job of jobs) {
    const result = await collection.updateOne(
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

    if (result.upsertedCount === 1) {
      inserted++;
    } else {
      skipped++;
    }
  }

  return { inserted, skipped };
}

export async function crawlGreenhouseCompany(company) {
  const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Greenhouse fetch failed for ${company}: ${response.status}`);
  }

  const data = await response.json();
  const normalizedJobs = normalizeJobs(data.jobs || [], company);
  const result = await saveJobs(normalizedJobs);

  console.log(`${company}: inserted ${result.inserted}, skipped ${result.skipped}`);

  return result;
}

export async function crawlAllGreenhouseCompanies() {
  for (const company of greenhouseCompanies) {
    try {
      await crawlGreenhouseCompany(company);
    } catch (error) {
      console.error(error.message);
    }
  }
}