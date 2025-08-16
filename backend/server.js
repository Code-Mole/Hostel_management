import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Db from "./config/Db.js";
import authRoute from "./routes/auth.js";

dotenv.config();
Db();

const server = express();
// middleware
server.use(cors());
server.use(express.json());

// routes
server.use("/api/auth", authRoute);

server.listen(process.env.port || 5000, () => {
  console.log(`server is running on port ${process.env.port}`);
});
