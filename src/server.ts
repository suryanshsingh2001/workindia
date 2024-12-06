import dotenv from "dotenv";
import app from "./app";
import { checkDatabaseConnection } from "./utils/db";
dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await checkDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
