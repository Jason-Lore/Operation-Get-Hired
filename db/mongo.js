import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

export async function connectDB() {
  if (db) return db;

  await client.connect();
  db = client.db(process.env.DB_NAME);

  await db.collection("jobs").createIndex(
    { source: 1, externalId: 1 },
    { unique: true }
  );

  console.log("Connected to MongoDB");
  return db;
}