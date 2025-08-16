# Frontend Documentation (React + Vite)

## Stack
- React 19, React Router 7
- Vite 7 (dev server on port 3000 by default)
- Axios for API requests
- React Icons for UI

Dev server proxy is configured in `vite.config.js` to forward `/api` to `http://localhost:8000`.


## Project Structure
```
hostel_app/
├── src/
│   ├── pages/
│   │   ├── Homepage.jsx
│   │   ├── Rooms.jsx
│   │   ├── RoomDetails.jsx
│   │   ├── Bookings.jsx
│   │   └── auth/
│   │       ├── Signup.jsx
│   │       └── Login.jsx
│   ├── utils/bookingUtils.js
│   ├── data/rooms (static data)
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```


## Routing
Defined in `src/App.jsx`:
- `/` → `Homepage`
- `/rooms` → `Rooms`
- `/rooms/:id` → `RoomDetails`
- `/bookings` → `Bookings`
- `/signup` → `Signup`
- `/login` → `Login`


## Pages
- Homepage: Marketing/landing content, CTA to rooms and login
- Rooms: Lists static rooms from `src/data/rooms` with search, type filter, and sort controls
- RoomDetails: Detailed view, image slideshow, booking modal; creates bookings via `bookingUtils.addNewBooking` and stores in `localStorage`
- Bookings: Management UI for stored bookings (filter/search/sort/status changes); can export/print (actions available in code, export buttons commented in JSX)
- Signup: Multi-step form; posts to backend `POST /api/auth/signup`
- Login: UI-only demo; simulates a delay and navigates to `/rooms` (no backend login yet)


## Data Flow
- Rooms data: `src/data/rooms` (static JSON-like export)
- Bookings persistence: `localStorage` via `src/utils/bookingUtils.js`
  - `addNewBooking(form, room)` – generates ID, computes amount, saves to `localStorage`
  - `getStoredBookings()` – loads bookings or seeds with `initialBookings`


## API Integration
- Signup uses Axios to `POST /api/auth/signup` via dev-server proxy (`/api` → backend). Ensure backend port aligns with `vite.config.js` proxy target.
- No login API yet.


## Running Locally
```
cd hostel_app
npm install
npm run dev
```
- Access at `http://localhost:3000`
- To use the signup flow, run the backend and align the proxy target in `vite.config.js` (default `http://localhost:8000`).


## Production Build
```
npm run build
npm run preview
```
- Output directory: `hostel_app/dist`


## Notes
- Images referenced in `public/` (e.g., `/hostel.png`, `/google.png`) are available for UI components.
- If you change the API base URL, update `vite.config.js` or switch Axios to an absolute base URL.