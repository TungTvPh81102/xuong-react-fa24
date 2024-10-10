import dotenv from "dotenv";

dotenv.config();

export const { MONGO_URL, JWT_SECRET } = process.env;
