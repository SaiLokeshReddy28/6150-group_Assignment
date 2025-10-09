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

  // ==========================================
    // EMAIL VALIDATION FUNCTION
    // ==========================================
    
    /**
     * Validates email format using regex
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid, false if invalid
     */
    function isValidEmail(email) {
        // Email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Shows error message and styling for invalid input
     * @param {HTMLElement} input - Input field element
     * @param {string} message - Error message to display
     */
    function showError(input, message) {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        
        // Find the error message element
        const errorElement = input.closest('.mb-3').querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    /**
     * Shows success styling for valid input
     * @param {HTMLElement} input - Input field element
     */
    function showSuccess(input) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        
        // Hide error message
        const errorElement = input.closest('.mb-3').querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Clears all validation styling from input
     * @param {HTMLElement} input - Input field element
     */
    function clearValidation(input) {
        input.classList.remove('is-valid', 'is-invalid');
        const errorElement = input.closest('.mb-3').querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    
    // ==========================================
    // LOGIN EMAIL VALIDATION
    // ==========================================
    
    const loginEmail = document.getElementById('loginEmail');
    
    if (loginEmail) {
        // Validate on blur (when user leaves the field)
        loginEmail.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email === '') {
                showError(this, 'Email address is required');
            } else if (!isValidEmail(email)) {
                showError(this, 'Please enter a valid email address (e.g., user@example.com)');
            } else {
                showSuccess(this);
            }
        });
        
        // Clear validation on input (while typing)
        loginEmail.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                const email = this.value.trim();
                
                if (email === '') {
                    clearValidation(this);
                } else if (isValidEmail(email)) {
                    showSuccess(this);
                }
            }
        });
    }
    
    
    // ==========================================
    // SIGN UP EMAIL VALIDATION
    // ==========================================
    
    const signupEmail = document.getElementById('signupEmail');
    
    if (signupEmail) {
        // Validate on blur (when user leaves the field)
        signupEmail.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email === '') {
                showError(this, 'Email address is required');
            } else if (!isValidEmail(email)) {
                showError(this, 'Please enter a valid email address (e.g., user@example.com)');
            } else {
                showSuccess(this);
            }
        });
        
        // Clear validation on input (while typing)
        signupEmail.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                const email = this.value.trim();
                
                if (email === '') {
                    clearValidation(this);
                } else if (isValidEmail(email)) {
                    showSuccess(this);
                }
            }
        });
    }
    
    
    // ==========================================
    // FORGOT PASSWORD EMAIL VALIDATION
    // ==========================================
    
    const resetEmail = document.getElementById('resetEmail');
    
    if (resetEmail) {
        // Validate on blur
        resetEmail.addEventListener('blur', function() {
            const email = this.value.trim();
            
            if (email === '') {
                showError(this, 'Email address is required');
            } else if (!isValidEmail(email)) {
                showError(this, 'Please enter a valid email address');
            } else {
                showSuccess(this);
            }
        });
        
        // Real-time validation on input
        resetEmail.addEventListener('input', function() {
            if (this.classList.contains('is-invalid') || this.classList.contains('is-valid')) {
                const email = this.value.trim();
                
                if (email === '') {
                    clearValidation(this);
                } else if (isValidEmail(email)) {
                    showSuccess(this);
                }
            }
        });
    }

});
