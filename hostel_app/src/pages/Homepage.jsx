import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaInfoCircle,
  FaEnvelope,
  FaSignInAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaStar,
  FaBuilding,
  FaUsers,
  FaChartLine,
} from "react-icons/fa";
import "./Homepage.css";

const Homepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <FaBuilding className="logo-icon" />
            <span>EstatePro</span>
          </div>

          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <a
              href="#home"
              onClick={() => scrollToSection("home")}
              className="nav-link"
            >
              <FaHome /> Home
            </a>
            <a
              href="#about"
              onClick={() => scrollToSection("about")}
              className="nav-link"
            >
              <FaInfoCircle /> About Us
            </a>
            <a
              href="#contact"
              onClick={() => scrollToSection("contact")}
              className="nav-link"
            >
              <FaEnvelope /> Contact Us
            </a>
            <Link to="/login" className="nav-link login-btn">
              <FaSignInAlt /> Login
            </Link>
          </div>

          <div className="nav-toggle" onClick={toggleMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Find Your Perfect <span className="highlight">Estate</span>
          </h1>
          <p className="hero-subtitle">
            Hello and welcome,we are thrilled to have you here discover your
            dream home around the University and Natural Resources
            (UENR),whether you are a student,a worker family,your search ends
            here! We will help you find the perfect property that fits your
            needs,rent or purchasing...
          </p>
          <div className="hero-buttons">
            {/* <button className="btn btn-primary">
              <Link to="/rooms">Explore Properties</Link>
            </button> */}
            <Link to="/login" className="btn btn-secondary">
              Get Started
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="image-placeholder"></div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container">
          <div className="section-header">
            <h2>About Us</h2>
            <p>Your trusted partner in real estate excellence</p>
          </div>

          <div className="about-content">
            <div className="about-text">
              <h3>Leading Real Estate Solutions</h3>
              <p>
                With over 15 years of experience in the real estate market,
                we've helped thousands of families find their dream homes and
                investors maximize their returns. Our commitment to excellence,
                transparency, and personalized service sets us apart in the
                industry.
              </p>

              <div className="features-grid">
                <div className="feature-item">
                  <FaUsers className="feature-icon" />
                  <h4>Expert Team</h4>
                  <p>Certified professionals with deep market knowledge</p>
                </div>
                <div className="feature-item">
                  <FaChartLine className="feature-icon" />
                  <h4>Market Insights</h4>
                  <p>Data-driven analysis and market trends</p>
                </div>
                <div className="feature-item">
                  <FaStar className="feature-icon" />
                  <h4>Premium Service</h4>
                  <p>White-glove service for every client</p>
                </div>
              </div>
            </div>
            <div className="about-stats">
              <div className="stat-item">
                <h3>500+</h3>
                <p>Properties Sold</p>
              </div>
              <div className="stat-item">
                <h3>1000+</h3>
                <p>Happy Clients</p>
              </div>
              <div className="stat-item">
                <h3>15+</h3>
                <p>Years Experience</p>
              </div>
              <div className="stat-item">
                <h3>98%</h3>
                <p>Client Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <div className="section-header">
            <h2>Contact Us</h2>
            <p>Get in touch with our team for personalized assistance</p>
          </div>

          <div className="contact-content">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <p>
                Ready to start your real estate journey? Our team is here to
                help you every step of the way. Contact us today for a free
                consultation.
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <FaPhone className="contact-icon" />
                  <div>
                    <h4>Phone</h4>
                    <p>+233536368304</p>
                  </div>
                </div>

                <div className="contact-item">
                  <FaEnvelope className="contact-icon" />
                  <div>
                    <h4>Email</h4>
                    <p>estatesarounduenr@gmail.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <FaMapMarkerAlt className="contact-icon" />
                  <div>
                    <h4>Address</h4>
                    <p>
                      P.O.Box 214, Sunyani, Ghana
                      <br />
                      BS-0061-2164
                    </p>
                  </div>
                </div>

                <div className="contact-item">
                  <FaClock className="contact-icon" />
                  <div>
                    <h4>Business Hours</h4>
                    <p>
                      Mon - Fri: 9:00 AM - 6:00 PM
                      <br />
                      Sat: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h3>Send us a Message</h3>
              <form>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <input type="tel" placeholder="Your Phone" />
                </div>
                <div className="form-group">
                  <textarea
                    placeholder="Your Message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>EstatePro</h4>
              <p>
                Your trusted partner in real estate excellence, helping you find
                the perfect property and maximize your investments.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="#home">Home</a>
                </li>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li>Property Sales</li>
                <li>Property Rentals</li>
                <li>Investment Consulting</li>
                <li>Market Analysis</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Connect With Us</h4>
              <div className="social-links">
                <a href="#" className="social-link">
                  Facebook
                </a>
                <a href="#" className="social-link">
                  Twitter
                </a>
                <a href="#" className="social-link">
                  LinkedIn
                </a>
                <a href="#" className="social-link">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 EstatePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
