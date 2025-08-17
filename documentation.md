# EstatePro Hostel Management System

## Overview

EstatePro is a hostel and estate management platform designed to help students, families, and workers find and book accommodation around the University of Energy and Natural Resources (UENR), Sunyani, Ghana. The platform provides robust real estate solutions with features for property listings, user management, booking preferences, and administrative controls.

## Features

- **Property Listings:** Browse and filter various properties including hostels, apartments, and houses with details on location, amenities, pricing, and availability.
- **User Management:** Supports different user types (customers and admins) with tailored permissions and profile data.
- **Booking Preferences:** Customers can set preferences for block, room type, floor, budget, and special requirements.
- **Admin Controls:** Admins have permissions to manage users, bookings, rooms and reports.
- **Contact & Support:** Integrated contact form and information for queries and support.
- **Statistics & Insights:** Real-time stats on properties sold, client satisfaction, and years of experience.

## Technology Stack

- **Frontend:** React (Vite), React Router, React Icons.
- **Backend:** Node.js, Express, MongoDB.
- **Data Models:** Mongoose for schema and model definitions.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Code-Mole/Hostel_management.git
   ```
2. Install dependencies for frontend and backend:
   ```bash
   cd hostel_app
   npm install
   cd ../backend
   npm install
   ```

3. Run the frontend:
   ```bash
   cd hostel_app
   npm run dev
   ```

4. Run the backend:
   ```bash
   cd backend
   npm start
   ```

## Usage

- Visit the homepage to browse available properties.
- Use the navigation to explore sections: Home, About Us, Contact.
- Customers can sign up, complete set booking preferences, and start browsing estates.
- Admins can access the dashboard to manage system resources.

## Data Model Highlights

### User Model

- **Fields:** name, email, phone, userType (admin/customer), bookingPreferences, adminPermissions, emergencyContact, occupation, company, studentId, governmentId, etc.
- **Security:** Password hashing, login attempt management, account status tracking.

Refer to [`backend/README_USER_TYPES.md`](backend/README_USER_TYPES.md) for full details on user schema, API endpoints, utility functions, and security considerations.

## Example Property Listing

```javascript
{
  id: "r-107",
  title: "CAMPUS VIEW APARTMENTS",
  type: "Apartment",
  pricePerMonth: 280,
  priceDisplay: "Ghc2800 per month",
  bedrooms: 2,
  bathrooms: 1,
  sizeSqft: 380,
  location: "Sunyani Heights, Campus View",
  distance: 4.7,
  amenities: [
    "High-Speed Wi-Fi",
    "Smart TV",
    "Air Conditioning",
    "Built-in Wardrobe",
    "24/7 Security",
    "Water",
    "Electricity",
    "Private Washroom",
    "Full Kitchen"
  ],
  availability: "available",
  rating: 4.1,
  description: "Affordable shared housing option in the peaceful Fiapre village, perfect for students looking for budget-friendly accommodation.",
  enquiries: "fiapre.homes@email.com",
  contact: "0352011111"
}
```

## Contact Information

- **Phone:** +233536368304
- **Email:** estatesarounduenr@gmail.com
- **Address:** P.O.Box 214, Sunyani, Ghana, BS-0061-2164
- **Business Hours:** Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM

## Quick Links

- Home
- About Us
- Contact
- Login

## Services

- Property Sales
- Property Rentals
- Investment Consulting
- Market Analysis

## Support

For further assistance, refer to the [backend/README_USER_TYPES.md](backend/README_USER_TYPES.md) or contact the support team using the details above.

---

© 2025 EstatePro. All rights reserved.