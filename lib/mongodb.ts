import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? process.env.BETTER_AUTH_DB;

/**
 * The client lives on `globalThis` so Next.js dev-mode hot reloads reuse one
 * connection instead of opening a new pool on every edit.
 */
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

function getClient(): MongoClient {
  if (!globalForMongo.mongoClient) {
    if (!uri) {
      throw new Error(
        "Missing MongoDB connection string: set MONGODB_URI (or BETTER_AUTH_DB).",
      );
    }
    globalForMongo.mongoClient = new MongoClient(uri);
  }
  return globalForMongo.mongoClient;
}

/** Application database handle for server actions and route handlers. */
export function getDb(): Db {
  return getClient().db("job-website");
}
