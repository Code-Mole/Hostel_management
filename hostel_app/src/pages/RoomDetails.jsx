import React, { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { rooms } from "../data/rooms";
import { addNewBooking } from "../utils/bookingUtils";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaWifi,
  FaCheckCircle,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaChevronLeft,
  FaChevronRight,
  FaClock,
  FaUsers,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
} from "react-icons/fa";
import "./RoomDetails.css";

const RoomDetails = () => {
  const { id } = useParams();
  const room = useMemo(() => rooms.find((r) => r.id === id), [id]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    checkInDate: "",
    checkOutDate: "",
    numberOfGuests: 1,
    specialRequests: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // Auto-advance slideshow every 2 seconds
  useEffect(() => {
    if (!room || !room.images || room.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [room]);

  // Manual navigation functions
  const goToPrevious = () => {
    if (!room || !room.images) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? room.images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (!room || !room.images) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % room.images.length);
  };

  // Reset image index when room changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [id]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!bookingData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!bookingData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(bookingData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!bookingData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    if (!bookingData.idNumber.trim()) {
      errors.idNumber = "ID number is required";
    }

    if (!bookingData.checkInDate) {
      errors.checkInDate = "Check-in date is required";
    }

    if (!bookingData.checkOutDate) {
      errors.checkOutDate = "Check-out date is required";
    }

    if (bookingData.checkInDate && bookingData.checkOutDate) {
      const checkIn = new Date(bookingData.checkInDate);
      const checkOut = new Date(bookingData.checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        errors.checkInDate = "Check-in date cannot be in the past";
      }

      if (checkOut <= checkIn) {
        errors.checkOutDate = "Check-out date must be after check-in date";
      }
    }

    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Create new booking using the utility function
    try {
      const newBooking = addNewBooking(bookingData, room);

      // Show success alert
      const accommodationType = room.type.toLowerCase();
      const article = ["a", "e", "i", "o", "u"].includes(accommodationType[0])
        ? "an"
        : "a";

      alert(
        `🎉 Congratulations! You have successfully booked ${article} ${accommodationType} at ${room.title}.\n\nYour booking details:\n• Check-in: ${bookingData.checkInDate}\n• Check-out: ${bookingData.checkOutDate}\n• Guests: ${bookingData.numberOfGuests}\n• Total Amount: ${newBooking.totalAmount}\n• Booking ID: ${newBooking.id}\n\nWe will contact you at ${bookingData.email} to confirm your booking.`
      );

      // Close modal and reset form
      setShowBookingForm(false);
      setBookingData({
        fullName: "",
        email: "",
        phone: "",
        idNumber: "",
        checkInDate: "",
        checkOutDate: "",
        numberOfGuests: 1,
        specialRequests: "",
      });
      setFormErrors({});
    } catch (error) {
      alert("There was an error processing your booking. Please try again.");
      console.error("Booking error:", error);
    }
  };

  // Close modal
  const closeBookingForm = () => {
    setShowBookingForm(false);
    setFormErrors({});
  };

  if (!room) {
    return (
      <div className="room-details page">
        <div className="not-found">
          <h2>Room/House not found</h2>
          <Link to="/rooms" className="back-link">
            <FaArrowLeft /> Back to rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="room-details page">
      <div className="details-header">
        <Link to="/rooms" className="back-link">
          <FaArrowLeft /> Back
        </Link>
        <span
          className={`type-pill ${room.type
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        >
          {room.type}
        </span>
      </div>

      <h1 className="title">{room.title}</h1>

      <div className="location">
        <FaMapMarkerAlt /> {room.location}
      </div>

      {/* Image Slideshow */}
      <div className="hero-slideshow">
        <div className="slideshow-container">
          {room.images && room.images.length > 0 ? (
            <>
              <img
                src={room.images[currentImageIndex]}
                alt={`${room.title} - Image ${currentImageIndex + 1}`}
                className="slide active"
              />

              {/* Navigation arrows */}
              {room.images.length > 1 && (
                <>
                  <button className="slide-nav prev" onClick={goToPrevious}>
                    <FaChevronLeft />
                  </button>
                  <button className="slide-nav next" onClick={goToNext}>
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Dots indicator */}
              {room.images.length > 1 && (
                <div className="dots-container">
                  {room.images.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <img src="/hostel.png" alt={room.title} />
          )}
        </div>
      </div>

      {/* Quick Specs */}
      <div className="quick-specs">
        <span>
          <FaBed /> {room.bedrooms}{" "}
          {room.bedrooms === 1 ? "bedroom" : "bedrooms"}
        </span>
        <span>
          <FaBath /> {room.bathrooms}{" "}
          {room.bathrooms === 1 ? "bathroom" : "bathrooms"}
        </span>
        <span>
          <FaRulerCombined /> {room.sizeSqft} sqft
        </span>
        <span>
          <FaStar /> {room.rating} rating
        </span>
        <span>
          <FaClock /> {room.distanceDisplay}
        </span>
      </div>

      {/* Price Information */}
      <div className="price-section">
        <div className="price">{room.priceDisplay}</div>
        <div className={`availability ${room.availability}`}>
          {room.availability}
        </div>
      </div>

      {/* Description */}
      <section className="description">
        <h3>About this {room.type}</h3>
        <p>{room.description}</p>
      </section>

      {/* Amenities */}
      <section className="amenities">
        <h3>Amenities</h3>
        <div className="amenities-grid">
          {room.amenities.map((amenity, i) => (
            <span key={i} className="amenity">
              <FaCheckCircle /> {amenity}
            </span>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="contact-info">
        <h3>Contact & Enquiries</h3>
        <div className="contact-grid">
          {room.contact && (
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <strong>Phone:</strong>
                <span>{room.contact}</span>
              </div>
            </div>
          )}

          {room.enquiries && (
            <div className="contact-item">
              {room.enquiries.includes("@") ? (
                <FaEnvelope className="contact-icon" />
              ) : room.enquiries.includes("http") ? (
                <FaGlobe className="contact-icon" />
              ) : (
                <FaUsers className="contact-icon" />
              )}
              <div>
                <strong>Enquiries:</strong>
                {room.enquiries.includes("http") ? (
                  <a
                    href={room.enquiries}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {room.enquiries}
                  </a>
                ) : (
                  <span>{room.enquiries}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta">
        <button
          className="primary-btn"
          onClick={() => setShowBookingForm(true)}
        >
          Book now
        </button>
        <Link to="/signup" className="secondary-btn">
          Create account
        </Link>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay" onClick={closeBookingForm}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Book {room.title}</h2>
              <button className="close-btn" onClick={closeBookingForm}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">
                    <FaUser /> Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={bookingData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={formErrors.fullName ? "error" : ""}
                  />
                  {formErrors.fullName && (
                    <span className="error-message">{formErrors.fullName}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    <FaEnvelope /> Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className={formErrors.email ? "error" : ""}
                  />
                  {formErrors.email && (
                    <span className="error-message">{formErrors.email}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">
                    <FaPhone /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className={formErrors.phone ? "error" : ""}
                  />
                  {formErrors.phone && (
                    <span className="error-message">{formErrors.phone}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="idNumber">
                    <FaIdCard /> ID Number *
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="idNumber"
                    value={bookingData.idNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your ID number"
                    className={formErrors.idNumber ? "error" : ""}
                  />
                  {formErrors.idNumber && (
                    <span className="error-message">{formErrors.idNumber}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="checkInDate">
                    <FaCalendarAlt /> Check-in Date *
                  </label>
                  <input
                    type="date"
                    id="checkInDate"
                    name="checkInDate"
                    value={bookingData.checkInDate}
                    onChange={handleInputChange}
                    className={formErrors.checkInDate ? "error" : ""}
                  />
                  {formErrors.checkInDate && (
                    <span className="error-message">
                      {formErrors.checkInDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="checkOutDate">
                    <FaCalendarAlt /> Check-out Date *
                  </label>
                  <input
                    type="date"
                    id="checkOutDate"
                    name="checkOutDate"
                    value={bookingData.checkOutDate}
                    onChange={handleInputChange}
                    className={formErrors.checkOutDate ? "error" : ""}
                  />
                  {formErrors.checkOutDate && (
                    <span className="error-message">
                      {formErrors.checkOutDate}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="numberOfGuests">
                    <FaUsers /> Number of Guests
                  </label>
                  <select
                    id="numberOfGuests"
                    name="numberOfGuests"
                    value={bookingData.numberOfGuests}
                    onChange={handleInputChange}
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="specialRequests">Special Requests</label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={bookingData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or additional information..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeBookingForm}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
