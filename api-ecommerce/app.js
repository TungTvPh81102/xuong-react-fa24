import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./src/config/connectDB";
import router from "./src/routers";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
connectDB();

app.use("/api", router);

export const viteNodeApp = app;
