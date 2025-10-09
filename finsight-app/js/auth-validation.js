/**
 * Finsight - Authentication Validation
 * Handles form validation for login page
 * Author:Keerthi Chandrakanth
 */
document.addEventListener("DOMContentLoaded", function () {
  console.log("✅ Authentication JavaScript loaded successfully!");

  // ==========================================
  // PASSWORD TOGGLE FUNCTIONALITY
  // ==========================================

  // Get all password toggle buttons
  const passwordToggles = document.querySelectorAll(".password-toggle");

  passwordToggles.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const input = document.getElementById(targetId);
      const icon = this.querySelector("i");

      if (input.type === "password") {
        // Show password
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
      } else {
        // Hide password
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
      }
    });
  });

  // ==========================================
  // FORM SUBMISSION HANDLERS (Temporary)
  // ==========================================

  // Login Form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log(
        "Login form submitted (validation will be added in next commits)"
      );
      // Validation will be added in Commit 15, 16, 17
    });
  }

  // Sign Up Form
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log(
        "Sign up form submitted (validation will be added in next commits)"
      );
      // Validation will be added in Commit 15, 16, 17
    });
  }

  // Forgot Password Form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm");
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show success message
      const successMessage = document.getElementById("resetSuccessMessage");
      if (successMessage) {
        successMessage.classList.remove("d-none");
      }

      console.log("Password reset link requested");

      // Hide success message after 5 seconds
      setTimeout(function () {
        if (successMessage) {
          successMessage.classList.add("d-none");
        }
      }, 5000);
    });
  }

});
