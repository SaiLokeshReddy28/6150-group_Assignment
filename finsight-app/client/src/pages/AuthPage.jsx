// src/pages/AuthPage.jsx

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";




import { auth, googleProvider, signInWithPopup } from "../firebase";

// Helper to extract the most useful error message from backend/network errors
const getServerErrorMessage = (err, fallback) => {
  // Network / no-response case
  if (!err?.response) {
    if (err?.message === "Network Error") {
      return "Unable to reach the server. Please make sure the backend is running and that CORS allows http://localhost:5173.";
    }
    return fallback;
  }

  const data = err.response.data;

  // express-validator style: { errors: [ { msg, ... }, ... ] }
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    return first?.msg || first?.message || fallback;
  }

  // Common patterns: { message: "..." } or { error: "..." }
  if (typeof data?.message === "string") return data.message;
  if (typeof data?.error === "string") return data.error;

  // In some cases backend might just send a string
  if (typeof data === "string") return data;

  return fallback;
};

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: saveAuth } = useAuth();

  // UI state
  const [activeTab, setActiveTab] = useState("login"); // "login" | "signup"
  const [loginMode, setLoginMode] = useState("user");  // "user" | "admin"
  const [showResetModal, setShowResetModal] = useState(false);
  const [adminSignupSuccess, setAdminSignupSuccess] = useState(false);


  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
    acceptTerms: false,
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [loginAlert, setLoginAlert] = useState("");

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    title: "",
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    age: "",
    gender: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    requestAdmin: false, // 🔹 Used only when mode=admin
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [signupAlert, setSignupAlert] = useState("");

  // Password rule tracking
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    upper: false,
    lower: false,
    digit: false,
    special: false,
  });

  // Reset password modal state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  // ------------------------
  // URL PARAMS → tab + mode
  // ------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    const mode = params.get("mode");

    if (tab === "signup") setActiveTab("signup");
    if (tab === "login") setActiveTab("login");

    if (mode === "admin") {
      setLoginMode("admin");
    } else {
      setLoginMode("user");
    }
  }, [location.search]);

  // Keep passwordRules in sync with current signup password
  useEffect(() => {
    const pw = signupForm.password || "";
    setPasswordRules({
      length: pw.length >= 8,
      upper: /[A-Z]/.test(pw),
      lower: /[a-z]/.test(pw),
      digit: /[0-9]/.test(pw),
      special: /[!@#$%^&*]/.test(pw),
    });
  }, [signupForm.password]);

  const goHome = () => {
    navigate("/");
  };

  // -------------
  // Google / FB
  // -------------
  const handleGoogleLogin = async () => {
    try {
      // Always show Google account chooser
      googleProvider.setCustomParameters({
        prompt: "select_account"
      });

      // Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();

      // Send token to backend
      const res = await api.post("/auth/google", { idToken });

      // Extract user & JWT
      const { token, user } = res.data;

      // Save using your AuthContext
      saveAuth(user, token, true);

      // Redirect
      navigate("/dashboard");

    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
  };




  // ==========================
  // LOGIN HANDLERS
  // ==========================
  const handleLoginChange = (e) => {
    const { id, type, checked, value } = e.target;

    let fieldKey;
    if (id === "loginEmail") fieldKey = "email";
    else if (id === "loginPassword") fieldKey = "password";
    else if (id === "rememberMe") fieldKey = "rememberMe";
    else if (id === "acceptLoginTerms") fieldKey = "acceptTerms";
    else fieldKey = id;

    const newValue = type === "checkbox" ? checked : value;

    setLoginForm((prev) => ({
      ...prev,
      [fieldKey]: newValue,
    }));

    setLoginErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldKey];
      return updated;
    });
  };

  const validateLoginField = (fieldKey, valueOverride) => {
    const value =
      valueOverride !== undefined ? valueOverride : loginForm[fieldKey];
    let error = "";

    switch (fieldKey) {
      case "email":
        if (!value) {
          error = "Please enter your email.";
        } else {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            error = "Please enter a valid email address.";
          }
        }
        break;

      case "password":
        if (!value) {
          error = "Please enter your password.";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters.";
        }
        break;

      case "acceptTerms":
        if (!loginForm.acceptTerms) {
          error = "You must accept the Terms & Conditions.";
        }
        break;

      default:
        break;
    }

    if (error) {
      setLoginErrors((prev) => ({
        ...prev,
        [fieldKey]: error,
      }));
    } else {
      setLoginErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
    }

    return error;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginAlert("");

    const fieldsToValidate = ["email", "password", "acceptTerms"];
    const errors = {};

    fieldsToValidate.forEach((field) => {
      const err = validateLoginField(field);
      if (err) {
        errors[field] = err;
      }
    });

    if (Object.keys(errors).length > 0) {
      setLoginAlert("Please fix the highlighted fields.");
      return;
    }

    try {
      const payload = {
        email: loginForm.email,
        password: loginForm.password,
      };

      const res = await api.post("/auth/login", payload);
      const { token, user } = res.data;

      // normalize role so we always have something
      const normalizedUser = {
        ...user,
        role: user.role || "user",
      };

      saveAuth(normalizedUser, token, loginForm.rememberMe);

      const roleLower = (normalizedUser.role || "").toLowerCase();

      if (loginMode === "admin") {
        if (roleLower !== "admin") {
          setLoginAlert(
            "These credentials do not have admin access. Please use a valid admin account or ask super admin to approve your admin request."
          );
          return;
        }
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err?.response?.data || err);
      const msg = getServerErrorMessage(
        err,
        "Login failed. Please check your email and password."
      );
      setLoginAlert(msg);
    }
  };

  // ==========================
  // SIGNUP HANDLERS
  // ==========================
  const handleSignupChange = (e) => {
    const { id, name, type, checked, value } = e.target;

    // 🔥 FIX 1: Special handling for admin request checkbox
    if (id === "requestAdmin") {
      setSignupForm((prev) => ({
        ...prev,
        requestAdmin: checked,   // true or false
      }));
      return; // stop here to avoid generic logic interfering
    }

    // Determine which field is being updated
    const key =
      name === "signupTitle"
        ? "title"
        : id === "signupName"
          ? "name"
          : id === "signupEmail"
            ? "email"
            : id === "countryCode"
              ? "countryCode"
              : id === "signupPhone"
                ? "phone"
                : id === "signupAge"
                  ? "age"
                  : id === "signupGender"
                    ? "gender"
                    : id === "signupPassword"
                      ? "password"
                      : id === "signupConfirmPassword"
                        ? "confirmPassword"
                        : id === "acceptTerms"
                          ? "acceptTerms"
                          : id;

    let newValue = type === "checkbox" ? checked : value;

    // Normalize phone digits
    if (id === "signupPhone") {
      let numeric = value.replace(/\D/g, "");
      let maxDigits = signupForm.countryCode === "+91" ? 10 : 15;
      newValue = numeric.slice(0, maxDigits);
    }

    // Normalize age
    if (id === "signupAge") {
      newValue = value.replace(/\D/g, "");
    }

    // Update form state
    setSignupForm((prev) => ({
      ...prev,
      [key]: newValue,
    }));

    // Clear error for updated field
    setSignupErrors((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const validateField = (fieldKey, valueOverride) => {
    const value =
      valueOverride !== undefined ? valueOverride : signupForm[fieldKey];
    let error = "";

    switch (fieldKey) {
      case "title":
        if (!value) {
          error = "Please select a title.";
        }
        break;

      case "name":
        if (!value) {
          error = "Please enter your full name.";
        } else if (value.length < 2) {
          error = "Name must be at least 2 characters.";
        } else if (value.length > 50) {
          error = "Name cannot exceed 50 characters.";
        } else if (!/^[A-Za-z\s'.-]+$/.test(value)) {
          error = "Name can only contain letters and basic punctuation.";
        }
        break;

      case "email":
        if (!value) {
          error = "Please enter your email.";
        } else {
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            error = "Please enter a valid email address.";
          }
        }
        break;

      case "phone":
        if (!value) {
          error = "Please enter your phone number.";
        } else if (value.length < 7) {
          error = "Phone number seems too short.";
        }
        break;

      case "age": {
        if (!value) {
          error = "Please enter your age.";
        } else {
          const ageNum = Number(value);
          if (Number.isNaN(ageNum)) {
            error = "Age must be a number.";
          } else if (ageNum < 18 || ageNum > 120) {
            error = "Age must be between 18 and 120.";
          }
        }
        break;
      }

      case "gender":
        if (!value) {
          error = "Please select your gender.";
        }
        break;

      case "password":
        if (!value) {
          error = "Please enter a password.";
        } else if (!passwordRules.length) {
          error = "Password must be at least 8 characters.";
        } else if (
          !passwordRules.upper ||
          !passwordRules.lower ||
          !passwordRules.digit ||
          !passwordRules.special
        ) {
          error =
            "Password must include upper, lower, number, and special character (!@#$%^&*).";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password.";
        } else if (value !== signupForm.password) {
          error = "Passwords do not match.";
        }
        break;

      case "acceptTerms":
        if (!signupForm.acceptTerms) {
          error = "You must accept the Terms & Conditions and Privacy Policy.";
        }
        break;

      default:
        break;
    }

    if (error) {
      setSignupErrors((prev) => ({
        ...prev,
        [fieldKey]: error,
      }));
    } else {
      setSignupErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldKey];
        return updated;
      });
    }

    return error;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupAlert("");

    // Basic checks
    if (!signupForm.phone || !signupForm.age || !signupForm.gender) {
      setSignupAlert("Please fill in phone, age, and gender.");
      return;
    }

    // Fields to validate
    const fieldsToValidate = [
      "title",
      "name",
      "email",
      "phone",
      "age",
      "gender",
      "password",
      "confirmPassword",
      "acceptTerms",
    ];

    const errors = {};
    fieldsToValidate.forEach((field) => {
      const err = validateField(field);
      if (err) errors[field] = err;
    });

    if (Object.keys(errors).length > 0) {
      setSignupAlert("Please fix the highlighted fields.");
      return;
    }

    try {
      // ✅ FINAL FIX — always send requestAdmin EXACTLY as checkbox value
      const payload = {
        title: signupForm.title,
        name: signupForm.name,
        email: signupForm.email,
        phone: signupForm.phone,
        countryCode: signupForm.countryCode,
        age: Number(signupForm.age),
        gender: signupForm.gender,
        password: signupForm.password,

        // 🔥 FIX 2: requestAdmin only true when admin mode + checkbox is checked
        requestAdmin:
          loginMode === "admin" && signupForm.requestAdmin === true
            ? true
            : false,
      };


      const res = await api.post("/auth/register", payload);
      const { token, user } = res.data;

      saveAuth(user, token, true);
      // 🔥 Admin signup success message instead of dashboard redirect
      if (loginMode === "admin" && signupForm.requestAdmin === true) {
        setAdminSignupSuccess(true);
        return;
      }

      // Redirect after signup
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err?.response?.data || err);
      const msg = getServerErrorMessage(
        err,
        "Something went wrong during signup."
      );
      setSignupAlert(msg);
    }
  };

  // ==========================
  // RESET PASSWORD HANDLERS
  // ==========================
  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    // TODO: call backend reset endpoint later
    console.log("Password reset requested for:", resetEmail);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setShowResetModal(false);
      setResetEmail("");
    }, 2000);
  };

  // ==========================
  // RENDER
  // ==========================
  return (
    <div className="login-page">
      {/* NAVIGATION BAR */}
      <nav className="navbar navbar-light bg-white shadow-sm">
        <div className="container">
          {/* Brand/Logo */}
          <button
            className="navbar-brand btn btn-link p-0 border-0 text-decoration-none"
            onClick={goHome}
            aria-label="Finsight Home"
          >
            <i className="fas fa-wallet" aria-hidden="true"></i> Finsight
          </button>

          {/* Back to Home Link */}
          <button
            className="btn btn-outline-primary btn-sm"
            aria-label="Back to home page"
            onClick={goHome}
          >
            <i className="fas fa-arrow-left me-2" aria-hidden="true"></i> Back
            to Home
          </button>
        </div>
      </nav>

      {/* AUTHENTICATION SECTION */}
      <section className="auth-section d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              {/* Auth Card */}
              <div className="card auth-card border-0 shadow-lg">
                <div className="card-body p-5">
                  {/* Logo/Icon at Top */}
                  <header className="text-center mb-4">
                    <div className="auth-logo mb-3" aria-hidden="true">
                      <i className="fas fa-wallet"></i>
                    </div>
                    <h1 className="fw-bold mb-2 h3">Welcome to Finsight</h1>
                    <p className="text-muted">Manage your finances smartly</p>
                  </header>

                  {/* Tabs */}
                  <ul
                    className="nav nav-tabs nav-fill auth-tabs mb-4"
                    id="authTabs"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "login" ? "active" : ""
                          }`}
                        id="login-tab"
                        type="button"
                        role="tab"
                        aria-controls="login-content"
                        aria-selected={activeTab === "login"}
                        onClick={() => setActiveTab("login")}
                      >
                        <i
                          className="fas fa-sign-in-alt me-2"
                          aria-hidden="true"
                        ></i>{" "}
                        Login
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "signup" ? "active" : ""
                          }`}
                        id="signup-tab"
                        type="button"
                        role="tab"
                        aria-controls="signup-content"
                        aria-selected={activeTab === "signup"}
                        onClick={() => setActiveTab("signup")}
                      >
                        <i
                          className="fas fa-user-plus me-2"
                          aria-hidden="true"
                        ></i>{" "}
                        Sign Up
                      </button>
                    </li>
                  </ul>

                  {/* Tab Content */}
                  <div className="tab-content" id="authTabContent">
                    {/* ================= LOGIN TAB ================= */}
                    <div
                      className={`tab-pane fade ${activeTab === "login" ? "show active" : ""
                        }`}
                      id="login-content"
                      role="tabpanel"
                      aria-labelledby="login-tab"
                    >
                      {/* 🔥 ADMIN MODE PURPLE BANNER */}
                      {loginMode === "admin" && (
                        <div
                          className="alert d-flex align-items-center gap-3 mb-3 shadow-sm"
                          style={{
                            backgroundColor: "#f3e8ff",
                            borderLeft: "5px solid #6f42c1",
                            color: "#4b007d",
                          }}
                        >
                          <i
                            className="fas fa-user-shield fs-4"
                            style={{ color: "#6f42c1" }}
                          ></i>
                          <div>
                            <strong>Admin Login</strong>
                            <br />
                            <span className="small text-muted">
                              You are logging in with administrator privileges.
                            </span>
                          </div>
                        </div>
                      )}

                      <form
                        id="loginForm"
                        className="auth-form"
                        noValidate
                        onSubmit={handleLoginSubmit}
                      >
                        {/* Login Alert */}
                        {loginAlert && (
                          <div
                            className="alert alert-danger"
                            role="alert"
                            id="loginAlert"
                          >
                            <i className="fas fa-exclamation-circle me-2"></i>
                            <span id="loginAlertMessage">{loginAlert}</span>
                          </div>
                        )}

                        {/* Email */}
                        <div className="mb-3">
                          <label
                            htmlFor="loginEmail"
                            className="form-label"
                          >
                            Email Address
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-envelope"></i>
                            </span>
                            <input
                              type="email"
                              className={`form-control ${loginErrors.email ? "is-invalid" : ""
                                }`}
                              id="loginEmail"
                              placeholder="Enter your email"
                              value={loginForm.email}
                              onChange={handleLoginChange}
                              onBlur={() => validateLoginField("email")}
                              required
                            />
                          </div>
                          {loginErrors.email && (
                            <div className="invalid-feedback">
                              {loginErrors.email}
                            </div>
                          )}
                        </div>

                        {/* Password */}
                        <div className="mb-3">
                          <label
                            htmlFor="loginPassword"
                            className="form-label"
                          >
                            Password
                          </label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="fas fa-lock"></i>
                            </span>
                            <input
                              type="password"
                              className={`form-control ${loginErrors.password ? "is-invalid" : ""
                                }`}
                              id="loginPassword"
                              placeholder="Enter your password"
                              value={loginForm.password}
                              onChange={handleLoginChange}
                              onBlur={() => validateLoginField("password")}
                              required
                            />
                          </div>
                          {loginErrors.password && (
                            <div className="invalid-feedback">
                              {loginErrors.password}
                            </div>
                          )}
                        </div>

                        {/* Remember + Forgot */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberMe"
                              checked={loginForm.rememberMe}
                              onChange={handleLoginChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="rememberMe"
                            >
                              Remember me
                            </label>
                          </div>

                          <button
                            type="button"
                            className="forgot-password-link btn btn-link p-0"
                            onClick={() => setShowResetModal(true)}
                          >
                            Forgot Password?
                          </button>
                        </div>

                        {/* Terms */}
                        <div className="form-check mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="acceptLoginTerms"
                            checked={loginForm.acceptTerms}
                            onChange={handleLoginChange}
                            onBlur={() => validateLoginField("acceptTerms")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="acceptLoginTerms"
                          >
                            I agree to the{" "}
                            <a href="#" className="text-primary">
                              Terms &amp; Conditions
                            </a>
                          </label>

                          {loginErrors.acceptTerms && (
                            <div className="text-danger small mt-1">
                              {loginErrors.acceptTerms}
                            </div>
                          )}
                        </div>

                        {/* SIGN IN BUTTON (ADMIN-AWARE) */}
                        <button
                          type="submit"
                          className="btn btn-primary w-100 btn-lg mb-3"
                          id="loginSubmitBtn"
                        >
                          {loginMode === "admin" ? (
                            <>
                              <i className="fas fa-unlock-alt me-2"></i>
                              Admin Sign In
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sign-in-alt me-2"></i>
                              Sign In
                            </>
                          )}
                        </button>

                        {/* Divider */}
                        <div className="auth-divider">
                          <span>or continue with</span>
                        </div>

                        {/* Social Login */}
                        <div className="d-flex gap-2 mb-3">
                          <button
                            type="button"
                            className="social-btn google btn btn-outline-secondary w-100"
                            onClick={handleGoogleLogin}
                          >
                            <i className="fab fa-google me-2"></i> Google
                          </button>


                        </div>
                      </form>
                    </div>

                    {/* ================= SIGNUP TAB ================= */}
                    <div
                      className={`tab-pane fade ${activeTab === "signup" ? "show active" : ""
                        }`}
                      id="signup-content"
                      role="tabpanel"
                      aria-labelledby="signup-tab"
                    >
                      {adminSignupSuccess ? (
                        /* ✅ ADMIN SIGNUP SUCCESS SCREEN */
                        <div className="text-center py-4">
                          <div className="mb-4">
                            <i className="fas fa-user-shield fa-3x text-success"></i>
                          </div>

                          <h4 className="fw-bold mb-3">Admin Signup Successful</h4>

                          <p className="text-muted mb-4">
                            Your admin signup request has been submitted successfully.
                            <br />
                            A <strong>super admin</strong> must approve your request before
                            you receive admin privileges.
                          </p>

                          <button
                            className="btn btn-primary btn-lg"
                            onClick={() => {
                              setAdminSignupSuccess(false);
                              setActiveTab("login");
                              navigate("/auth?tab=login&mode=admin");
                            }}
                          >
                            <i className="fas fa-arrow-left me-2"></i>
                            Back to Admin Login
                          </button>
                        </div>
                      ) : (
                        /* 🔹 ORIGINAL SIGNUP FORM */
                        <form
                          id="signupForm"
                          className="auth-form"
                          noValidate
                          onSubmit={handleSignupSubmit}
                        >
                          {/* Signup Alert */}
                          {signupAlert && (
                            <div
                              className="alert alert-danger"
                              role="alert"
                              id="signupAlert"
                            >
                              <i className="fas fa-exclamation-circle me-2"></i>
                              <span id="signupAlertMessage">{signupAlert}</span>
                            </div>
                          )}

                          {/* Title radio */}
                          <div className="mb-3">
                            <label className="form-label">Title</label>
                            <div className="d-flex gap-3 flex-wrap">
                              {["mr", "ms", "mrs", "dr", "prof"].map((val) => (
                                <div className="form-check" key={val}>
                                  <input
                                    className="form-check-input"
                                    type="radio"
                                    name="signupTitle"
                                    id={`title-${val}`}
                                    value={val}
                                    checked={signupForm.title === val}
                                    onChange={handleSignupChange}
                                    onBlur={() => validateField("title")}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={`title-${val}`}
                                  >
                                    {val === "mr"
                                      ? "Mr."
                                      : val === "ms"
                                        ? "Ms."
                                        : val === "mrs"
                                          ? "Mrs."
                                          : val === "dr"
                                            ? "Dr."
                                            : "Prof."}
                                  </label>
                                </div>
                              ))}
                            </div>
                            {signupErrors.title && (
                              <div className="text-danger small mt-1">
                                {signupErrors.title}
                              </div>
                            )}
                          </div>

                          {/* Name */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupName"
                              className="form-label"
                            >
                              Full Name
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="fas fa-user" aria-hidden="true"></i>
                              </span>
                              <input
                                type="text"
                                className={`form-control ${signupErrors.name ? "is-invalid" : ""
                                  }`}
                                id="signupName"
                                placeholder="Enter your full name"
                                maxLength={50}
                                value={signupForm.name}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("name")}
                              />
                              {signupErrors.name && (
                                <div className="invalid-feedback">
                                  {signupErrors.name}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Email */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupEmail"
                              className="form-label"
                            >
                              Email Address
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i
                                  className="fas fa-envelope"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <input
                                type="email"
                                className={`form-control ${signupErrors.email ? "is-invalid" : ""
                                  }`}
                                id="signupEmail"
                                placeholder="Enter your email"
                                maxLength={100}
                                value={signupForm.email}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("email")}
                              />
                              {signupErrors.email && (
                                <div className="invalid-feedback">
                                  {signupErrors.email}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Phone + Country */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupPhone"
                              className="form-label"
                            >
                              Phone Number
                            </label>
                            <div className="row g-2">
                              <div className="col-4">
                                <select
                                  className="form-select"
                                  id="countryCode"
                                  value={signupForm.countryCode}
                                  onChange={handleSignupChange}
                                >
                                  <option value="+1">🇺🇸 +1 (US)</option>
                                  <option value="+91">🇮🇳 +91 (India)</option>
                                  <option value="+44">🇬🇧 +44 (UK)</option>
                                  <option value="+86">🇨🇳 +86 (China)</option>
                                  <option value="+81">🇯🇵 +81 (Japan)</option>
                                  <option value="+82">🇰🇷 +82 (Korea)</option>
                                  <option value="+61">🇦🇺 +61 (Australia)</option>
                                  <option value="+49">🇩🇪 +49 (Germany)</option>
                                  <option value="+33">🇫🇷 +33 (France)</option>
                                  <option value="+39">🇮🇹 +39 (Italy)</option>
                                  <option value="+34">🇪🇸 +34 (Spain)</option>
                                  <option value="+7">🇷🇺 +7 (Russia)</option>
                                  <option value="+55">🇧🇷 +55 (Brazil)</option>
                                  <option value="+52">🇲🇽 +52 (Mexico)</option>
                                  <option value="+27">🇿🇦 +27 (South Africa)</option>
                                </select>
                              </div>
                              <div className="col-8">
                                <div className="input-group">
                                  <span className="input-group-text">
                                    <i
                                      className="fas fa-phone"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                  <input
                                    type="tel"
                                    className={`form-control ${signupErrors.phone ? "is-invalid" : ""
                                      }`}
                                    id="signupPhone"
                                    placeholder="Enter phone number"
                                    maxLength={15}
                                    inputMode="numeric"
                                    pattern="\d{7,15}"
                                    value={signupForm.phone}
                                    onChange={handleSignupChange}
                                    onBlur={() => validateField("phone")}
                                  />
                                </div>
                              </div>
                            </div>
                            <small className="text-muted d-block mt-1">
                              <i className="fas fa-info-circle me-1"></i>
                              Enter phone number without country code
                            </small>
                            {signupErrors.phone && (
                              <div className="invalid-feedback d-block">
                                {signupErrors.phone}
                              </div>
                            )}
                          </div>

                          {/* Age */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupAge"
                              className="form-label"
                            >
                              Age
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i
                                  className="fas fa-calendar"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <input
                                type="number"
                                className={`form-control ${signupErrors.age ? "is-invalid" : ""
                                  }`}
                                id="signupAge"
                                placeholder="Your age"
                                min={18}
                                max={120}
                                value={signupForm.age}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("age")}
                              />
                              {signupErrors.age && (
                                <div className="invalid-feedback">
                                  {signupErrors.age}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Gender */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupGender"
                              className="form-label"
                            >
                              Gender
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i
                                  className="fas fa-venus-mars"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <select
                                className={`form-select ${signupErrors.gender ? "is-invalid" : ""
                                  }`}
                                id="signupGender"
                                value={signupForm.gender}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("gender")}
                              >
                                <option value="">Select gender...</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                <option value="prefer-not-to-say">
                                  Prefer not to say
                                </option>
                              </select>
                              {signupErrors.gender && (
                                <div className="invalid-feedback">
                                  {signupErrors.gender}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Password */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupPassword"
                              className="form-label"
                            >
                              Password
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i
                                  className="fas fa-lock"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <input
                                type="password"
                                className={`form-control ${signupErrors.password ? "is-invalid" : ""
                                  }`}
                                id="signupPassword"
                                placeholder="Create a password"
                                minLength={8}
                                maxLength={128}
                                value={signupForm.password}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("password")}
                              />
                              {signupErrors.password && (
                                <div className="invalid-feedback">
                                  {signupErrors.password}
                                </div>
                              )}
                            </div>
                            <div className="mt-2">
                              <small className="text-muted d-block">
                                <strong>Password must contain:</strong>
                              </small>
                              <small
                                className={`d-block ${passwordRules.length
                                    ? "text-success"
                                    : "text-muted"
                                  }`}
                              >
                                {passwordRules.length ? "✔" : "•"} At least 8
                                characters
                              </small>
                              <small
                                className={`d-block ${passwordRules.upper
                                    ? "text-success"
                                    : "text-muted"
                                  }`}
                              >
                                {passwordRules.upper ? "✔" : "•"} One uppercase
                                letter (A-Z)
                              </small>
                              <small
                                className={`d-block ${passwordRules.lower
                                    ? "text-success"
                                    : "text-muted"
                                  }`}
                              >
                                {passwordRules.lower ? "✔" : "•"} One lowercase
                                letter (a-z)
                              </small>
                              <small
                                className={`d-block ${passwordRules.digit
                                    ? "text-success"
                                    : "text-muted"
                                  }`}
                              >
                                {passwordRules.digit ? "✔" : "•"} One number
                                (0-9)
                              </small>
                              <small
                                className={`d-block ${passwordRules.special
                                    ? "text-success"
                                    : "text-muted"
                                  }`}
                              >
                                {passwordRules.special ? "✔" : "•"} One special
                                character (!@#$%^&*)
                              </small>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="mb-3">
                            <label
                              htmlFor="signupConfirmPassword"
                              className="form-label"
                            >
                              Confirm Password
                            </label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i
                                  className="fas fa-lock"
                                  aria-hidden="true"
                                ></i>
                              </span>
                              <input
                                type="password"
                                className={`form-control ${signupErrors.confirmPassword
                                    ? "is-invalid"
                                    : ""
                                  }`}
                                id="signupConfirmPassword"
                                placeholder="Confirm your password"
                                maxLength={128}
                                value={signupForm.confirmPassword}
                                onChange={handleSignupChange}
                                onBlur={() => validateField("confirmPassword")}
                              />
                              {signupErrors.confirmPassword && (
                                <div className="invalid-feedback">
                                  {signupErrors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Request Admin Access (only in admin mode) */}
                          {loginMode === "admin" && (
                            <div className="form-check mb-3">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id="requestAdmin"
                                checked={signupForm.requestAdmin}
                                onChange={(e) =>
                                  setSignupForm((prev) => ({
                                    ...prev,
                                    requestAdmin: e.target.checked,
                                  }))
                                }
                              />
                              <label
                                className="form-check-label fw-bold"
                                htmlFor="requestAdmin"
                              >
                                Request Admin Access
                              </label>
                              <div className="form-text text-muted">
                                A super admin must approve this request before you
                                become an admin.
                              </div>
                            </div>
                          )}

                          {/* Terms */}
                          <div className="form-check mb-4">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="acceptTerms"
                              checked={signupForm.acceptTerms}
                              onChange={handleSignupChange}
                              onBlur={() => validateField("acceptTerms")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="acceptTerms"
                            >
                              I agree to the{" "}
                              <a href="#" className="text-primary">
                                Terms &amp; Conditions
                              </a>{" "}
                              and{" "}
                              <a href="#" className="text-primary">
                                Privacy Policy
                              </a>
                            </label>
                            {signupErrors.acceptTerms && (
                              <div className="text-danger small mt-1">
                                {signupErrors.acceptTerms}
                              </div>
                            )}
                          </div>

                          {/* Submit */}
                          <button
                            type="submit"
                            className="btn btn-primary w-100 btn-lg mb-3"
                            id="signupSubmitBtn"
                            aria-label="Create your account"
                          >
                            <i
                              className="fas fa-user-plus me-2"
                              aria-hidden="true"
                            ></i>
                            Create Account
                          </button>

                          {/* Divider */}
                          <div className="auth-divider">
                            <span>or sign up with</span>
                          </div>

                          {/* Social signup */}
                          <div className="d-flex gap-2 mb-3">
                            <button
                              type="button"
                              id="googleSignupBtn"
                              className="btn btn-outline-secondary w-100"
                              aria-label="Sign up with Google"
                              onClick={() =>
                                console.log("Google signup clicked (UI only)")
                              }
                            >
                              <i
                                className="fab fa-google me-2"
                                aria-hidden="true"
                              ></i>{" "}
                              Google
                            </button>
                          </div>
                        </form>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Links Below Card */}
              <nav className="text-center mt-4" aria-label="Legal links">
                <p className="text-white mb-0">
                  <a
                    href="#"
                    className="text-white text-decoration-none"
                  >
                    Privacy Policy
                  </a>
                  <span className="mx-2" aria-hidden="true">
                    •
                  </span>
                  <a
                    href="#"
                    className="text-white text-decoration-none"
                  >
                    Terms of Service
                  </a>
                </p>
              </nav>
            </div>
          </div>
        </div>
      </section>

      {/* FORGOT PASSWORD MODAL */}
      {showResetModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          aria-labelledby="forgotPasswordModalLabel"
          aria-modal="true"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h2 className="modal-title h5" id="forgotPasswordModalLabel">
                  <i
                    className="fas fa-key me-2 text-primary"
                    aria-hidden="true"
                  ></i>{" "}
                  Reset Password
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close reset password dialog"
                  onClick={() => setShowResetModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password.
                </p>

                <form
                  id="forgotPasswordForm"
                  noValidate
                  onSubmit={handleResetSubmit}
                >
                  <div className="mb-3">
                    <label htmlFor="resetEmail" className="form-label">
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i
                          className="fas fa-envelope"
                          aria-hidden="true"
                        ></i>
                      </span>
                      <input
                        type="email"
                        className="form-control"
                        id="resetEmail"
                        placeholder="Enter your email"
                        maxLength={100}
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    aria-label="Send password reset link"
                  >
                    <i
                      className="fas fa-paper-plane me-2"
                      aria-hidden="true"
                    ></i>
                    Send Reset Link
                  </button>
                </form>

                {resetSuccess && (
                  <div
                    className="alert alert-success mt-3"
                    role="alert"
                    id="resetSuccessMessage"
                  >
                    <i
                      className="fas fa-check-circle me-2"
                      aria-hidden="true"
                    ></i>
                    ✅ Password reset link sent! Check your email.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthPage;
