import dotenv from 'dotenv';
import { Client } from 'pg';
import app from './app';

dotenv.config();

const PORT = process.env.PORT || 3000;

const checkDatabaseConnection = async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log('Database connection is healthy');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit the process with failure
    } finally {
        await client.end();
    }
};

const startServer = async () => {
    await checkDatabaseConnection();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();