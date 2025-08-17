import express from "express";
import {
  signup,login

} from "../controllers/userController.js";

const authRoute = express.Router();

// POST /api/auth/signup
authRoute.post("/signup", signup);
// POST /api/auth/login
authRoute.post("/login", login);



export default authRoute;
