/**
 * Finsight - Authentication Validation (COMPREHENSIVE VERSION)
 * Complete validation with industry best practices
 * Authors: Keerthi Chandrakanth, Kottapally Manasvini
 */
document.addEventListener("DOMContentLoaded", function () {
    
    console.log("✅ Authentication JavaScript loaded successfully!");

    // ==========================================
    // AUTO-OPEN SIGNUP TAB IF URL PARAMETER EXISTS
    // ==========================================
    
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'signup') {
        const signupTab = document.getElementById('signup-tab');
        if (signupTab) {
            const signupTabInstance = new bootstrap.Tab(signupTab);
            signupTabInstance.show();
        }
    } else if (tabParam === 'login') {
        const loginTab = document.getElementById('login-tab');
        if (loginTab) {
            const loginTabInstance = new bootstrap.Tab(loginTab);
            loginTabInstance.show();
        }
    }

    // ==========================================
    // PASSWORD TOGGLE FUNCTIONALITY
    // ==========================================

    const passwordToggles = document.querySelectorAll(".password-toggle");

    passwordToggles.forEach((button) => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-target");
            const input = document.getElementById(targetId);
            const icon = this.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    });

    // ==========================================
    // VALIDATION HELPER FUNCTIONS
    // ==========================================

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check for repeated characters (e.g., "aaaa", "1111")
     */
    function hasRepeatedCharacters(str, maxRepeat = 3) {
        const regex = new RegExp(`(.)\\1{${maxRepeat},}`);
        return regex.test(str);
    }

    /**
     * Check for sequential characters (e.g., "1234", "abcd")
     */
    function hasSequentialCharacters(str, minLength = 4) {
        for (let i = 0; i <= str.length - minLength; i++) {
            const chars = str.substring(i, i + minLength);
            let isSequential = true;
            
            for (let j = 1; j < chars.length; j++) {
                if (chars.charCodeAt(j) !== chars.charCodeAt(j - 1) + 1) {
                    isSequential = false;
                    break;
                }
            }
            
            if (isSequential) return true;
        }
        return false;
    }

    /**
     * Common/weak passwords list
     */
    const commonPasswords = [
        'password', 'password123', '12345678', 'qwerty', 'abc123',
        'password1', '123456789', 'letmein', 'welcome', 'admin123',
        'Password123', 'Password1', 'Welcome123'
    ];

    function isCommonPassword(password) {
        return commonPasswords.some(common => 
            password.toLowerCase().includes(common.toLowerCase())
        );
    }

    function showError(input, message) {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        const errorElement = input.closest(".mb-3").querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = "block";
        }
    }

    function showSuccess(input) {
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        const errorElement = input.closest(".mb-3").querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.style.display = "none";
        }
    }

    function clearValidation(input) {
        input.classList.remove("is-valid", "is-invalid");
        const errorElement = input.closest(".mb-3").querySelector(".invalid-feedback");
        if (errorElement) {
            errorElement.style.display = "none";
        }
    }

    function showAlert(alertId, message, type = "danger") {
        const alert = document.getElementById(alertId);
        const alertMessage = document.getElementById(alertId + "Message");

        if (alert && alertMessage) {
            alert.className = `alert alert-${type} alert-dismissible fade show`;
            alert.classList.remove("d-none");
            alertMessage.textContent = message;
            alert.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    function hideAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.classList.add("d-none");
        }
    }

    function setButtonLoading(button) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Loading...';
    }

    function removeButtonLoading(button) {
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    }

    // ==========================================
    // ENHANCED PASSWORD STRENGTH VALIDATION
    // ==========================================

    function checkPasswordStrength(password) {
        let strength = 0;
        const feedback = {
            score: 0,
            text: "",
            color: "",
            width: 0,
            requirements: {
                length: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
            }
        };

        // Calculate strength (20% for each requirement)
        if (feedback.requirements.length) strength += 20;
        if (feedback.requirements.uppercase) strength += 20;
        if (feedback.requirements.lowercase) strength += 20;
        if (feedback.requirements.number) strength += 20;
        if (feedback.requirements.special) strength += 20;

        // Set feedback based on strength
        if (strength === 0) {
            feedback.text = "Password strength";
            feedback.color = "";
            feedback.width = 0;
        } else if (strength <= 40) {
            feedback.text = "Weak password";
            feedback.color = "bg-danger";
            feedback.width = strength;
        } else if (strength <= 60) {
            feedback.text = "Fair password";
            feedback.color = "bg-warning";
            feedback.width = strength;
        } else if (strength <= 80) {
            feedback.text = "Good password";
            feedback.color = "bg-info";
            feedback.width = strength;
        } else {
            feedback.text = "Strong password";
            feedback.color = "bg-success";
            feedback.width = 100;
        }

        feedback.score = strength;
        return feedback;
    }

    function updatePasswordStrength(password) {
        const strengthBar = document.getElementById("passwordStrengthBar");
        const strengthText = document.getElementById("passwordStrengthText");

        if (!strengthBar || !strengthText) return;

        const result = checkPasswordStrength(password);

        strengthBar.style.width = result.width + "%";
        strengthBar.className = "progress-bar " + result.color;
        strengthText.textContent = result.text || "Password strength";

        if (result.width === 0) {
            strengthText.className = "text-muted small";
        } else if (result.width <= 50) {
            strengthText.className = "text-danger small";
        } else if (result.width <= 75) {
            strengthText.className = "text-warning small";
        } else {
            strengthText.className = "text-success small";
        }
    }

    function validateStrictPassword(input) {
        const password = input.value;
        const result = checkPasswordStrength(password);

        if (password === "") {
            showError(input, "Password is required");
            return false;
        }

        // Check maximum length
        if (password.length > 128) {
            showError(input, "Password is too long (maximum 128 characters)");
            return false;
        }

        if (!result.requirements.length) {
            showError(input, "Password must be at least 8 characters");
            return false;
        }

        if (!result.requirements.uppercase) {
            showError(input, "Password must contain at least one uppercase letter (A-Z)");
            return false;
        }

        if (!result.requirements.lowercase) {
            showError(input, "Password must contain at least one lowercase letter (a-z)");
            return false;
        }

        if (!result.requirements.number) {
            showError(input, "Password must contain at least one number (0-9)");
            return false;
        }

        if (!result.requirements.special) {
            showError(input, "Password must contain at least one special character (!@#$%^&*)");
            return false;
        }

        // Check for repeated characters
        if (hasRepeatedCharacters(password, 3)) {
            showError(input, "Password cannot contain 4 or more repeated characters (e.g., 'aaaa')");
            return false;
        }

        // Check for sequential characters
        if (hasSequentialCharacters(password, 4)) {
            showError(input, "Password cannot contain sequential characters (e.g., '1234', 'abcd')");
            return false;
        }

        // Check for common passwords
        if (isCommonPassword(password)) {
            showError(input, "This password is too common. Please choose a more unique password.");
            return false;
        }

        showSuccess(input);
        return true;
    }

    // ==========================================
    // LOGIN FORM - ENABLE BUTTON ON CHECKBOX
    // ==========================================

    const loginSubmitBtn = document.querySelector('#loginForm button[type="submit"]');
    const loginTermsCheckbox = document.getElementById("acceptLoginTerms");

    if (loginSubmitBtn && loginTermsCheckbox) {
        // Initially disable button
        loginSubmitBtn.disabled = true;

        // Enable/disable based on checkbox
        loginTermsCheckbox.addEventListener("change", function() {
            loginSubmitBtn.disabled = !this.checked;
            console.log('Login button', this.checked ? 'enabled' : 'disabled');
        });
    }

    // ==========================================
    // SIGNUP FORM - ENABLE BUTTON ON CHECKBOX
    // ==========================================

    const signupSubmitBtn = document.querySelector('#signupForm button[type="submit"]');
    const signupTermsCheckbox = document.getElementById("acceptTerms");

    if (signupSubmitBtn && signupTermsCheckbox) {
        // Initially disable button
        signupSubmitBtn.disabled = true;

        // Enable/disable based on checkbox
        signupTermsCheckbox.addEventListener("change", function() {
            signupSubmitBtn.disabled = !this.checked;
            console.log('Signup button', this.checked ? 'enabled' : 'disabled');
        });
    }

    // ==========================================
    // LOGIN EMAIL VALIDATION
    // ==========================================

    const loginEmail = document.getElementById("loginEmail");

    if (loginEmail) {
        loginEmail.addEventListener("blur", function () {
            const email = this.value.trim();
            
            if (email === "") {
                showError(this, "Email address is required");
            } else if (email.length > 100) {
                showError(this, "Email is too long (maximum 100 characters)");
            } else if (!isValidEmail(email)) {
                showError(this, "Please enter a valid email address");
            } else {
                showSuccess(this);
            }
        });

        loginEmail.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 100) {
                this.value = this.value.substring(0, 100);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const email = this.value.trim();
                if (email === "") {
                    clearValidation(this);
                } else if (isValidEmail(email) && email.length <= 100) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // LOGIN PASSWORD VALIDATION
    // ==========================================

    const loginPassword = document.getElementById("loginPassword");

    if (loginPassword) {
        loginPassword.addEventListener("blur", function () {
            const password = this.value.trim();
            
            if (password === "") {
                showError(this, "Password is required");
            } else if (password.length < 6) {
                showError(this, "Password must be at least 6 characters");
            } else if (password.length > 128) {
                showError(this, "Password is too long (maximum 128 characters)");
            } else {
                showSuccess(this);
            }
        });

        loginPassword.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 128) {
                this.value = this.value.substring(0, 128);
            }
            
            if (this.classList.contains("is-invalid") && this.value.trim() !== "") {
                if (this.value.trim().length >= 6 && this.value.trim().length <= 128) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // SIGNUP NAME VALIDATION (ENHANCED)
    // ==========================================

    const signupName = document.getElementById("signupName");

    if (signupName) {
        signupName.addEventListener("blur", function () {
            const name = this.value.trim();
            
            if (name === "") {
                showError(this, "Full name is required");
            } else if (name.length < 3) {
                showError(this, "Name must be at least 3 characters");
            } else if (name.length > 50) {
                showError(this, "Name is too long (maximum 50 characters)");
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError(this, "Name can only contain letters and spaces");
            } else if (hasRepeatedCharacters(name, 3)) {
                showError(this, "Name cannot contain 4 or more repeated characters");
            } else if (/\s{2,}/.test(name)) {
                showError(this, "Name cannot contain multiple consecutive spaces");
            } else {
                showSuccess(this);
            }
        });

        signupName.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 50) {
                this.value = this.value.substring(0, 50);
                showError(this, "Name is too long (maximum 50 characters)");
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const name = this.value.trim();
                if (name === "") {
                    clearValidation(this);
                } else if (name.length >= 3 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name) && !hasRepeatedCharacters(name, 3)) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // SIGNUP EMAIL VALIDATION (ENHANCED)
    // ==========================================

    const signupEmail = document.getElementById("signupEmail");

    if (signupEmail) {
        signupEmail.addEventListener("blur", function () {
            const email = this.value.trim();
            
            if (email === "") {
                showError(this, "Email address is required");
            } else if (email.length > 100) {
                showError(this, "Email is too long (maximum 100 characters)");
            } else if (!isValidEmail(email)) {
                showError(this, "Please enter a valid email address");
            } else {
                showSuccess(this);
            }
        });

        signupEmail.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 100) {
                this.value = this.value.substring(0, 100);
                showError(this, "Email is too long (maximum 100 characters)");
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const email = this.value.trim();
                if (email === "") {
                    clearValidation(this);
                } else if (isValidEmail(email) && email.length <= 100) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // SIGNUP PHONE VALIDATION (10 DIGITS)
    // ==========================================

    const signupPhone = document.getElementById("signupPhone");

    if (signupPhone) {
        signupPhone.addEventListener("blur", function () {
            const phone = this.value.trim();
            
            if (phone === "") {
                showError(this, "Phone number is required");
            } else if (!/^\d{10}$/.test(phone)) {
                showError(this, "Phone number must be exactly 10 digits");
            } else if (hasRepeatedCharacters(phone, 5)) {
                showError(this, "Phone number cannot contain 6 or more repeated digits (e.g., '1111111111')");
            } else if (hasSequentialCharacters(phone, 6)) {
                showError(this, "Phone number cannot be sequential (e.g., '1234567890')");
            } else {
                showSuccess(this);
            }
        });

        signupPhone.addEventListener("input", function () {
            // Only allow numbers and enforce max length
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 10) {
                this.value = this.value.substring(0, 10);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const phone = this.value.trim();
                if (phone === "") {
                    clearValidation(this);
                } else if (/^\d{10}$/.test(phone) && !hasRepeatedCharacters(phone, 5) && !hasSequentialCharacters(phone, 6)) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // SIGNUP AGE VALIDATION (18-120)
    // ==========================================

    const signupAge = document.getElementById("signupAge");

    if (signupAge) {
        signupAge.addEventListener("blur", function () {
            const age = parseInt(this.value);
            
            if (this.value === "") {
                showError(this, "Age is required");
            } else if (age < 18) {
                showError(this, "You must be at least 18 years old to use Finsight");
            } else if (age > 120) {
                showError(this, "Please enter a valid age (maximum 120)");
            } else {
                showSuccess(this);
            }
        });

        signupAge.addEventListener("input", function () {
            // Only allow numbers and enforce max length (3 digits)
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 3) {
                this.value = this.value.substring(0, 3);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const age = parseInt(this.value);
                if (this.value === "") {
                    clearValidation(this);
                } else if (age >= 18 && age <= 120) {
                    showSuccess(this);
                }
            }
        });
    }

    // ==========================================
    // SIGNUP GENDER VALIDATION
    // ==========================================

    const signupGender = document.getElementById("signupGender");

    if (signupGender) {
        signupGender.addEventListener("change", function () {
            if (this.value === "") {
                showError(this, "Please select your gender");
            } else {
                showSuccess(this);
            }
        });
    }

    // ==========================================
    // SIGNUP PASSWORD VALIDATION (STRICT)
    // ==========================================

    const signupPassword = document.getElementById("signupPassword");

    if (signupPassword) {
        signupPassword.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 128) {
                this.value = this.value.substring(0, 128);
            }
            updatePasswordStrength(this.value);
        });

        signupPassword.addEventListener("blur", function () {
            if (this.value.trim() !== "") {
                validateStrictPassword(this);
            }
        });

        signupPassword.addEventListener("focus", function () {
            if (this.value === "") {
                clearValidation(this);
                updatePasswordStrength("");
            }
        });
    }

    // ==========================================
    // CONFIRM PASSWORD VALIDATION
    // ==========================================

    const signupConfirmPassword = document.getElementById("signupConfirmPassword");

    if (signupConfirmPassword && signupPassword) {
        signupConfirmPassword.addEventListener("blur", function () {
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

        signupConfirmPassword.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 128) {
                this.value = this.value.substring(0, 128);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
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
    // LOGIN FORM SUBMISSION
    // ==========================================

    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("loginAlert");

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const termsCheckbox = document.getElementById("acceptLoginTerms");
            const submitButton = this.querySelector('button[type="submit"]');

            let isValid = true;

            // Validate email
            const email = emailInput.value.trim();
            if (email === "") {
                showError(emailInput, "Email address is required");
                isValid = false;
            } else if (email.length > 100) {
                showError(emailInput, "Email is too long (maximum 100 characters)");
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(emailInput, "Please enter a valid email address");
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            // Validate password
            const password = passwordInput.value.trim();
            if (password === "") {
                showError(passwordInput, "Password is required");
                isValid = false;
            } else if (password.length < 6) {
                showError(passwordInput, "Password must be at least 6 characters");
                isValid = false;
            } else if (password.length > 128) {
                showError(passwordInput, "Password is too long (maximum 128 characters)");
                isValid = false;
            } else {
                showSuccess(passwordInput);
            }

            // Validate terms
            if (!termsCheckbox.checked) {
                showAlert("loginAlert", "You must accept the Terms & Conditions to continue.", "warning");
                isValid = false;
            }

            if (!isValid) {
                showAlert("loginAlert", "Please fix the errors above before submitting.", "danger");
                return;
            }

            // All valid - simulate login
            setButtonLoading(submitButton);

            setTimeout(function () {
                removeButtonLoading(submitButton);
                
                // Show success message
                showAlert("loginAlert", "✅ Login successful! Redirecting to dashboard...", "success");

                console.log("Login successful:", { email, password });

                // Redirect to DASHBOARD after 1 second
                setTimeout(function() {
                    window.location.href = 'dashboard.html';
                }, 1000);
            }, 1500);
        });
    }

    // ==========================================
    // SIGNUP FORM SUBMISSION
    // ==========================================

    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("signupAlert");

            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const phoneInput = document.getElementById("signupPhone");
            const ageInput = document.getElementById("signupAge");
            const genderInput = document.getElementById("signupGender");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById("signupConfirmPassword");
            const termsCheckbox = document.getElementById("acceptTerms");
            const submitButton = this.querySelector('button[type="submit"]');

            let isValid = true;

            // Validate name
            const name = nameInput.value.trim();
            if (name === "") {
                showError(nameInput, "Full name is required");
                isValid = false;
            } else if (name.length < 3) {
                showError(nameInput, "Name must be at least 3 characters");
                isValid = false;
            } else if (name.length > 50) {
                showError(nameInput, "Name is too long (maximum 50 characters)");
                isValid = false;
            } else if (!/^[a-zA-Z\s]+$/.test(name)) {
                showError(nameInput, "Name can only contain letters and spaces");
                isValid = false;
            } else if (hasRepeatedCharacters(name, 3)) {
                showError(nameInput, "Name cannot contain 4 or more repeated characters");
                isValid = false;
            } else {
                showSuccess(nameInput);
            }

            // Validate email
            const email = emailInput.value.trim();
            if (email === "") {
                showError(emailInput, "Email address is required");
                isValid = false;
            } else if (email.length > 100) {
                showError(emailInput, "Email is too long (maximum 100 characters)");
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError(emailInput, "Please enter a valid email address");
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            // Validate phone
            const phone = phoneInput.value.trim();
            if (phone === "") {
                showError(phoneInput, "Phone number is required");
                isValid = false;
            } else if (!/^\d{10}$/.test(phone)) {
                showError(phoneInput, "Phone number must be exactly 10 digits");
                isValid = false;
            } else if (hasRepeatedCharacters(phone, 5)) {
                showError(phoneInput, "Phone number cannot contain 6 or more repeated digits");
                isValid = false;
            } else if (hasSequentialCharacters(phone, 6)) {
                showError(phoneInput, "Phone number cannot be sequential");
                isValid = false;
            } else {
                showSuccess(phoneInput);
            }

            // Validate age
            const age = parseInt(ageInput.value);
            if (ageInput.value === "") {
                showError(ageInput, "Age is required");
                isValid = false;
            } else if (age < 18) {
                showError(ageInput, "You must be at least 18 years old to use Finsight");
                isValid = false;
            } else if (age > 120) {
                showError(ageInput, "Please enter a valid age (maximum 120)");
                isValid = false;
            } else {
                showSuccess(ageInput);
            }

            // Validate gender
            const gender = genderInput.value;
            if (gender === "") {
                showError(genderInput, "Please select your gender");
                isValid = false;
            } else {
                showSuccess(genderInput);
            }

            // Validate password (strict - all checks)
            if (!validateStrictPassword(passwordInput)) {
                isValid = false;
            }

            // Validate confirm password
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            if (confirmPassword === "") {
                showError(confirmPasswordInput, "Please confirm your password");
                isValid = false;
            } else if (password !== confirmPassword) {
                showError(confirmPasswordInput, "Passwords do not match");
                isValid = false;
            } else {
                showSuccess(confirmPasswordInput);
            }

            // Validate terms
            if (!termsCheckbox.checked) {
                showAlert("signupAlert", "You must accept the Terms & Conditions to continue.", "warning");
                isValid = false;
            }

            if (!isValid) {
                showAlert("signupAlert", "Please fix the errors above before submitting.", "danger");
                return;
            }

            // All valid - simulate signup
            setButtonLoading(submitButton);

            setTimeout(function () {
                removeButtonLoading(submitButton);
                
                // Show success message
                showAlert("signupAlert", "✅ Account created successfully! Redirecting to welcome page...", "success");

                console.log("Signup successful:", { name, email, phone, age, gender });

                // Redirect to WELCOME PAGE after 1 second
                setTimeout(function() {
                    window.location.href = 'welcome.html';
                }, 1000);
            }, 1500);
        });
    }

    // ==========================================
    // FORGOT PASSWORD FORM
    // ==========================================

    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const resetEmail = document.getElementById("resetEmail");

    if (resetEmail) {
        resetEmail.addEventListener("blur", function () {
            const email = this.value.trim();
            
            if (email === "") {
                showError(this, "Email address is required");
            } else if (email.length > 100) {
                showError(this, "Email is too long (maximum 100 characters)");
            } else if (!isValidEmail(email)) {
                showError(this, "Please enter a valid email address");
            } else {
                showSuccess(this);
            }
        });

        resetEmail.addEventListener("input", function () {
            // Enforce max length
            if (this.value.length > 100) {
                this.value = this.value.substring(0, 100);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const email = this.value.trim();
                if (email === "") {
                    clearValidation(this);
                } else if (isValidEmail(email) && email.length <= 100) {
                    showSuccess(this);
                }
            }
        });
    }

    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const emailInput = document.getElementById("resetEmail");
            const email = emailInput.value.trim();

            if (email === "" || !isValidEmail(email) || email.length > 100) {
                showError(emailInput, "Please enter a valid email address");
                return;
            }

            showSuccess(emailInput);

            // Show success message
            const successMessage = document.getElementById("resetSuccessMessage");
            if (successMessage) {
                successMessage.classList.remove("d-none");
                
                setTimeout(function () {
                    successMessage.classList.add("d-none");
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                    if (modal) {
                        modal.hide();
                    }
                    // Reset form
                    forgotPasswordForm.reset();
                    clearValidation(emailInput);
                }, 3000);
            }

            console.log("Password reset requested for:", email);
        });
    }

    // ==========================================
    // CONSOLE LOG SUMMARY
    // ==========================================

    console.log("📍 Password toggle initialized");
    console.log("📝 Form handlers ready");
    console.log("✉️  Email validation active (max 100 chars)");
    console.log("📱 Phone validation active (exactly 10 digits, no repeated/sequential)");
    console.log("🎂 Age validation active (18-120 years, max 3 digits)");
    console.log("⚧️  Gender validation active");
    console.log("👤 Name validation active (3-50 chars, no repeated chars)");
    console.log("🔒 Password validation active (8-128 chars, with special char, no common/repeated/sequential)");
    console.log("✅ Button enable/disable on terms checkbox");
    console.log("🔄 Redirects: Login → Dashboard, Signup → Welcome");
    console.log("🎯 All comprehensive validations initialized successfully!");
});