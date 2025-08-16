import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[\+]?[0-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },

    // User Type - Customer or Admin
    userType: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },

    // Authentication
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // User Profile
    profilePicture: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
      default: "prefer-not-to-say",
    },
    nationality: {
      type: String,
      default: "Local",
    },

    // Address Information
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String,
    },

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    // Estate Booking Preferences (only for customers)
    bookingPreferences: {
      preferredBlock: {
        type: String,
        default: null,
      },
      preferredRoomType: {
        type: String,
        enum: ["single", "double", "triple", "suite"],
        default: "single",
      },
      preferredFloor: {
        type: Number,
        min: 1,
        max: 50,
      },
      budgetRange: {
        type: String,
        enum: ["low", "medium", "high", "luxury"],
        default: "medium",
      },
      specialRequirements: [String], // e.g., ['wheelchair-accessible', 'quiet-area', 'near-elevator']
      preferredCheckInTime: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        default: "afternoon",
      },
    },

    // Admin-specific fields
    adminPermissions: {
      canManageUsers: {
        type: Boolean,
        default: false,
      },
      canManageBookings: {
        type: Boolean,
        default: false,
      },
      canManageRooms: {
        type: Boolean,
        default: false,
      },
      canViewReports: {
        type: Boolean,
        default: false,
      },
      canManageSettings: {
        type: Boolean,
        default: false,
      },
    },

    // Account Status & Verification
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // Verification Tokens
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    phoneVerificationCode: String,
    phoneVerificationExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // Account Activity
    lastLogin: Date,
    lastPasswordChange: Date,
    lastActivity: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Preferences & Settings
    preferences: {
      notifications: {
        email: { type: Boolean, default: true },
        sms: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
      },
      language: {
        type: String,
        default: "en",
        enum: ["en", "es", "fr", "de", "ar"],
      },
      timezone: {
        type: String,
        default: "UTC",
      },
      currency: {
        type: String,
        default: "USD",
      },
    },

    // Social Login (if implemented later)
    socialAccounts: [
      {
        provider: {
          type: String,
          enum: ["google", "facebook", "apple"],
        },
        providerId: String,
        providerEmail: String,
      },
    ],

    // Additional Information
    occupation: String,
    company: String,
    studentId: String, // If applicable
    governmentId: String, // For verification purposes
    governmentIdType: {
      type: String,
      enum: ["passport", "national-id", "drivers-license", "other"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's age
userSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
});

// Virtual for account status
userSchema.virtual("accountStatus").get(function () {
  if (this.isBlocked) return "blocked";
  if (!this.isActive) return "inactive";
  if (!this.isVerified) return "pending-verification";
  return "active";
});

// Virtual for user role display
userSchema.virtual("roleDisplay").get(function () {
  return this.userType === "admin" ? "Administrator" : "Customer";
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isVerified: 1 });
userSchema.index({ "bookingPreferences.preferredBlock": 1 });
userSchema.index({ "bookingPreferences.preferredRoomType": 1 });
userSchema.index({ createdAt: -1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    this.lastPasswordChange = new Date();
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update last activity
userSchema.pre("save", function (next) {
  this.lastActivity = new Date();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to check if user is admin
userSchema.methods.isAdmin = function () {
  return this.userType === "admin";
};

// Method to check if user is customer
userSchema.methods.isCustomer = function () {
  return this.userType === "customer";
};

// Method to check admin permissions
userSchema.methods.hasPermission = function (permission) {
  if (!this.isAdmin()) return false;
  return this.adminPermissions[permission] || false;
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }

  return this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Method to get user's booking preferences (only for customers)
userSchema.methods.getBookingPreferences = function () {
  if (!this.isCustomer()) {
    return null;
  }

  return {
    preferredBlock: this.bookingPreferences.preferredBlock,
    preferredRoomType: this.bookingPreferences.preferredRoomType,
    preferredFloor: this.bookingPreferences.preferredFloor,
    budgetRange: this.bookingPreferences.budgetRange,
    specialRequirements: this.bookingPreferences.specialRequirements,
    preferredCheckInTime: this.bookingPreferences.preferredCheckInTime,
  };
};

// Static method to find users by preferences (only customers)
userSchema.statics.findByPreferences = function (preferences) {
  const query = { userType: "customer" };

  if (preferences.roomType) {
    query["bookingPreferences.preferredRoomType"] = preferences.roomType;
  }

  if (preferences.block) {
    query["bookingPreferences.preferredBlock"] = preferences.block;
  }

  if (preferences.budget) {
    query["bookingPreferences.budgetRange"] = preferences.budget;
  }

  return this.find(query);
};

// Static method to find verified users
userSchema.statics.findVerifiedUsers = function () {
  return this.find({
    isVerified: true,
    isActive: true,
    isBlocked: false,
  });
};

// Static method to find all customers
userSchema.statics.findCustomers = function () {
  return this.find({ userType: "customer" });
};

// Static method to find all admins
userSchema.statics.findAdmins = function () {
  return this.find({ userType: "admin" });
};

// Static method to find users by type
userSchema.statics.findByType = function (userType) {
  return this.find({ userType });
};

const User = mongoose.model("User", userSchema);

export default User;
