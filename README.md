# EstatePro Monorepo (Frontend + Backend)

EstatePro is a full‑stack application for discovering accommodations (rooms, apartments, estates, hotels) and managing booking requests. It consists of:

- Frontend: React + Vite SPA with pages for browsing rooms, detailed room view with booking flow, basic auth screens, and a bookings management UI backed by localStorage.
- Backend: Node.js + Express + MongoDB (Mongoose) providing user signup and user management endpoints, with a rich `User` model supporting role-based access and profile fields.


## Features

- Frontend (React + Vite)
  - Landing page, rooms listing with filters/sorting, room details with slideshow and booking modal
  - Bookings page to view/filter/sort bookings (persisted in `localStorage`)
  - Signup flow integrated with backend `/api/auth/signup`
  - Login screen (UI only; simulated, no backend login yet)

- Backend (Express + Mongoose)
  - `POST /api/auth/signup` for user registration (customer by default; admin supported)
  - Admin-focused endpoints to list users, filter by type, update user type, and manage profiles
  - Robust `User` schema with profile, preferences, permissions, status, virtuals, indexes, and methods
  - Utility script to create an admin user


## Project Structure

```
/workspace
├── backend
│   ├── config/Db.js
│   ├── controllers/userController.js
│   ├── models/user.js
│   ├── routes/auth.js
│   ├── utils/createAdmin.js
│   ├── package.json
│   └── server.js
├── hostel_app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Homepage.jsx, Rooms.jsx, RoomDetails.jsx, Bookings.jsx
│   │   │   └── auth/Signup.jsx, auth/Login.jsx
│   │   ├── utils/bookingUtils.js
│   │   └── data/rooms (static seed data)
│   ├── vite.config.js
│   └── package.json
├── docs
│   ├── API.md
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   └── KNOWN_ISSUES.md
└── README.md (this file)
```


## Quick Start

### Prerequisites
- Node.js 18+ (recommended)
- MongoDB instance (local or hosted)

### 1) Backend setup
```
cd backend
cp .env.example .env
# Edit .env with your connection string and port
npm install
npm start
```
The server listens on `process.env.port` (lowercase) or `5000` by default. See Known Issues for details about `PORT` vs `port`.

### 2) Frontend setup
```
cd hostel_app
npm install
npm run dev
```
The Vite dev server starts on `http://localhost:3000`.


## Environment Variables (Backend)
Create `backend/.env` based on `.env.example`:

- `MONGO_URI` (primary) – MongoDB connection string used by `config/Db.js`
- `MONGODB_URI` (fallback for utility script) – used by `utils/createAdmin.js`
- `port` (lowercase) – server listen port in `server.js` (default `5000`)
- `PORT` (uppercase) – common convention; not currently used by `server.js`

See `docs/BACKEND.md` and `docs/KNOWN_ISSUES.md` for context.


## Dev Server / Proxy
- The frontend proxy is configured in `hostel_app/vite.config.js` to forward `/api` to `http://localhost:8000`.
- Either:
  - Run backend on `8000` (set `port=8000` in `backend/.env`), or
  - Update `vite.config.js` proxy target to your backend port (e.g., `5000`).


## API Overview
Base URL: `/api`

- `POST /api/auth/signup` – Register a new user (defaults to `customer`; supports `admin` with permissions)
- `GET /api/auth/users` – List all users (admin only; requires authentication middleware to set `req.user`)
- `GET /api/auth/users/type/:userType` – List users by type (`customer`|`admin`) (admin only)
- `PUT /api/auth/users/:userId/type` – Update a user's type and permissions (admin only)
- `GET /api/auth/users/:userId/profile` – Get a user profile (self or admin)
- `PUT /api/auth/users/:userId/profile` – Update a user profile (self or admin)

Detailed request/response examples are in `docs/API.md`.


## Data Model (User)
The `User` model includes:
- Basics: `name`, `email` (unique), `phone`, `password`
- Type and permissions: `userType` (`customer`|`admin`), `adminPermissions` flags
- Profile: `profilePicture`, `dateOfBirth`, `gender`, `nationality`, `address`, `emergencyContact`
- Booking preferences (customers): block, room type, floor, budget, requirements, check‑in time
- Status: `isActive`, `isVerified`, `isBlocked`, verification tokens and activity fields
- Virtuals: `age`, `accountStatus`, `roleDisplay`
- Methods: `comparePassword`, `isAdmin`, `isCustomer`, permission checks, login attempt management
- Statics: find by type, verified, customers/admins, by preferences

See `docs/BACKEND.md` for full details.


## Admin Creation
- Script: `backend/utils/createAdmin.js`
  - Uses `MONGODB_URI` to connect
  - Creates a verified active admin with full permissions
```
cd backend
node utils/createAdmin.js
```
- Or create via API: see `backend/README_USER_TYPES.md` and `docs/API.md`.


## Frontend Summary
- Pages: Homepage, Rooms (filter/sort), Room Details (booking modal), Bookings (manage local bookings), Signup, Login (UI only)
- Bookings are stored in `localStorage` via `src/utils/bookingUtils.js`
- Rooms data comes from static `src/data/rooms`

See `docs/FRONTEND.md` for usage, routing, and component structure.


## Known Limitations / Roadmap
- No login/auth endpoint yet; `Login.jsx` simulates an auth flow
- Admin endpoints assume `req.user` exists (auth middleware not implemented yet)
- Env var mismatches (`MONGO_URI` vs `MONGODB_URI`, `port` vs `PORT`) – see `docs/KNOWN_ISSUES.md`
- Vite proxy points to `8000`; adjust to your backend port or set backend to `8000`


## Troubleshooting
- Backend cannot connect to MongoDB: verify `MONGO_URI` in `backend/.env`
- Frontend cannot reach API: align Vite proxy target and backend port
- Admin script fails: ensure `MONGODB_URI` is set and reachable


## License
ISC (see `backend/package.json`).


## Further Reading
- `docs/API.md` – endpoints and examples
- `docs/BACKEND.md` – server, models, and configuration
- `docs/FRONTEND.md` – UI, routes, and state
- `docs/KNOWN_ISSUES.md` – important caveats
- `backend/README_USER_TYPES.md` – role and permissions system