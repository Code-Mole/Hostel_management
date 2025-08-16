import express from "express";
import {
  signup,
  getAllUsers,
  getUsersByType,
  updateUserType,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";

const authRoute = express.Router();

// POST /api/auth/signup
authRoute.post("/signup", signup);

// User management routes (admin only)
// GET /api/auth/users - Get all users
authRoute.get("/users", getAllUsers);

// GET /api/auth/users/type/:userType - Get users by type
authRoute.get("/users/type/:userType", getUsersByType);

// PUT /api/auth/users/:userId/type - Update user type
authRoute.put("/users/:userId/type", updateUserType);

// GET /api/auth/users/:userId/profile - Get user profile
authRoute.get("/users/:userId/profile", getUserProfile);

// PUT /api/auth/users/:userId/profile - Update user profile
authRoute.put("/users/:userId/profile", updateUserProfile);

export default authRoute;
