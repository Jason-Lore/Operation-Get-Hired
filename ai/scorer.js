import dotenv from "dotenv";

dotenv.config();

export async function scoreJob(job, resumeText) {
  const prompt = `
You are a job matching engine.

Compare this resume/profile to this job posting.

Return ONLY valid JSON:
{
  "score": 0,
  "isWorthApplying": true,
  "matchedSkills": [],
  "missingSkills": [],
  "roleCategory": "",
  "why": ""
}

Resume/Profile:
${resumeText}

Job:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location}
Description:
${job.description}
`;

  const response = await fetch(`${process.env.OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL,
      prompt,
      stream: false
    })
  });

  const data = await response.json();

  return JSON.parse(data.response);
}