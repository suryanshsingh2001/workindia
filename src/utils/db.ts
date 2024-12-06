import { Client } from "pg";

export const checkDatabaseConnection = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Database connection is healthy");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  } finally {
    await client.end();
  }
};
