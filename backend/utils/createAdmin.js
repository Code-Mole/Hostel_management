import mongoose from "mongoose";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Create admin user function
const createAdminUser = async (adminData) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists with this email");
      return existingAdmin;
    }

    // Create admin user with full permissions
    const adminUser = await User.create({
      name: adminData.name,
      email: adminData.email,
      phone: adminData.phone,
      password: adminData.password,
      userType: "admin",
      adminPermissions: {
        canManageUsers: true,
        canManageBookings: true,
        canManageRooms: true,
        canViewReports: true,
        canManageSettings: true,
      },
      isVerified: true,
      isActive: true,
    });

    console.log("Admin user created successfully:", {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      userType: adminUser.userType,
      permissions: adminUser.adminPermissions,
    });

    return adminUser;
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
};

// Example usage
const createDefaultAdmin = async () => {
  try {
    await connectDB();

    const defaultAdmin = {
      name: "System Administrator",
      email: "admin@estatepro.com",
      phone: "+1234567890",
      password: "admin123456", // Change this to a secure password
    };

    await createAdminUser(defaultAdmin);
    console.log("Default admin user created successfully");

    // Disconnect from database
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Error in createDefaultAdmin:", error);
    process.exit(1);
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDefaultAdmin();
}

export { createAdminUser, connectDB };
