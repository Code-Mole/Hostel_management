# Backend Documentation (Express + MongoDB)

## Stack
- Runtime: Node.js 18+
- Framework: Express 5
- Database: MongoDB (Mongoose 8)
- Libraries: `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken` (planned), `multer` (planned for uploads)


## Entry Point
`server.js`
- Loads env via `dotenv`
- Connects to Mongo via `config/Db.js`
- Configures middleware: `cors()`, `express.json()`
- Registers routes:
  - `/api/auth` → `routes/auth.js`
- Starts HTTP server on `process.env.port || 5000`

Note: the server uses lowercase `port`. See Known Issues below.


## Configuration
`config/Db.js`
- Connects with `mongoose.connect(process.env.MONGO_URI)`
- Logs success/failure

Environment variables (see `.env.example`):
- `MONGO_URI` – connection string used by the main server
- `MONGODB_URI` – used by the admin utility script (see below)
- `port` – the port used by `server.js`


## Routes
`routes/auth.js`
- `POST /api/auth/signup` → `controllers/userController.signup`
- `GET /api/auth/users` → `userController.getAllUsers` (admin only)
- `GET /api/auth/users/type/:userType` → `userController.getUsersByType` (admin only)
- `PUT /api/auth/users/:userId/type` → `userController.updateUserType` (admin only)
- `GET /api/auth/users/:userId/profile` → `userController.getUserProfile` (self or admin)
- `PUT /api/auth/users/:userId/profile` → `userController.updateUserProfile` (self or admin)

Authentication middleware is not implemented yet. The controllers expect `req.user` to be present with methods like `isAdmin()`.


## Controllers
`controllers/userController.js`
- `signup(req, res)` – Validates required fields, enforces unique email/phone, creates a user, and returns a minimal user payload with type-driven `nextSteps` guidance. Password hashing is handled by Mongoose pre-save middleware.
- `getAllUsers(req, res)` – Requires `req.user.isAdmin()`, returns users without passwords.
- `getUsersByType(req, res)` – Validates `userType`, admin-only.
- `updateUserType(req, res)` – Admin-only; changes `userType` and admin permissions, normalizes permissions when downgrading to `customer`.
- `getUserProfile(req, res)` – Self or admin access.
- `updateUserProfile(req, res)` – Self or admin; strips sensitive fields from updates.


## Models
`models/user.js`
- Fields: basic info; type; auth; profile; address; emergency contact; booking preferences; admin permissions; status/verification; verification tokens; activity; preferences/settings; social logins; additional info (occupation/company/studentId/governmentId).
- Virtuals: `age`, `accountStatus`, `roleDisplay`
- Indexes: email, phone, userType, flags, preference fields, `createdAt`
- Middleware: pre-save hashing (`bcrypt`), lastActivity stamp
- Instance methods: `comparePassword`, `isLocked`, `isAdmin`, `isCustomer`, `hasPermission`, login attempt management
- Static methods: `findByPreferences`, `findVerifiedUsers`, `findCustomers`, `findAdmins`, `findByType`


## Utilities
`utils/createAdmin.js`
- Loads env, connects to Mongo via `MONGODB_URI`
- Creates a default admin with full permissions and verified/active status if not already present
- Can be executed directly: `node utils/createAdmin.js`


## Environment & Scripts
- `npm start` – runs `nodemon server.js`
- Env required: `MONGO_URI`; optional: `port`

`.env.example` is provided in `backend/`.


## Known Issues / Gaps
- Env var names:
  - `config/Db.js` uses `MONGO_URI`
  - `utils/createAdmin.js` uses `MONGODB_URI`
- Port env:
  - `server.js` reads `process.env.port` (lowercase), not the conventional uppercase `PORT`
- Auth:
  - `jsonwebtoken` is installed but no login endpoint or auth middleware exists. Admin-only controllers expect `req.user`; add JWT middleware to populate it.
- Error handling and logging could be expanded for production.