import User from "../models/user.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      userType = "customer", // Default to customer
      // Optional fields from enhanced model
      dateOfBirth,
      gender,
      nationality,
      address,
      emergencyContact,
      bookingPreferences,
      occupation,
      company,
      studentId,
      // Admin-specific fields
      adminPermissions,
    } = req.body;

    // Required field validation
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, email, phone, and password are required",
      });
    }

    // Validate user type
    if (userType && !["customer", "admin"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type. Must be 'customer' or 'admin'",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message:
          "Email already in use. Please use a different email or sign in.",
      });
    }

    // Check if phone is already in use
    const existingPhone = await User.findOne({
      phone: phone.trim(),
    });

    if (existingPhone) {
      return res.status(409).json({
        message:
          "Phone number already in use. Please use a different phone number.",
      });
    }

    // Create user with enhanced data
    const userData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: password, // Will be hashed by pre-save middleware
      userType: userType,
    };

    // Add optional fields if provided
    if (dateOfBirth) userData.dateOfBirth = new Date(dateOfBirth);
    if (gender) userData.gender = gender;
    if (nationality) userData.nationality = nationality;
    if (address) userData.address = address;
    if (emergencyContact) userData.emergencyContact = emergencyContact;
    if (occupation) userData.occupation = occupation;
    if (company) userData.company = company;
    if (studentId) userData.studentId = studentId;

    // Add booking preferences only for customers
    if (userType === "customer" && bookingPreferences) {
      userData.bookingPreferences = bookingPreferences;
    }

    // Add admin permissions only for admin users
    if (userType === "admin" && adminPermissions) {
      userData.adminPermissions = adminPermissions;
    }

    const user = await User.create(userData);

    // Return success response with user data (excluding password)
    const responseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      isVerified: user.isVerified,
    };

    // Add type-specific data
    if (user.userType === "customer") {
      responseData.bookingPreferences = user.bookingPreferences;
      responseData.nextSteps = [
        "Complete your profile with additional information",
        "Verify your email address",
        "Set your booking preferences",
        "Start browsing available estates",
      ];
    } else if (user.userType === "admin") {
      responseData.adminPermissions = user.adminPermissions;
      responseData.nextSteps = [
        "Complete your admin profile",
        "Set your admin permissions",
        "Access admin dashboard",
        "Start managing the system",
      ];
    }

    return res.status(201).json({
      message: `Account created successfully! Welcome to EstatePro as a ${user.roleDisplay}.`,
      user: responseData,
    });
  } catch (err) {
    console.error("Signup error:", err);

    // Handle specific MongoDB errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(409).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists. Please use a different ${field}.`,
      });
    }

    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        message: "Validation failed",
        errors: messages,
      });
    }

    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    // Check if requesting user is admin
    if (!req.user || !req.user.isAdmin()) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    const users = await User.find({}).select("-password");

    return res.status(200).json({
      message: "Users retrieved successfully",
      users,
      total: users.length,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get users by type
const getUsersByType = async (req, res) => {
  try {
    const { userType } = req.params;

    // Check if requesting user is admin
    if (!req.user || !req.user.isAdmin()) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Validate user type
    if (!["customer", "admin"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type. Must be 'customer' or 'admin'",
      });
    }

    const users = await User.findByType(userType).select("-password");

    return res.status(200).json({
      message: `${
        userType.charAt(0).toUpperCase() + userType.slice(1)
      }s retrieved successfully`,
      users,
      total: users.length,
    });
  } catch (err) {
    console.error("Get users by type error:", err);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// Update user type (admin only)
const updateUserType = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType, adminPermissions } = req.body;

    // Check if requesting user is admin
    if (!req.user || !req.user.isAdmin()) {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
      });
    }

    // Validate user type
    if (!["customer", "admin"].includes(userType)) {
      return res.status(400).json({
        message: "Invalid user type. Must be 'customer' or 'admin'",
      });
    }

    const updateData = { userType };

    // Add admin permissions if changing to admin
    if (userType === "admin" && adminPermissions) {
      updateData.adminPermissions = adminPermissions;
    }

    // Remove admin permissions if changing to customer
    if (userType === "customer") {
      updateData.adminPermissions = {
        canManageUsers: false,
        canManageBookings: false,
        canManageRooms: false,
        canViewReports: false,
        canManageSettings: false,
      };
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User type updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update user type error:", err);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Users can only view their own profile, or admins can view any profile
    if (
      !req.user ||
      (req.user._id.toString() !== userId && !req.user.isAdmin())
    ) {
      return res.status(403).json({
        message: "Access denied. You can only view your own profile.",
      });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (err) {
    console.error("Get user profile error:", err);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Users can only update their own profile, or admins can update any profile
    if (
      !req.user ||
      (req.user._id.toString() !== userId && !req.user.isAdmin())
    ) {
      return res.status(403).json({
        message: "Access denied. You can only update your own profile.",
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.userType;
    delete updateData.adminPermissions;
    delete updateData.isVerified;
    delete updateData.isActive;
    delete updateData.isBlocked;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update user profile error:", err);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
};

export {
  signup,
  getAllUsers,
  getUsersByType,
  updateUserType,
  getUserProfile,
  updateUserProfile,
};
