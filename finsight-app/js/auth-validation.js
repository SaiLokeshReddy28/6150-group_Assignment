/**
 * Finsight - Authentication Validation
 * Handles form validation for login page
 * Authors: Keerthi Chandrakanth, Kottapally Manasvini
 */
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ Authentication JavaScript loaded successfully!");

    // ==========================================
    // PASSWORD TOGGLE FUNCTIONALITY
    // ==========================================

    // Get all password toggle buttons
    const passwordToggles = document.querySelectorAll(".password-toggle");

    passwordToggles.forEach((button) => {
        button.addEventListener("click", function() {
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
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");

        // Find the error message element
        const errorElement = input
            .closest(".mb-3")
            .querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    /**
     * Shows success styling for valid input
     * @param {HTMLElement} input - Input field element
     */
    function showSuccess(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");

        // Hide error message
        const errorElement = input
            .closest(".mb-3")
            .querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.style.display = "none";
        }
    }

    /**
     * Clears all validation styling from input
     * @param {HTMLElement} input - Input field element
     */
    function clearValidation(input) {
        input.classList.remove("is-valid", "is-invalid");
        const errorElement = input
            .closest(".mb-3")
            .querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.style.display = "none";
        }
    }

    // ==========================================
    // ALERT HELPER FUNCTIONS
    // ==========================================

    /**
     * Shows alert message
     * @param {string} alertId - ID of alert element
     * @param {string} message - Message to display
     * @param {string} type - Alert type (danger, success, warning)
     */
    function showAlert(alertId, message, type = "danger") {
        const alert = document.getElementById(alertId);
        const alertMessage = document.getElementById(alertId + "Message");

        if (alert && alertMessage) {
            alert.className = `alert alert-${type}`;
            alert.classList.remove("d-none");
            alertMessage.textContent = message;

            // Scroll to alert
            alert.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    /**
     * Hides alert message
     * @param {string} alertId - ID of alert element
     */
    function hideAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.add("d-none");
        }
    }

    /**
     * Adds loading state to button
     * @param {HTMLElement} button - Button element
     */
    function setButtonLoading(button) {
        button.disabled = true;
        button.classList.add("btn-loading");
        button.dataset.originalText = button.innerHTML;
        button.innerHTML =
            '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Loading...';
    }

    /**
     * Removes loading state from button
     * @param {HTMLElement} button - Button element
     */
    function removeButtonLoading(button) {
        button.disabled = false;
        button.classList.remove("btn-loading");
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }

    // ==========================================
    // NAME VALIDATION (for Sign Up)
    // ==========================================

    const signupName = document.getElementById("signupName");

    if (signupName) {
        signupName.addEventListener("blur", function() {
            const name = this.value.trim();

            if (name === "") {
                showError(this, "Full name is required");
            } else if (name.length < 2) {
                showError(this, "Name must be at least 2 characters long");
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError(this, "Name can only contain letters and spaces");
            } else {
                showSuccess(this);
            }
        });

        signupName.addEventListener("input", function() {
            if (
                this.classList.contains("is-invalid") ||
                this.classList.contains("is-valid")
            ) {
                const name = this.value.trim();

                if (name === "") {
                    clearValidation(this);
                } else if (name.length >= 2 && /^[a-zA-Z\s]+$/.test(name)) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // LOGIN EMAIL VALIDATION
    // ==========================================

    const loginEmail = document.getElementById("loginEmail");

    if (loginEmail) {
        // Validate on blur (when user leaves the field)
        loginEmail.addEventListener("blur", function() {
            const email = this.value.trim();

            if (email === "") {
                showError(this, "Email address is required");
            } else if (!isValidEmail(email)) {
                showError(
                    this,
                    "Please enter a valid email address (e.g., user@example.com)"
                );
            } else {
                showSuccess(this);
            }
        });

        // Clear validation on input (while typing)
        loginEmail.addEventListener("input", function() {
            if (
                this.classList.contains("is-invalid") ||
                this.classList.contains("is-valid")
            ) {
                const email = this.value.trim();

                if (email === "") {
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

    const signupEmail = document.getElementById("signupEmail");

    if (signupEmail) {
        // Validate on blur (when user leaves the field)
        signupEmail.addEventListener("blur", function() {
            const email = this.value.trim();

            if (email === "") {
                showError(this, "Email address is required");
            } else if (!isValidEmail(email)) {
                showError(
                    this,
                    "Please enter a valid email address (e.g., user@example.com)"
                );
            } else {
                showSuccess(this);
            }
        });

        // Clear validation on input (while typing)
        signupEmail.addEventListener("input", function() {
            if (
                this.classList.contains("is-invalid") ||
                this.classList.contains("is-valid")
            ) {
                const email = this.value.trim();

                if (email === "") {
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

    const resetEmail = document.getElementById("resetEmail");

    if (resetEmail) {
        // Validate on blur
        resetEmail.addEventListener("blur", function() {
            const email = this.value.trim();

            if (email === "") {
                showError(this, "Email address is required");
            } else if (!isValidEmail(email)) {
                showError(this, "Please enter a valid email address");
            } else {
                showSuccess(this);
            }
        });

        // Real-time validation on input
        resetEmail.addEventListener("input", function() {
            if (
                this.classList.contains("is-invalid") ||
                this.classList.contains("is-valid")
            ) {
                const email = this.value.trim();

                if (email === "") {
                    clearValidation(this);
                } else if (isValidEmail(email)) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // PASSWORD STRENGTH VALIDATION
    // ==========================================

    /**
     * Validates password strength based on requirements
     * @param {string} password - Password to validate
     * @returns {object} - Object with strength score and feedback
     */
    function checkPasswordStrength(password) {
        let strength = 0;
        const feedback = {
            score: 0,
            text: "",
            color: "",
            width: 0,
            requirements: {
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
            },
        };

        // Check minimum length (8 characters)
        if (password.length >= 8) {
            strength += 25;
            feedback.requirements.length = true;
        }

        // Check for uppercase letter
        if (/[A-Z]/.test(password)) {
            strength += 25;
            feedback.requirements.uppercase = true;
        }

        // Check for lowercase letter
        if (/[a-z]/.test(password)) {
            strength += 25;
            feedback.requirements.lowercase = true;
        }

        // Check for number
        if (/[0-9]/.test(password)) {
            strength += 25;
            feedback.requirements.number = true;
        }

        // Set feedback based on strength
        if (strength === 0) {
            feedback.text = "Password strength";
            feedback.color = "";
            feedback.width = 0;
        } else if (strength <= 25) {
            feedback.text = "Weak password";
            feedback.color = "bg-danger";
            feedback.width = 25;
        } else if (strength <= 50) {
            feedback.text = "Fair password";
            feedback.color = "bg-warning";
            feedback.width = 50;
        } else if (strength <= 75) {
            feedback.text = "Good password";
            feedback.color = "bg-info";
            feedback.width = 75;
        } else {
            feedback.text = "Strong password";
            feedback.color = "bg-success";
            feedback.width = 100;
        }

        feedback.score = strength;
        return feedback;
    }

    /**
     * Updates the password strength indicator UI
     * @param {string} password - Current password value
     */
    function updatePasswordStrength(password) {
        const strengthBar = document.getElementById("passwordStrengthBar");
        const strengthText = document.getElementById("passwordStrengthText");

        if (!strengthBar || !strengthText) return;

        const result = checkPasswordStrength(password);

        // Update progress bar
        strengthBar.style.width = result.width + "%";
        strengthBar.className = "progress-bar " + result.color;

        // Update text
        strengthText.textContent = result.text;

        // Update text color based on strength
        if (result.width === 0) {
            strengthText.className = "text-muted";
        } else if (result.width <= 50) {
            strengthText.className = "text-danger";
        } else if (result.width <= 75) {
            strengthText.className = "text-warning";
        } else {
            strengthText.className = "text-success";
        }
    }

    /**
     * Validates password against all requirements
     * @param {HTMLElement} input - Password input field
     * @returns {boolean} - True if valid, false if invalid
     */
    function validatePassword(input) {
        const password = input.value;
        const result = checkPasswordStrength(password);

        if (password === "") {
            showError(input, "Password is required");
            return false;
        }

        if (password.length < 8) {
            showError(input, "Password must be at least 8 characters long");
            return false;
        }

        if (!result.requirements.uppercase) {
            showError(input, "Password must contain at least one uppercase letter");
            return false;
        }

        if (!result.requirements.lowercase) {
            showError(input, "Password must contain at least one lowercase letter");
            return false;
        }

        if (!result.requirements.number) {
            showError(input, "Password must contain at least one number");
            return false;
        }

        // All requirements met
        showSuccess(input);
        return true;
    }

    // ==========================================
    // SIGN UP PASSWORD STRENGTH INDICATOR
    // ==========================================

    const signupPassword = document.getElementById("signupPassword");

    if (signupPassword) {
        // Update strength indicator in real-time as user types
        signupPassword.addEventListener("input", function() {
            updatePasswordStrength(this.value);
        });

        // Validate on blur (when user leaves the field)
        signupPassword.addEventListener("blur", function() {
            if (this.value.trim() !== "") {
                validatePassword(this);
            }
        });

        // Clear validation when field is empty
        signupPassword.addEventListener("focus", function() {
            if (this.value === "") {
                clearValidation(this);
                updatePasswordStrength("");
            }
        });
    }

    // ==========================================
    // LOGIN PASSWORD VALIDATION (Basic)
    // ==========================================

    const loginPassword = document.getElementById("loginPassword");

    if (loginPassword) {
        // Just check if password is not empty
        loginPassword.addEventListener("blur", function() {
            const password = this.value.trim();

            if (password === "") {
                showError(this, "Password is required");
            } else {
                showSuccess(this);
            }
        });

        loginPassword.addEventListener("input", function() {
            if (this.classList.contains("is-invalid") && this.value.trim() !== "") {
                showSuccess(this);
            }
        });
    }

    // ==========================================
    // CONFIRM PASSWORD VALIDATION
    // ==========================================

    const signupConfirmPassword = document.getElementById(
        "signupConfirmPassword"
    );

    if (signupConfirmPassword && signupPassword) {
        signupConfirmPassword.addEventListener("blur", function() {
            const password = signupPassword.value;
            const confirmPassword = this.value;

            if (confirmPassword === "") {
                showError(this, "Please confirm your password");
            } else if (password !== confirmPassword) {
                showError(this, "Passwords do not match");
            } else {
                showSuccess(this);
            }
        });

        // Real-time validation
        signupConfirmPassword.addEventListener("input", function() {
            if (
                this.classList.contains("is-invalid") ||
                this.classList.contains("is-valid")
            ) {
                const password = signupPassword.value;
                const confirmPassword = this.value;

                if (confirmPassword === "") {
                    clearValidation(this);
                } else if (password === confirmPassword) {
                    showSuccess(this);
                } else {
                    showError(this, "Passwords do not match");
                }
            }
        });
    }

    // ==========================================
    // FORM SUBMISSION HANDLERS (Temporary)
    // ==========================================
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Hide any previous alerts
            hideAlert("loginAlert");

            // Get form fields
            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const submitButton = this.querySelector('button[type="submit"]');

            let isValid = true;

            // Validate email
            const email = emailInput.value.trim();
            if (email === "") {
                showError(emailInput, "Email address is required");
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(
                    emailInput,
                    "Please enter a valid email address (e.g., user@example.com)"
                );
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            // Validate password
            const password = passwordInput.value.trim();
            if (password === "") {
                showError(passwordInput, "Password is required");
                isValid = false;
            } else {
                showSuccess(passwordInput);
            }

            // If validation fails, show alert and stop
            if (!isValid) {
                showAlert(
                    "loginAlert",
                    "Please fix the errors above before submitting.",
                    "danger"
                );
                return;
            }

            // All valid - simulate login process
            setButtonLoading(submitButton);

            // Simulate API call (2 seconds delay)
            setTimeout(function() {
                removeButtonLoading(submitButton);

                // Show success message
                showAlert(
                    "loginAlert",
                    "Login successful! Redirecting to dashboard...",
                    "success"
                );

                console.log("Login Form Data:", {
                    email: email,
                    password: password,
                    rememberMe: document.getElementById("rememberMe").checked,
                });

                // In a real app, you would redirect here:
                // window.location.href = 'dashboard.html';
            }, 2000);
        });
    }

    // Sign Up Form Submission
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Hide any previous alerts
            hideAlert("signupAlert");

            // Get form fields
            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById(
                "signupConfirmPassword"
            );
            const termsCheckbox = document.getElementById("acceptTerms");
            const submitButton = this.querySelector('button[type="submit"]');

            let isValid = true;
            let errors = [];

            // Validate name
            const name = nameInput.value.trim();
            if (name === "") {
                showError(nameInput, "Full name is required");
                errors.push("Full name is required");
                isValid = false;
            } else if (name.length < 2) {
                showError(nameInput, "Name must be at least 2 characters long");
                errors.push("Name must be at least 2 characters long");
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError(nameInput, "Name can only contain letters and spaces");
                errors.push("Name can only contain letters and spaces");
                isValid = false;
            } else {
                showSuccess(nameInput);
            }

            // Validate email
            const email = emailInput.value.trim();
            if (email === "") {
                showError(emailInput, "Email address is required");
                errors.push("Email address is required");
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(
                    emailInput,
                    "Please enter a valid email address (e.g., user@example.com)"
                );
                errors.push("Please enter a valid email address");
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            // Validate password
            const password = passwordInput.value;
            const passwordValidation = validatePassword(passwordInput);
            if (!passwordValidation) {
                errors.push("Password does not meet requirements");
                isValid = false;
            }

            // Validate confirm password
            const confirmPassword = confirmPasswordInput.value;
            if (confirmPassword === "") {
                showError(confirmPasswordInput, "Please confirm your password");
                errors.push("Please confirm your password");
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(confirmPasswordInput, "Passwords do not match");
                errors.push("Passwords do not match");
                isValid = false;
            } else {
                showSuccess(confirmPasswordInput);
            }

            // Validate terms checkbox
            if (!termsCheckbox.checked) {
                errors.push("You must accept the Terms & Conditions");
                termsCheckbox.classList.add("is-invalid");
                isValid = false;
            } else {
                termsCheckbox.classList.remove("is-invalid");
            }

            // If validation fails, show alert and stop
            if (!isValid) {
                showAlert(
                    "signupAlert",
                    "Please fix the errors above before submitting.",
                    "danger"
                );
                return;
            }

            // All valid - simulate signup process
            setButtonLoading(submitButton);

            // Simulate API call (2 seconds delay)
            setTimeout(function() {
                removeButtonLoading(submitButton);

                // Show success message
                showAlert(
                    "signupAlert",
                    "Account created successfully! Redirecting to dashboard...",
                    "success"
                );

                console.log("Sign Up Form Data:", {
                    name: name,
                    email: email,
                    password: password,
                    acceptedTerms: termsCheckbox.checked,
                });

                // In a real app, you would redirect here:
                // window.location.href = 'dashboard.html';
            }, 2000);
        });
    }

    // Forgot Password Form handler
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", function(e) {
            e.preventDefault();

            // Show success message
            const successMessage = document.getElementById("resetSuccessMessage");
            if (successMessage) {
                successMessage.classList.remove("d-none");
            }

            console.log("Password reset link requested");

            // Hide success message after 5 seconds
            setTimeout(function() {
                if (successMessage) {
                    successMessage.classList.add("d-none");
                }
            }, 5000);
        });
    }

    // ==========================================
    // NEW: PLACEHOLDER INTERACTION HANDLERS
    // ==========================================

    /**
     * Universal handler for all placeholder buttons and links.
     * This is where we add the social login redirection logic.
     * @param {Event} e - The click event.
     * @param {string} type - The type of interaction (e.g., 'Google Login', 'Privacy Policy').
     */
    function handlePlaceholderClick(e, type) {
        e.preventDefault();

        // Social Login Redirection Logic
        if (type.includes('Google')) {
            // Redirect to Google's sign-in page (using a safe external link)
            window.open('https://accounts.google.com/signin', '_blank');
            console.log(`Placeholder Action: Redirecting to Google Sign-In.`);
            return; // Stop further processing
        } else if (type.includes('Facebook')) {
            // Redirect to Facebook's login page (using a safe external link)
            window.open('https://www.facebook.com/login/', '_blank');
            console.log(`Placeholder Action: Redirecting to Facebook Login.`);
            return; // Stop further processing
        }

        // Policy Links and other non-redirecting actions
        console.log(`Placeholder Action: Clicked "${type}". Actual content or modal needed.`);

        // Visual feedback for non-redirecting buttons/links (optional, for aesthetics)
        const target = e.currentTarget;
        if (target.tagName === 'BUTTON') {
            setButtonLoading(target);
            setTimeout(() => removeButtonLoading(target), 1000);
        } else {
            // For links, simply scroll up to simulate a page action
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // --- Login Tab Handlers ---
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', (e) => handlePlaceholderClick(e, 'Google Login'));
    }

    const facebookLoginBtn = document.getElementById('facebookLoginBtn');
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', (e) => handlePlaceholderClick(e, 'Facebook Login'));
    }

    // --- Sign Up Tab Handlers (Social & Policy) ---
    const googleSignupBtn = document.getElementById('googleSignupBtn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', (e) => handlePlaceholderClick(e, 'Google Sign Up'));
    }

    const facebookSignupBtn = document.getElementById('facebookSignupBtn');
    if (facebookSignupBtn) {
        facebookSignupBtn.addEventListener('click', (e) => handlePlaceholderClick(e, 'Facebook Sign Up'));
    }

    const termsLink = document.getElementById('termsLink');
    if (termsLink) {
        // Note: Policy links are simply logging the action for now, they don't redirect externally
        termsLink.addEventListener('click', (e) => handlePlaceholderClick(e, 'Terms & Conditions Link'));
    }

    const privacyLink = document.getElementById('privacyLink');
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => handlePlaceholderClick(e, 'Privacy Policy Link (in form)'));
    }

    // --- Footer Policy Links Handlers ---
    const privacyPolicyLink = document.getElementById('privacyPolicyLink');
    if (privacyPolicyLink) {
        privacyPolicyLink.addEventListener('click', (e) => handlePlaceholderClick(e, 'Privacy Policy Link (footer)'));
    }

    const termsOfServiceLink = document.getElementById('termsOfServiceLink');
    if (termsOfServiceLink) {
        termsOfServiceLink.addEventListener('click', (e) => handlePlaceholderClick(e, 'Terms of Service Link (footer)'));
    }

    // ==========================================
    // CONSOLE LOG SUMMARY
    // ==========================================

    console.log("📍 Password toggle initialized");
    console.log("📝 Form handlers ready");
    console.log("✉️  Email validation active");
    console.log("🔒 Password strength validation active");
    console.log("🔗 Placeholder social/policy handlers active");
    console.log("⏳ Full form validation will be added in Commit 17");
});