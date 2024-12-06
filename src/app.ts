import express from "express";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import userRoutes from "./routes/userRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.use(errorMiddleware);

export default app;
