# API Reference

Base path: `/api`

All responses are JSON. Status codes follow standard semantics (200 OK, 201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error).

Important: Admin-only endpoints expect an authentication layer to attach the current user to `req.user` and to expose `req.user.isAdmin()`. The current codebase does not yet include this middleware or token handling.


## Auth / Users

### POST /auth/signup
Create a new user account. Defaults to a `customer`. Supports creating `admin` users with permissions.

Request body:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "password": "secret123",
  "userType": "customer", // optional: "customer" | "admin"
  "dateOfBirth": "1999-01-01",
  "gender": "prefer-not-to-say",
  "nationality": "Local",
  "occupation": "Student",
  "company": "",
  "studentId": "",
  "address": { "street": "", "city": "", "state": "", "country": "", "postalCode": "" },
  "emergencyContact": { "name": "", "relationship": "", "phone": "", "email": "" },
  "bookingPreferences": {
    "preferredBlock": "A",
    "preferredRoomType": "single",
    "preferredFloor": 3,
    "budgetRange": "medium",
    "specialRequirements": ["quiet-area"],
    "preferredCheckInTime": "afternoon"
  },
  "adminPermissions": { // only if userType is "admin"
    "canManageUsers": true,
    "canManageBookings": true,
    "canManageRooms": true,
    "canViewReports": true,
    "canManageSettings": true
  }
}
```

Success response (201):
```json
{
  "message": "Account created successfully! Welcome to EstatePro as a Customer.",
  "user": {
    "id": "674...",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "userType": "customer",
    "accountStatus": "pending-verification",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "isVerified": false,
    "bookingPreferences": {
      "preferredBlock": "A",
      "preferredRoomType": "single",
      "preferredFloor": 3,
      "budgetRange": "medium",
      "specialRequirements": ["quiet-area"],
      "preferredCheckInTime": "afternoon"
    },
    "nextSteps": ["Complete your profile with additional information", "Verify your email address", "Set your booking preferences", "Start browsing available estates"]
  }
}
```

Error responses:
- 400 validation error(s)
- 409 duplicate email/phone
- 500 server error

Example curl:
```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Jane Doe",
    "email":"jane@example.com",
    "phone":"+1234567890",
    "password":"secret123"
  }'
```

---

### GET /auth/users (admin only)
Retrieve all users. Excludes passwords.

Headers: requires authenticated user context on the server (not implemented yet).

Response (200):
```json
{
  "message": "Users retrieved successfully",
  "users": [ { "_id":"...", "name":"...", "email":"...", "userType":"customer", ... } ],
  "total": 42
}
```

---

### GET /auth/users/type/:userType (admin only)
List users by type. `userType` must be `customer` or `admin`.

Response (200):
```json
{
  "message": "Customers retrieved successfully",
  "users": [ ... ],
  "total": 12
}
```

Errors:
- 400 invalid `userType`
- 403 not admin

---

### PUT /auth/users/:userId/type (admin only)
Change a user's type and, if applicable, `adminPermissions`.

Request body:
```json
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

Response (200):
```json
{
  "message": "User type updated successfully",
  "user": { "_id":"...", "userType":"admin", "adminPermissions": { ... } }
}
```

Errors:
- 400 invalid `userType`
- 403 not admin
- 404 user not found

---

### GET /auth/users/:userId/profile (self or admin)
Get a user's profile. Requires `req.user` to match `:userId` or be admin.

Response (200):
```json
{
  "message": "User profile retrieved successfully",
  "user": { "_id":"...", "name":"...", "email":"...", ... }
}
```

Errors:
- 403 forbidden
- 404 user not found

---

### PUT /auth/users/:userId/profile (self or admin)
Update a user's profile. Sensitive fields are stripped (`password`, `userType`, admin flags, verification/status flags).

Request body: any subset of profile fields, address, emergencyContact, preferences, etc.

Response (200):
```json
{
  "message": "User profile updated successfully",
  "user": { "_id":"...", "name":"Updated Name", ... }
}
```

Errors:
- 403 forbidden
- 404 user not found
- 400 validation error


## Authentication Note
The codebase includes `jsonwebtoken` as a dependency, but token issuance and verification middleware are not yet implemented. To secure admin endpoints, add JWT-based middleware that populates `req.user` using the `User` model and validates `isAdmin()`.