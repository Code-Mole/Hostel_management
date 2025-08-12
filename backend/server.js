import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const server = express();
// middleware
server.use(cors());
server.use(express.json());







server.listen(process.env.port || 5000, () => {
  console.log(`server is running on port ${process.env.port}`);
});





