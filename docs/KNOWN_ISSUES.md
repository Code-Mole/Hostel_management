# Known Issues and Caveats

## 1) Backend port env var is lowercase
- `backend/server.js` reads `process.env.port` (lowercase), not the conventional `process.env.PORT`.
- Workarounds:
  - Set `port=8000` (or desired) in `backend/.env`, or
  - Update `server.js` to read `process.env.PORT || process.env.port || 5000`.

## 2) MongoDB env var naming differs
- Main server (`config/Db.js`) uses `MONGO_URI`.
- Admin utility script (`utils/createAdmin.js`) uses `MONGODB_URI`.
- Workarounds:
  - Define both in `.env`, pointing to the same URI, or
  - Unify names in code.

## 3) Vite proxy port mismatch
- `hostel_app/vite.config.js` proxies `/api` to `http://localhost:8000`.
- If backend runs on `5000` by default, the proxy will fail.
- Solutions:
  - Run backend on `8000` (`port=8000`), or
  - Change proxy target to `http://localhost:5000`.

## 4) Auth not implemented yet
- Although `jsonwebtoken` is listed as a dependency, there is no login endpoint or JWT middleware.
- Several admin-only controllers rely on `req.user` and `req.user.isAdmin()`.
- Action items:
  - Implement login, token issuance, and JWT verification middleware.
  - Protect admin routes with the middleware.

## 5) Frontend login is a placeholder
- `src/pages/auth/Login.jsx` simulates a login process and navigates to `/rooms`.
- Replace with real API integration once backend auth is implemented.