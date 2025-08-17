import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBuilding,
  FaSignInAlt,
  FaCalendar,
  FaUserTie,
} from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Enhanced user profile fields
    dateOfBirth: "",
    gender: "prefer-not-to-say",
    nationality: "Local",
    occupation: "",
    company: "",
    studentId: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Full name is required";

      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Enter a valid email";

      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[+]?[0-9][\d]{0,15}$/.test(formData.phone.trim()))
        newErrors.phone = "Enter a valid phone number";

      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Please confirm your password";
      else if (formData.confirmPassword !== formData.password)
        newErrors.confirmPassword = "Passwords do not match";
    }

    if (step === 2) {
      console.log("Validating step 2:", {
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
      });

      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.gender) newErrors.gender = "Please select your gender";
      if (!formData.nationality.trim())
        newErrors.nationality = "Nationality is required";

      console.log("Step 2 validation errors:", newErrors);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    console.log("nextStep called, current step:", currentStep);
    if (validateStep(currentStep)) {
      const newStep = Math.min(currentStep + 1, totalSteps);
      console.log("Moving from step", currentStep, "to step", newStep);
      setCurrentStep(newStep);
    } else {
      console.log("Validation failed, staying on current step");
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called, current step:", currentStep);
    console.log("Form submission prevented, checking step validation...");

    // Only proceed if we're on the final step
    if (currentStep < totalSteps) {
      console.log("Not on final step, returning early");
      console.log("Current step:", currentStep, "Total steps:", totalSteps);
      return;
    }

    console.log("On final step, proceeding with validation...");
    // Validate the final step
    if (!validateStep(currentStep)) return;

    try {
      setIsLoading(true);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        nationality: formData.nationality,
        occupation: formData.occupation.trim(),
        company: formData.company.trim(),
        studentId: formData.studentId.trim(),
      };

      const res = await axios.post("/api/auth/signup", payload);

      if (res.status === 201) {
        sessionStorage.setItem("signedUpEmail", payload.email);
        navigate("/rooms");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Signup failed. Try again.";
      setErrors({ general: msg });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <h2>Basic Information</h2>
      <p>Let's start with your essential details</p>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="name">
            <FaUser className="input-icon" /> Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. Jane Doe"
            value={formData.name}
            onChange={handleInputChange}
            className={errors.name ? "error" : ""}
            autoComplete="name"
          />
          {errors.name && <span className="error-text">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">
            <FaEnvelope className="input-icon" /> Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? "error" : ""}
            autoComplete="email"
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="phone">
            <FaPhone className="input-icon" /> Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+15551234567"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? "error" : ""}
            autoComplete="tel"
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="nationality">Nationality</label>
          <input
            id="nationality"
            name="nationality"
            type="text"
            placeholder="e.g. American, British"
            value={formData.nationality}
            onChange={handleInputChange}
            className={errors.nationality ? "error" : ""}
          />
          {errors.nationality && (
            <span className="error-text">{errors.nationality}</span>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="password">
            <FaLock className="input-icon" /> Password
          </label>
          <div className="password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? "error" : ""}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && (
            <span className="error-text">{errors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? "error" : ""}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="toggle"
              onClick={() => setShowConfirmPassword((s) => !s)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="error-text">{errors.confirmPassword}</span>
          )}
        </div>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <h2>Personal Details</h2>
      <p>Tell us more about yourself</p>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="dateOfBirth">
            <FaCalendar className="input-icon" /> Date of Birth
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            className={errors.dateOfBirth ? "error" : ""}
          />
          {errors.dateOfBirth && (
            <span className="error-text">{errors.dateOfBirth}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className={errors.gender ? "error" : ""}
          >
            <option value="prefer-not-to-say">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <span className="error-text">{errors.gender}</span>}
        </div>
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label htmlFor="occupation">
            <FaUserTie className="input-icon" /> Occupation
          </label>
          <input
            id="occupation"
            name="occupation"
            type="text"
            placeholder="e.g. Student, Engineer, Teacher"
            value={formData.occupation}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="company">Company/Institution</label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="e.g. University of XYZ, ABC Corp"
            value={formData.company}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="studentId">Student ID (if applicable)</label>
        <input
          id="studentId"
          name="studentId"
          type="text"
          placeholder="e.g. STU123456"
          value={formData.studentId}
          onChange={handleInputChange}
        />
      </div>
    </>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();

      default:
        return renderStep1();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <Link to="/" className="brand">
            <FaBuilding className="brand-icon" />
            EstatePro
          </Link>
          <h1>Create your account</h1>
          <p>Book estates for your stays — not for sale.</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={currentStep >= 1 ? "active" : ""}>
            <span className="step-number">1</span>
            <span className="step-label">Basic Info</span>
          </div>
          <div className={currentStep >= 2 ? "active" : ""}>
            <span className="step-number">2</span>
            <span className="step-label">Personal</span>
          </div>
        </div>

        <form
          className="signup-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && currentStep < totalSteps) {
              e.preventDefault();
              console.log(
                "Enter key pressed on step",
                currentStep,
                "- preventing form submission"
              );
            }
          }}
        >
          {errors.general && (
            <div className="general-error">{errors.general}</div>
          )}

          {renderStepContent()}

          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={prevStep}
              >
                Previous
              </button>
            )}

            {currentStep < totalSteps ? (
              <button type="button" className="btn-primary" onClick={nextStep}>
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="signup-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading">
                    <div className="spinner" /> Creating account...
                  </div>
                ) : (
                  <>
                    <FaSignInAlt /> Create Account
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
