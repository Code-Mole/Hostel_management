import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaSort,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaIdCard,
  FaBed,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaEye,
  FaTrash,
  FaDownload,
  FaPrint,
} from "react-icons/fa";
import { getStoredBookings } from "../utils/bookingUtils";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState(getStoredBookings);
  const [filteredBookings, setFilteredBookings] = useState(getStoredBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("bookingDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const storedBookings = getStoredBookings();
    setBookings(storedBookings);
    setFilteredBookings(storedBookings);
  }, []);

  // Filter and sort bookings
  useEffect(() => {
    let filtered = bookings.filter((booking) => {
      const matchesSearch =
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.roomTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || booking.status === statusFilter;
      const matchesRoomType =
        roomTypeFilter === "all" || booking.roomType === roomTypeFilter;

      return matchesSearch && matchesStatus && matchesRoomType;
    });

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        sortBy === "checkInDate" ||
        sortBy === "checkOutDate" ||
        sortBy === "bookingDate"
      ) {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter, roomTypeFilter, sortBy, sortOrder]);

  // Get status badge color
  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: "#27ae60", bg: "#d5f4e6" },
      pending: { color: "#f39c12", bg: "#fef5e7" },
      cancelled: { color: "#e74c3c", bg: "#fdf2f2" },
      completed: { color: "#3498db", bg: "#ebf8ff" },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <span
        className="status-badge"
        style={{
          backgroundColor: config.bg,
          color: config.color,
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate total revenue
  const totalRevenue = filteredBookings.reduce((total, booking) => {
    const amount = parseFloat(booking.totalAmount.replace(/[^0-9.]/g, ""));
    return total + amount;
  }, 0);

  // Handle booking actions
  const handleStatusChange = (bookingId, newStatus) => {
    const updatedBookings = bookings.map((booking) =>
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    );

    setBookings(updatedBookings);

    // Update localStorage
    localStorage.setItem("hostelBookings", JSON.stringify(updatedBookings));
  };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const updatedBookings = bookings.filter(
        (booking) => booking.id !== bookingId
      );
      setBookings(updatedBookings);

      // Update localStorage
      localStorage.setItem("hostelBookings", JSON.stringify(updatedBookings));
    }
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setShowBookingDetails(true);
  };

  const closeBookingDetails = () => {
    setShowBookingDetails(false);
    setSelectedBooking(null);
  };

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h1>Bookings Management</h1>
        <p>Manage and track all customer bookings</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h3>{filteredBookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon confirmed">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <h3>
              {filteredBookings.filter((b) => b.status === "confirmed").length}
            </h3>
            <p>Confirmed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-content">
            <h3>
              {filteredBookings.filter((b) => b.status === "pending").length}
            </h3>
            <p>Pending</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue">
            <FaBed />
          </div>
          <div className="stat-content">
            <h3>{totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by customer name, room, email, or booking ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <FaFilter />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <FaFilter />
            <select
              value={roomTypeFilter}
              onChange={(e) => setRoomTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Student Hostel">Student Hostel</option>
              <option value="Luxury Apartment">Luxury Apartment</option>
              <option value="Hotel">Hotel</option>
              <option value="Student Residence">Student Residence</option>
              <option value="Shared House">Shared House</option>
              <option value="Modern Apartment">Modern Apartment</option>
              <option value="Budget Hostel">Budget Hostel</option>
              <option value="Premium Apartment">Premium Apartment</option>
              <option value="Green Hostel">Green Hostel</option>
              <option value="Studio Apartment">Studio Apartment</option>
              <option value="Study-Focused Hostel">Study-Focused Hostel</option>
            </select>
          </div>

          <div className="filter-group">
            <FaSort />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="bookingDate">Booking Date</option>
              <option value="checkInDate">Check-in Date</option>
              <option value="checkOutDate">Check-out Date</option>
              <option value="customerName">Customer Name</option>
              <option value="roomTitle">Room Title</option>
            </select>
          </div>

          <button
            className="sort-order-btn"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bookings-table-container">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Customer</th>
              <th>Room</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id}>
                <td>
                  <span className="booking-id">{booking.id}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{booking.customerName}</div>
                    <div className="customer-email">{booking.email}</div>
                    <div className="customer-phone">{booking.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="room-info">
                    <div className="room-title">{booking.roomTitle}</div>
                    <div className="room-type">{booking.roomType}</div>
                    <div className="room-location">
                      <FaMapMarkerAlt /> {booking.location}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <FaCalendarAlt />
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="date-info">
                    <FaCalendarAlt />
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </div>
                </td>
                <td>
                  <div className="guests-info">
                    <FaUser />
                    {booking.numberOfGuests}{" "}
                    {booking.numberOfGuests === 1 ? "Guest" : "Guests"}
                  </div>
                </td>
                <td>
                  <div className="amount">{booking.totalAmount}</div>
                </td>
                <td>{getStatusBadge(booking.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn view"
                      onClick={() => openBookingDetails(booking)}
                      title="View Details"
                    >
                      <FaEye />
                    </button>

                    <select
                      className="status-select"
                      value={booking.status}
                      onChange={(e) =>
                        handleStatusChange(booking.id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      className="action-btn delete"
                      onClick={() => handleDeleteBooking(booking.id)}
                      title="Delete Booking"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <p>No bookings found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="modal-overlay" onClick={closeBookingDetails}>
          <div
            className="booking-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Booking Details - {selectedBooking.id}</h2>
              <button className="close-btn" onClick={closeBookingDetails}>
                <FaTimes />
              </button>
            </div>

            <div className="booking-details-content">
              <div className="details-grid">
                <div className="detail-section">
                  <h3>Customer Information</h3>
                  <div className="detail-item">
                    <FaUser />
                    <span>
                      <strong>Name:</strong> {selectedBooking.customerName}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaEnvelope />
                    <span>
                      <strong>Email:</strong> {selectedBooking.email}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaPhone />
                    <span>
                      <strong>Phone:</strong> {selectedBooking.phone}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaIdCard />
                    <span>
                      <strong>ID Number:</strong> {selectedBooking.idNumber}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Room Information</h3>
                  <div className="detail-item">
                    <FaBed />
                    <span>
                      <strong>Room:</strong> {selectedBooking.roomTitle}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <span>
                      <strong>Type:</strong> {selectedBooking.roomType}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaMapMarkerAlt />
                    <span>
                      <strong>Location:</strong> {selectedBooking.location}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaClock />
                    <span>
                      <strong>Distance:</strong> {selectedBooking.distance}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Booking Details</h3>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>
                      <strong>Check-in:</strong>{" "}
                      {new Date(
                        selectedBooking.checkInDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>
                      <strong>Check-out:</strong>{" "}
                      {new Date(
                        selectedBooking.checkOutDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaUser />
                    <span>
                      <strong>Guests:</strong> {selectedBooking.numberOfGuests}
                    </span>
                  </div>
                  <div className="detail-item">
                    <FaBed />
                    <span>
                      <strong>Amount:</strong> {selectedBooking.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Additional Information</h3>
                  <div className="detail-item">
                    <FaCalendarAlt />
                    <span>
                      <strong>Booking Date:</strong>{" "}
                      {new Date(
                        selectedBooking.bookingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span>
                      <strong>Status:</strong>{" "}
                      {getStatusBadge(selectedBooking.status)}
                    </span>
                  </div>
                  {selectedBooking.specialRequests && (
                    <div className="detail-item full-width">
                      <span>
                        <strong>Special Requests:</strong>
                      </span>
                      <p>{selectedBooking.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="secondary-btn" onClick={closeBookingDetails}>
                Close
              </button>
              <button
                className="primary-btn"
                onClick={() => {
                  handleStatusChange(selectedBooking.id, "confirmed");
                  closeBookingDetails();
                }}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
