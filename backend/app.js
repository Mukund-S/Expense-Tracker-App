import express from "express";
import cors from "cors";
import { connectDB } from "./DB/Database.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import transactionRoutes from "./Routers/Transactions.js";
import userRoutes from "./Routers/userRouter.js";
import roleRoutes from "./Routers/role.js";
import groupRoutes from "./Routers/group.js";
import budgetRoutes from "./Routers/budget.js";
import locationRoutes from "./Routers/location.js";
import feedbackRouter from "./Routers/feedback.js";
import path from "path";

dotenv.config({ path: "./config/config.env" });
const app = express();
const port = 8000;

connectDB();

const allowedOrigins = [
  "https://main.d1sj7cd70hlter.amplifyapp.com",
  "https://expense-tracker-app-three-beryl.vercel.app",
  "http://localhost:3000/",
  "http://localhost:3000/register",
  "http://localhost:3000/api/auth/register",
];

app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Router
app.use("/api/v1", transactionRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/feedback", feedbackRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
