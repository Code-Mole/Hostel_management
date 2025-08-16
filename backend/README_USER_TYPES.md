# User Type System Documentation

## Overview

The user model now supports two user types: `customer` (default) and `admin`. This system provides role-based access control and different functionality for each user type.

## User Types

### 1. Customer (Default)

- **Default type**: All new users are created as customers by default
- **Purpose**: Regular users who can book accommodations
- **Features**:
  - Booking preferences
  - Profile management
  - Accommodation browsing and booking

### 2. Admin

- **Purpose**: System administrators with elevated privileges
- **Features**:
  - User management
  - Booking management
  - System reports and analytics
  - Configuration management

## User Model Schema

### New Fields Added

```javascript
// User Type
userType: {
  type: String,
  enum: ["customer", "admin"],
  default: "customer",
  
}

// Admin Permissions (only for admin users)
adminPermissions: {
  canManageUsers: { type: Boolean, default: false },
  canManageBookings: { type: Boolean, default: false },
  canManageRooms: { type: Boolean, default: false },
  canViewReports: { type: Boolean, default: false },
  canManageSettings: { type: Boolean, default: false },
}
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user (defaults to customer)

### User Management (Admin Only)

- `GET /api/auth/users` - Get all users
- `GET /api/auth/users/type/:userType` - Get users by type
- `PUT /api/auth/users/:userId/type` - Update user type
- `GET /api/auth/users/:userId/profile` - Get user profile
- `PUT /api/auth/users/:userId/profile` - Update user profile

## Usage Examples

### 1. Creating a Customer User (Default)

```javascript
// POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  // userType defaults to "customer"
  "bookingPreferences": {
    "preferredRoomType": "single",
    "budgetRange": "medium"
  }
}
```

### 2. Creating an Admin User

```javascript
// POST /api/auth/signup
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "+1234567890",
  "password": "admin123",
  "userType": "admin",
  "adminPermissions": {
    "canManageUsers": true,
    "canManageBookings": true,
    "canManageRooms": true,
    "canViewReports": true,
    "canManageSettings": true
  }
}
```

### 3. Updating User Type (Admin Only)

```javascript
// PUT /api/auth/users/:userId/type
{
  "userType": "admin",
  "adminPermissions": {
    "canManageUsers": true,
    "canManageBookings": true,
    "canManageRooms": false,
    "canViewReports": true,
    "canManageSettings": false
  }
}
```

## Utility Functions

### User Model Methods

```javascript
// Check user type
user.isAdmin(); // Returns true if user is admin
user.isCustomer(); // Returns true if user is customer

// Check admin permissions
user.hasPermission("canManageUsers"); // Returns true if admin has permission

// Get role display
user.roleDisplay; // Returns "Administrator" or "Customer"
```

### Static Methods

```javascript
// Find users by type
User.findCustomers(); // Find all customers
User.findAdmins(); // Find all admins
User.findByType("customer"); // Find users by specific type
```

## Creating Admin Users

### Option 1: Using the Utility Script

```bash
# Navigate to backend directory
cd backend

# Run the admin creation script
node utils/createAdmin.js
```

### Option 2: Using the API

```javascript
// Create admin via signup endpoint
const adminData = {
  name: "System Admin",
  email: "admin@estatepro.com",
  phone: "+1234567890",
  password: "securepassword",
  userType: "admin",
  adminPermissions: {
    canManageUsers: true,
    canManageBookings: true,
    canManageRooms: true,
    canViewReports: true,
    canManageSettings: true,
  },
};

fetch("/api/auth/signup", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(adminData),
});
```

## Security Considerations

1. **Admin Creation**: Only create admin users through secure channels
2. **Permission Management**: Grant only necessary permissions to admin users
3. **Access Control**: All admin endpoints require admin authentication
4. **Password Security**: Use strong passwords for admin accounts

## Database Indexes

The following indexes are automatically created for better performance:

```javascript
userSchema.index({ userType: 1 }); // For user type queries
userSchema.index({ email: 1 }); // For email lookups
userSchema.index({ phone: 1 }); // For phone lookups
userSchema.index({ isActive: 1 }); // For active user queries
userSchema.index({ isVerified: 1 }); // For verification queries
```

## Migration Notes

- Existing users will automatically have `userType: "customer"`
- Admin permissions will be set to `false` by default
- No data migration required for existing users

## Testing

To test the user type system:

1. Create a customer user (should default to customer type)
2. Create an admin user with specific permissions
3. Test admin-only endpoints with admin authentication
4. Verify customer users cannot access admin endpoints
5. Test user type updates and permission changes

## Support

For questions or issues with the user type system, refer to:

- User model: `backend/models/user.js`
- User controller: `backend/controllers/userController.js`
- Auth routes: `backend/routes/auth.js`
- Admin utility: `backend/utils/createAdmin.js`
