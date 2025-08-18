// Booking utility functions and constants

// Initial sample booking data
export const initialBookings = [
  {
    id: "B001",
    roomId: "r-101",
    roomTitle: "KARJEL HOMES",
    roomType: "Student Hostel",
    customerName: "John Doe",
    email: "john.doe@email.com",
    phone: "+233 54 123 4567",
    idNumber: "GH-123456789-0",
    checkInDate: "2024-02-15",
    checkOutDate: "2024-03-15",
    numberOfGuests: 2,
    specialRequests: "Early check-in preferred",
    bookingDate: "2024-01-20",
    status: "confirmed",
    totalAmount: "Ghc950",
    location: "Sunyani Tonsoum Estate, Ghana",
    distance: "5.5KM from UENR",
  },
  {
    id: "B002",
    roomId: "r-103",
    roomTitle: "PARENT ESTATE LIMITED",
    roomType: "Luxury Apartment",
    customerName: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "+233 55 987 6543",
    idNumber: "GH-987654321-0",
    checkInDate: "2024-02-20",
    checkOutDate: "2024-04-20",
    numberOfGuests: 1,
    specialRequests: "Quiet room preferred",
    bookingDate: "2024-01-22",
    status: "pending",
    totalAmount: "Ghc1500",
    location: "Accra, Sunyani Notre Dame",
    distance: "8.5KM from UENR",
  },
  {
    id: "B003",
    roomId: "r-104",
    roomTitle: "EUSBETT HOTEL",
    roomType: "Hotel",
    customerName: "Michael Chen",
    email: "m.chen@email.com",
    phone: "+233 56 456 7890",
    idNumber: "GH-456789123-0",
    checkInDate: "2024-02-25",
    checkOutDate: "2024-02-28",
    numberOfGuests: 3,
    specialRequests: "Extra towels needed",
    bookingDate: "2024-01-25",
    status: "confirmed",
    totalAmount: "$228",
    location: "Berekum road, Sunyani",
    distance: "1.1KM from UENR",
  },
];

// Function to generate unique booking ID
export const generateBookingId = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `B${timestamp}${random}`;
};

// Function to calculate total amount based on room type and duration
export const calculateTotalAmount = (
  roomType,
  checkInDate,
  checkOutDate,
  numberOfGuests
) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  // Base prices per day based on room type
  const basePrices = {
    "Student Hostel": 32, // Ghc950 / 30 days
    "Luxury Apartment": 50, // Ghc1500 / 30 days
    Hotel: 76, // $76 per night
    "Student Residence": 40, // Ghc1200 / 30 days
    "Shared House": 27, // Ghc800 / 30 days
    "Modern Apartment": 93, // Ghc2800 / 30 days
    "Budget Hostel": 22, // Ghc650 / 30 days
    "Premium Apartment": 140, // Ghc4200 / 30 days
    "Green Hostel": 37, // Ghc1100 / 30 days
    "Studio Apartment": 60, // Ghc1800 / 30 days
    "Study-Focused Hostel": 32, // Ghc950 / 30 days
  };

  const basePrice = basePrices[roomType] || 50;
  const total = basePrice * days * numberOfGuests;

  // Format based on room type (some use Ghc, others use $)
  if (roomType === "Hotel") {
    return `$${total.toFixed(0)}`;
  } else {
    return `Ghc${total.toFixed(0)}`;
  }
};

// Function to add new booking from form data
export const addNewBooking = (bookingFormData, roomData) => {
  const newBooking = {
    id: generateBookingId(),
    roomId: roomData.id,
    roomTitle: roomData.title,
    roomType: roomData.type,
    customerName: bookingFormData.fullName,
    email: bookingFormData.email,
    phone: bookingFormData.phone,
    idNumber: bookingFormData.idNumber,
    checkInDate: bookingFormData.checkInDate,
    checkOutDate: bookingFormData.checkOutDate,
    numberOfGuests: bookingFormData.numberOfGuests,
    specialRequests: bookingFormData.specialRequests || "",
    bookingDate: new Date().toISOString().split("T")[0],
    status: "pending",
    totalAmount: calculateTotalAmount(
      roomData.type,
      bookingFormData.checkInDate,
      bookingFormData.checkOutDate,
      bookingFormData.numberOfGuests
    ),
    location: roomData.location,
    distance: roomData.distanceDisplay,
  };

  // Store in localStorage for persistence
  const existingBookings = JSON.parse(
    localStorage.getItem("hostelBookings") || "[]"
  );
  const updatedBookings = [newBooking, ...existingBookings];
  localStorage.setItem("hostelBookings", JSON.stringify(updatedBookings));

  return newBooking;
};

// Function to get all bookings from localStorage
export const getStoredBookings = () => {
  try {
    const stored = localStorage.getItem("hostelBookings");
    return stored ? JSON.parse(stored) : initialBookings;
  } catch (error) {
    console.error("Error loading bookings from localStorage:", error);
    return initialBookings;
  }
};
