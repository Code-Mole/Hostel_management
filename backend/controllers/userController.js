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

// login user
 const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
  
 }

export { signup,login };
