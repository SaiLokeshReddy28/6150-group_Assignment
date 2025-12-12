import React from "react";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/auth?tab=login");
  };

  const goToSignup = () => {
    navigate("/auth?tab=signup");
  };

  // 🔹 NEW: dedicated admin login entry
  const goToAdminLogin = () => {
    navigate("/auth?tab=login&mode=admin");
  };


  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-light sticky-top"
        id="mainNavbar"
      >
        <div className="container">
          {/* Brand/Logo */}
          <Link
            className="navbar-brand"
            to="/"
            aria-label="Finsight Home"
          >
            <i className="fas fa-wallet" aria-hidden="true"></i>{" "}
            Finsight
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navigation Links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item">
                <a className="nav-link" href="#features">
                  Features
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#how-it-works">
                  How It Works
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#testimonials">
                  Testimonials
                </a>
              </li>

              {/* Normal Login */}
              <li className="nav-item ms-lg-3">
                <button
                  className="btn btn-outline-primary"
                  aria-label="Login to your account"
                  onClick={goToLogin}
                >
                  <i
                    className="fas fa-sign-in-alt"
                    aria-hidden="true"
                  ></i>{" "}
                  Login
                </button>
              </li>

              {/* 🔹 NEW: Admin Login button */}
              <li className="nav-item ms-2">
                <button
                  className="btn btn-outline-secondary"
                  aria-label="Admin login"
                  onClick={goToAdminLogin}
                >
                  <i className="fas fa-user-shield me-1" aria-hidden="true"></i>
                  Admin Login
                </button>
              </li>


              {/* Get Started / Signup */}
              <li className="nav-item ms-2">
                <button
                  id="getStartedNavBtn"
                  className="btn btn-primary"
                  aria-label="Get started with Finsight"
                  onClick={goToSignup}
                >
                  Get Started
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section py-5" id="home">
        <div className="container">
          <div className="row align-items-center min-vh-75">
            {/* Left Column - Content */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="hero-content">
                {/* Badge */}
                <span className="badge bg-primary mb-3">
                  <i
                    className="fas fa-sparkles"
                    aria-hidden="true"
                  ></i>{" "}
                  Free Personal Finance Manager
                </span>

                {/* Heading */}
                <h1 className="display-3 fw-bold mb-4">
                  Take Control of Your Financial Future
                </h1>
                <p className="lead mb-4">
                  Smart budgeting made simple. Track expenses, analyze
                  spending patterns, and get personalized insights powered
                  by AI to achieve your financial goals—completely free.
                </p>

                {/* Hero Action Buttons */}
                <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                  <button
                    id="startFreeTrialHeroBtn"
                    className="btn btn-primary btn-lg"
                    aria-label="Start managing your finances"
                    onClick={goToSignup}
                  >
                    <i
                      className="fas fa-rocket me-2"
                      aria-hidden="true"
                    ></i>{" "}
                    Get Started
                  </button>
                  <a
                    href="#features"
                    className="btn btn-outline-primary btn-lg"
                    aria-label="Learn more about features"
                  >
                    <i
                      className="fas fa-info-circle me-2"
                      aria-hidden="true"
                    ></i>{" "}
                    Learn More
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column - Hero Image Placeholder */}
            <div className="col-lg-6">
              <div className="text-center p-5 bg-light rounded">
                <i
                  className="fas fa-chart-line fa-5x text-primary mb-3"
                  aria-hidden="true"
                ></i>
                <p className="text-muted">
                  Dashboard Preview Visualization
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section py-5" id="stats">
        <div className="container">
          {/* Main Stats Card */}
          <div className="card stats-card border-0 shadow-lg">
            <div className="card-body py-5 px-4">
              <div className="row g-4">
                {/* Stat 1: Active Users */}
                <div className="col-md-4">
                  <div className="stat-item text-center">
                    <div
                      className="stat-icon mb-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-number display-3 fw-bold mb-2">
                      50K+
                    </div>
                    <h3 className="stat-label text-muted h6 mb-2">
                      Active Users
                    </h3>
                    <p className="stat-description text-muted small">
                      Managing their finances daily
                    </p>
                  </div>
                </div>

                {/* Stat 2: Money Saved */}
                <div className="col-md-4">
                  <div className="stat-item text-center">
                    <div
                      className="stat-icon mb-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-piggy-bank"></i>
                    </div>
                    <div className="stat-number display-3 fw-bold mb-2">
                      $2M+
                    </div>
                    <h3 className="stat-label text-muted h6 mb-2">
                      Money Saved
                    </h3>
                    <p className="stat-description text-muted small">
                      Through smart budgeting insights
                    </p>
                  </div>
                </div>

                {/* Stat 3: User Rating */}
                <div className="col-md-4">
                  <div className="stat-item text-center">
                    <div
                      className="stat-icon mb-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-number display-3 fw-bold mb-2">
                      4.9★
                    </div>
                    <h3 className="stat-label text-muted h6 mb-2">
                      User Rating
                    </h3>
                    <p className="stat-description text-muted small">
                      Based on 10,000+ reviews
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Badges Row */}
              <div className="row mt-4 pt-4 border-top">
                <div className="col-12 text-center">
                  <p className="text-muted small mb-2">
                    Trusted security and privacy
                  </p>
                  <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                    <span className="badge bg-light text-dark px-3 py-2">
                      <i
                        className="fas fa-shield-alt me-2"
                        aria-hidden="true"
                      ></i>
                      Bank-Level Security
                    </span>
                    <span className="badge bg-light text-dark px-3 py-2">
                      <i
                        className="fas fa-lock me-2"
                        aria-hidden="true"
                      ></i>
                      256-bit Encryption
                    </span>
                    <span className="badge bg-light text-dark px-3 py-2">
                      <i
                        className="fas fa-user-shield me-2"
                        aria-hidden="true"
                      ></i>
                      Privacy Protected
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section
        className="features-section py-5 bg-light"
        id="features"
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Powerful Features</h2>
            <p className="lead text-muted">
              Everything you need to understand your financial documents
            </p>
          </div>

          <div className="row g-4">
            {/* Feature 1: Document Upload */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-file-upload"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    Easy Document Upload
                  </h4>
                  <p className="text-muted">
                    Upload bank statements, credit card bills, or expense
                    PDFs in seconds. We support multiple formats.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: AI-Powered Insights */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    AI-Powered Insights
                  </h4>
                  <p className="text-muted">
                    Our AI automatically categorizes transactions and
                    identifies spending patterns to give you actionable
                    insights
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3: Monthly Analysis */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    Monthly Analysis
                  </h4>
                  <p className="text-muted">
                    Track your spending month by month. See trends, compare
                    periods, and understand your financial habits
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4: Yearly Summaries */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    Yearly Summaries
                  </h4>
                  <p className="text-muted">
                    Get comprehensive annual financial reports with trends,
                    categories, and year-over-year comparisons
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5: Insights History */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-history"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    Insights History
                  </h4>
                  <p className="text-muted">
                    Access all your past financial reports anytime. See how
                    your financial health has evolved over time
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 6: Secure & Private */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card feature-card h-100 border-0 shadow-lg">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <h4 className="feature-title mb-3">
                    Secure & Private
                  </h4>
                  <p className="text-muted">
                    Your financial data is encrypted with bank-level
                    security. We never share your information
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        className="how-it-works-section py-5"
        id="how-it-works"
      >
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">How It Works</h2>
            <p className="lead text-muted">
              Get financial insights in three simple steps
            </p>
          </div>

          <div className="row g-4">
            {/* Step 1: Upload Documents */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="step-card text-center">
                <div className="step-number-container mb-4">
                  <span className="badge step-badge">1</span>
                </div>
                <div className="step-icon mb-3">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <h4 className="step-title mb-3">
                  Upload Your Documents
                </h4>
                <p className="text-muted">
                  Simply drag and drop your bank statements, credit card
                  bills, or expense PDFs. We&apos;ll handle the rest.
                </p>
              </div>
            </div>

            {/* Step 2: AI Processing */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="step-card text-center">
                <div className="step-number-container mb-4">
                  <span className="badge step-badge">2</span>
                </div>
                <div className="step-icon mb-3">
                  <i className="fas fa-microchip"></i>
                </div>
                <h4 className="step-title mb-3">
                  AI Analyzes & Categorizes
                </h4>
                <p className="text-muted">
                  Our AI automatically processes your documents, categorizes
                  transactions, and identifies spending patterns.
                </p>
              </div>
            </div>

            {/* Step 3: Get Insights */}
            <div className="col-12 col-md-6 col-lg-4">
              <div className="step-card text-center">
                <div className="step-number-container mb-4">
                  <span className="badge step-badge">3</span>
                </div>
                <div className="step-icon mb-3">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h4 className="step-title mb-3">
                  Get Personalized Insights
                </h4>
                <p className="text-muted">
                  View detailed monthly and yearly reports with actionable
                  recommendations to improve your finances.
                </p>
              </div>
            </div>
          </div>

          <div className="steps-arrows d-none d-lg-block">
            <i className="fas fa-arrow-right arrow-1"></i>
            <i className="fas fa-arrow-right arrow-2"></i>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        className="testimonials-section py-5 bg-light"
        id="testimonials"
      >
        <div className="container">
          {/* Section Header */}
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              What Our Users Say
            </h2>
            <p className="lead text-muted">
              Join thousands of satisfied users managing their finances
              smarter
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="row g-4">
            {/* Testimonial 1 */}
            <div className="col-12 col-md-6 col-lg-4">
              <article className="card testimonial-card h-100 border-0 shadow-lg">
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <div
                    className="quote-icon mb-3"
                    aria-hidden="true"
                  >
                    <i className="fas fa-quote-left"></i>
                  </div>

                  {/* Star Rating */}
                  <div
                    className="rating mb-3"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="testimonial-text mb-4">
                    &quot;Finsight has completely transformed how I
                    manage my money. The AI insights helped me save over
                    $500 in just two months!&quot;
                  </blockquote>

                  {/* User Info */}
                  <footer className="user-info d-flex align-items-center">
                    <div
                      className="user-avatar me-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3 className="user-name mb-0 h6">
                        Sarah Johnson
                      </h3>
                      <p className="user-role text-muted mb-0">
                        Marketing Manager
                      </p>
                    </div>
                  </footer>
                </div>
              </article>
            </div>

            {/* Testimonial 2 */}
            <div className="col-12 col-md-6 col-lg-4">
              <article className="card testimonial-card h-100 border-0 shadow-lg">
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <div
                    className="quote-icon mb-3"
                    aria-hidden="true"
                  >
                    <i className="fas fa-quote-left"></i>
                  </div>

                  {/* Star Rating */}
                  <div
                    className="rating mb-3"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="testimonial-text mb-4">
                    &quot;The budget tracking feature is amazing! I
                    finally understand where my money goes each month.
                    Highly recommend!&quot;
                  </blockquote>

                  {/* User Info */}
                  <footer className="user-info d-flex align-items-center">
                    <div
                      className="user-avatar me-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3 className="user-name mb-0 h6">
                        Michael Chen
                      </h3>
                      <p className="user-role text-muted mb-0">
                        Software Engineer
                      </p>
                    </div>
                  </footer>
                </div>
              </article>
            </div>

            {/* Testimonial 3 */}
            <div className="col-12 col-md-6 col-lg-4">
              <article className="card testimonial-card h-100 border-0 shadow-lg">
                <div className="card-body p-4">
                  {/* Quote Icon */}
                  <div
                    className="quote-icon mb-3"
                    aria-hidden="true"
                  >
                    <i className="fas fa-quote-left"></i>
                  </div>

                  {/* Star Rating */}
                  <div
                    className="rating mb-3"
                    role="img"
                    aria-label="5 out of 5 stars"
                  >
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                    <i className="fas fa-star" aria-hidden="true"></i>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="testimonial-text mb-4">
                    &quot;Best financial app I&apos;ve ever used.
                    Simple, beautiful, and incredibly powerful. It&apos;s
                    like having a financial advisor in your pocket!&quot;
                  </blockquote>

                  {/* User Info */}
                  <footer className="user-info d-flex align-items-center">
                    <div
                      className="user-avatar me-3"
                      aria-hidden="true"
                    >
                      <i className="fas fa-user"></i>
                    </div>
                    <div>
                      <h3 className="user-name mb-0 h6">
                        Emily Rodriguez
                      </h3>
                      <p className="user-role text-muted mb-0">
                        Small Business Owner
                      </p>
                    </div>
                  </footer>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section py-5" id="cta">
        <div className="container">
          <div className="cta-content text-center py-5 px-4">
            {/* Badge */}
            <span className="badge cta-badge mb-3">
              <i
                className="fas fa-rocket"
                aria-hidden="true"
              ></i>{" "}
              Start Managing Your Money Today
            </span>

            {/* Heading */}
            <h2 className="display-4 fw-bold text-white mb-4">
              Ready to Take Control of Your Finances?
            </h2>

            {/* Subheading */}
            <p className="lead text-white mb-5 opacity-90">
              Join thousands of users who are already achieving their
              financial goals with Finsight. Create your free account
              today and start managing your money smarter.
            </p>

            {/* CTA Buttons */}
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button
                id="startFreeTrialCTABtn"
                className="btn btn-light btn-lg px-5"
                aria-label="Create your free account"
                onClick={goToSignup}
              >
                <i
                  className="fas fa-rocket me-2"
                  aria-hidden="true"
                ></i>{" "}
                Get Started Free
              </button>
              <a
                id="contactSalesBtn"
                className="btn btn-outline-light btn-lg px-5"
                aria-label="Learn more about Finsight"
                href="#features"
              >
                <i
                  className="fas fa-info-circle me-2"
                  aria-hidden="true"
                ></i>{" "}
                Learn More
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="cta-trust-badges mt-5">
              <p className="text-white mb-3 opacity-75">
                What you get with Finsight
              </p>
              <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
                <span className="trust-badge">
                  <i
                    className="fas fa-check-circle me-2"
                    aria-hidden="true"
                  ></i>
                  100% Free Forever
                </span>
                <span className="trust-badge">
                  <i
                    className="fas fa-credit-card me-2"
                    aria-hidden="true"
                  ></i>
                  No Credit Card Required
                </span>
                <span className="trust-badge">
                  <i
                    className="fas fa-lock me-2"
                    aria-hidden="true"
                  ></i>
                  Secure &amp; Private
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer bg-dark text-white pt-5 pb-3">
        <div className="container">
          {/* Footer Main Content */}
          <div className="row g-4 mb-4">
            {/* Column 1: About */}
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="footer-column">
                <h2 className="footer-heading mb-3 h5">
                  <i
                    className="fas fa-wallet me-2"
                    aria-hidden="true"
                  ></i>
                  Finsight
                </h2>
                <p className="footer-text mb-3">
                  Smart budgeting made simple. Take control of your
                  financial future with AI-powered insights.
                </p>
                {/* Social Media Icons */}
                <nav
                  className="social-links"
                  aria-label="Social media links"
                >
                  <a
                    href="#"
                    className="social-icon"
                    aria-label="Facebook"
                  >
                    <i
                      className="fab fa-facebook-f"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                    aria-label="Twitter"
                  >
                    <i
                      className="fab fa-twitter"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                    aria-label="LinkedIn"
                  >
                    <i
                      className="fab fa-linkedin-in"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <a
                    href="#"
                    className="social-icon"
                    aria-label="Instagram"
                  >
                    <i
                      className="fab fa-instagram"
                      aria-hidden="true"
                    ></i>
                  </a>
                </nav>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="col-12 col-sm-6 col-lg-3">
              <nav className="footer-column">
                <h2 className="footer-heading mb-3 h5">Product</h2>
                <ul className="footer-links list-unstyled">
                  <li>
                    <a href="#features">Features</a>
                  </li>
                  <li>
                    <a href="#how-it-works">How It Works</a>
                  </li>
                  <li>
                    <a href="#testimonials">Testimonials</a>
                  </li>
                  <li>
                    <a href="#">Mobile App</a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Column 3: Company */}
            <div className="col-12 col-sm-6 col-lg-3">
              <nav className="footer-column">
                <h2 className="footer-heading mb-3 h5">Company</h2>
                <ul className="footer-links list-unstyled">
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Careers</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                  <li>
                    <a href="#">Press Kit</a>
                  </li>
                  <li>
                    <a href="#">Partners</a>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Column 4: Support */}
            <div className="col-12 col-sm-6 col-lg-3">
              <nav className="footer-column">
                <h2 className="footer-heading mb-3 h5">Support</h2>
                <ul className="footer-links list-unstyled">
                  <li>
                    <a href="#">Help Center</a>
                  </li>
                  <li>
                    <a href="#">Contact Us</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                  <li>
                    <a href="#">Security</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom pt-4 mt-4 border-top border-secondary">
            <div className="row align-items-center">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                <p className="mb-0 footer-copyright">
                  &copy; 2025 Finsight. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-badges">
                  <span className="footer-badge me-2">
                    <i
                      className="fas fa-shield-alt me-1"
                      aria-hidden="true"
                    ></i>
                    Secure
                  </span>
                  <span className="footer-badge me-2">
                    <i
                      className="fas fa-lock me-1"
                      aria-hidden="true"
                    ></i>
                    Encrypted
                  </span>
                  <span className="footer-badge">
                    <i
                      className="fas fa-check-circle me-1"
                      aria-hidden="true"
                    ></i>
                    GDPR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
