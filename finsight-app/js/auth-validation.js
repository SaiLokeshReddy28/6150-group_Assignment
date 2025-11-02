/**
 * Finsight - Authentication Validation with localStorage
 * Progressive field enabling: Fields → Terms Checkbox → Submit Button
 * Authors: Keerthi Chandrakanth, Kottapally Manasvini
 */
document.addEventListener("DOMContentLoaded", function () {
    
    console.log("✅ Authentication JavaScript loaded successfully!");

    // ==========================================
    // SESSION CHECK - NO AUTO-REDIRECT OR MESSAGES
    // ==========================================
    
    // Note: We don't check for existing sessions on login page
    // Users can always access login page and login with any registered account
    // This allows:
    // - Testing multiple accounts
    // - Multiple users on same device
    // - Manual logout/login flow
    
    console.log('✅ Login page ready - no session restrictions');

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

    function hasRepeatedCharacters(str, maxRepeat = 3) {
        const regex = new RegExp(`(.)\\1{${maxRepeat},}`);
        return regex.test(str);
    }

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
    // localStorage HELPER FUNCTIONS
    // ==========================================

    /**
     * Get all users from localStorage
     */
    function getAllUsers() {
        try {
            const users = localStorage.getItem('finsight_users');
            return users ? JSON.parse(users) : [];
        } catch (e) {
            console.error('Error reading users from localStorage:', e);
            return [];
        }
    }

    /**
     * Save users to localStorage
     */
    function saveUsers(users) {
        try {
            localStorage.setItem('finsight_users', JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('Error saving users to localStorage:', e);
            return false;
        }
    }

    /**
     * Check if email already exists
     */
    function emailExists(email) {
        const users = getAllUsers();
        return users.some(user => user.email.toLowerCase() === email.toLowerCase());
    }

    /**
     * Save current user session
     */
    function saveUserSession(user, rememberMe = false) {
        try {
            const sessionData = {
                email: user.email,
                name: user.name,
                title: user.title,
                loggedInAt: new Date().toISOString(),
                rememberMe: rememberMe
            };
            
            localStorage.setItem('finsight_currentUser', JSON.stringify(sessionData));
            console.log('✅ User session saved:', user.email);
            return true;
        } catch (e) {
            console.error('Error saving user session:', e);
            return false;
        }
    }

    /**
     * Validate login credentials
     */
    function validateCredentials(email, password) {
        const users = getAllUsers();
        const user = users.find(u => 
            u.email.toLowerCase() === email.toLowerCase() && 
            u.password === password
        );
        return user || null;
    }

    /**
     * Register new user
     */
    function registerUser(userData) {
        const users = getAllUsers();
        
        // Check if email already exists
        if (emailExists(userData.email)) {
            return {
                success: false,
                message: 'An account with this email already exists.'
            };
        }
        
        // Add new user
        const newUser = {
            title: userData.title,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            countryCode: userData.countryCode,
            age: userData.age,
            gender: userData.gender,
            password: userData.password, // In production: hash this!
            createdAt: new Date().toISOString(),
            id: Date.now().toString() // Simple ID generation
        };
        
        users.push(newUser);
        
        if (saveUsers(users)) {
            console.log('✅ User registered:', newUser.email);
            return {
                success: true,
                user: newUser
            };
        } else {
            return {
                success: false,
                message: 'Failed to save user data. Please try again.'
            };
        }
    }

    // ==========================================
    // PASSWORD STRENGTH VALIDATION
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

        if (feedback.requirements.length) strength += 20;
        if (feedback.requirements.uppercase) strength += 20;
        if (feedback.requirements.lowercase) strength += 20;
        if (feedback.requirements.number) strength += 20;
        if (feedback.requirements.special) strength += 20;

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

        if (hasRepeatedCharacters(password, 3)) {
            showError(input, "Password cannot contain 4 or more repeated characters");
            return false;
        }

        if (hasSequentialCharacters(password, 4)) {
            showError(input, "Password cannot contain sequential characters (e.g., '1234')");
            return false;
        }

        if (isCommonPassword(password)) {
            showError(input, "This password is too common. Please choose a more unique password");
            return false;
        }

        showSuccess(input);
        return true;
    }

    // ==========================================
    // LOGIN FORM - SMART PROGRESSIVE ENABLING
    // ==========================================

    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const loginTermsCheckbox = document.getElementById("acceptLoginTerms");
    const loginSubmitBtn = document.getElementById("loginSubmitBtn");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    function checkLoginFormValidity() {
        const emailValid = loginEmail && loginEmail.classList.contains("is-valid");
        const passwordValid = loginPassword && loginPassword.classList.contains("is-valid");
        
        if (loginSubmitBtn) {
            const allFieldsValid = emailValid && passwordValid;
            const termsChecked = loginTermsCheckbox && loginTermsCheckbox.checked;
            
            loginSubmitBtn.disabled = !(allFieldsValid && termsChecked);
        }
    }

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
            checkLoginFormValidity();
        });

        loginEmail.addEventListener("input", function () {
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
            checkLoginFormValidity();
        });
    }

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
            checkLoginFormValidity();
        });

        loginPassword.addEventListener("input", function () {
            if (this.value.length > 128) {
                this.value = this.value.substring(0, 128);
            }
            
            if (this.classList.contains("is-invalid") && this.value.trim() !== "") {
                if (this.value.trim().length >= 6 && this.value.trim().length <= 128) {
                    showSuccess(this);
                }
            }
            checkLoginFormValidity();
        });
    }

    if (loginTermsCheckbox) {
        loginTermsCheckbox.addEventListener("change", function() {
            checkLoginFormValidity();
        });
    }

    // ==========================================
    // SIGNUP FORM - SMART PROGRESSIVE ENABLING
    // ==========================================

    const signupTitle = document.getElementsByName("signupTitle");
    const signupName = document.getElementById("signupName");
    const signupEmail = document.getElementById("signupEmail");
    const signupPhone = document.getElementById("signupPhone");
    const signupAge = document.getElementById("signupAge");
    const signupGender = document.getElementById("signupGender");
    const signupPassword = document.getElementById("signupPassword");
    const signupConfirmPassword = document.getElementById("signupConfirmPassword");
    const signupTermsCheckbox = document.getElementById("acceptTerms");
    const signupSubmitBtn = document.getElementById("signupSubmitBtn");
    const termsHelpText = document.getElementById("termsHelpText");

    function checkSignupFormValidity() {
        const titleSelected = Array.from(signupTitle).some(radio => radio.checked);
        const nameValid = signupName && signupName.classList.contains("is-valid");
        const emailValid = signupEmail && signupEmail.classList.contains("is-valid");
        const phoneValid = signupPhone && signupPhone.classList.contains("is-valid");
        const ageValid = signupAge && signupAge.classList.contains("is-valid");
        const genderValid = signupGender && signupGender.classList.contains("is-valid");
        const passwordValid = signupPassword && signupPassword.classList.contains("is-valid");
        const confirmPasswordValid = signupConfirmPassword && signupConfirmPassword.classList.contains("is-valid");
        
        const allFieldsValid = titleSelected && nameValid && emailValid && phoneValid && 
                               ageValid && genderValid && passwordValid && confirmPasswordValid;
        
        if (signupTermsCheckbox) {
            signupTermsCheckbox.disabled = !allFieldsValid;
            
            if (termsHelpText) {
                if (allFieldsValid) {
                    termsHelpText.innerHTML = '<i class="fas fa-check-circle me-1 text-success"></i>All fields valid! You can now accept the terms.';
                    termsHelpText.className = 'text-success d-block mt-1 small';
                } else {
                    termsHelpText.innerHTML = '<i class="fas fa-info-circle me-1"></i>Fill all required fields to enable this checkbox';
                    termsHelpText.className = 'text-muted d-block mt-1 small';
                }
            }
        }
        
        if (signupSubmitBtn) {
            const termsChecked = signupTermsCheckbox && signupTermsCheckbox.checked;
            signupSubmitBtn.disabled = !(allFieldsValid && termsChecked);
        }
    }

    // Title radio buttons validation
    if (signupTitle.length > 0) {
        signupTitle.forEach(radio => {
            radio.addEventListener("change", function() {
                console.log("Title selected:", this.value);
                checkSignupFormValidity();
            });
        });
    }

    // Signup name validation
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
            checkSignupFormValidity();
        });

        signupName.addEventListener("input", function () {
            if (this.value.length > 50) {
                this.value = this.value.substring(0, 50);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const name = this.value.trim();
                if (name === "") {
                    clearValidation(this);
                } else if (name.length >= 3 && name.length <= 50 && /^[a-zA-Z\s]+$/.test(name) && !hasRepeatedCharacters(name, 3) && !/\s{2,}/.test(name)) {
                    showSuccess(this);
                }
            }
            checkSignupFormValidity();
        });
    }

    // Signup email validation
    if (signupEmail) {
        signupEmail.addEventListener("blur", function () {
            const email = this.value.trim();
            
            if (email === "") {
                showError(this, "Email address is required");
            } else if (email.length > 100) {
                showError(this, "Email is too long (maximum 100 characters)");
            } else if (!isValidEmail(email)) {
                showError(this, "Please enter a valid email address");
            } else if (emailExists(email)) {
                showError(this, "An account with this email already exists");
            } else {
                showSuccess(this);
            }
            checkSignupFormValidity();
        });

        signupEmail.addEventListener("input", function () {
            if (this.value.length > 100) {
                this.value = this.value.substring(0, 100);
            }
            
            if (this.classList.contains("is-invalid") || this.classList.contains("is-valid")) {
                const email = this.value.trim();
                if (email === "") {
                    clearValidation(this);
                } else if (isValidEmail(email) && email.length <= 100 && !emailExists(email)) {
                    showSuccess(this);
                }
            }
            checkSignupFormValidity();
        });
    }

    // Phone formatting and validation
    const countryCodeSelect = document.getElementById('countryCode');

    function formatPhoneNumber(value, countryCode) {
        const cleaned = value.replace(/\D/g, '');
        
        if (countryCode === '+1') {
            if (cleaned.length <= 3) {
                return cleaned;
            } else if (cleaned.length <= 6) {
                return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
            } else {
                return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
            }
        } else if (countryCode === '+91') {
            if (cleaned.length <= 5) {
                return cleaned;
            } else {
                return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
            }
        } else if (countryCode === '+44') {
            if (cleaned.length <= 4) {
                return cleaned;
            } else {
                return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)}`;
            }
        } else {
            return cleaned.slice(0, 15);
        }
    }

    function validatePhoneByCountry(phone, countryCode) {
        const cleaned = phone.replace(/\D/g, '');
        
        const rules = {
            '+1': { length: 10, name: 'US' },
            '+91': { length: 10, name: 'India' },
            '+44': { length: 10, name: 'UK' },
            '+86': { length: 11, name: 'China' },
            '+81': { length: 10, name: 'Japan' },
            '+82': { length: 10, name: 'Korea' },
            '+61': { length: 9, name: 'Australia' },
            '+49': { length: 10, name: 'Germany' },
            '+33': { length: 9, name: 'France' },
            '+39': { length: 10, name: 'Italy' },
            '+34': { length: 9, name: 'Spain' },
            '+7': { length: 10, name: 'Russia' },
            '+55': { length: 11, name: 'Brazil' },
            '+52': { length: 10, name: 'Mexico' },
            '+27': { length: 9, name: 'South Africa' }
        };
        
        const rule = rules[countryCode] || { length: 10, name: 'selected country' };
        
        return {
            isValid: cleaned.length === rule.length,
            expectedLength: rule.length,
            countryName: rule.name,
            cleaned: cleaned
        };
    }

    if (signupPhone) {
        signupPhone.addEventListener("input", function () {
            const countryCode = countryCodeSelect ? countryCodeSelect.value : '+1';
            const formatted = formatPhoneNumber(this.value, countryCode);
            this.value = formatted;
            checkSignupFormValidity();
        });

        signupPhone.addEventListener("blur", function () {
            const countryCode = countryCodeSelect ? countryCodeSelect.value : '+1';
            const validation = validatePhoneByCountry(this.value, countryCode);
            
            if (this.value.trim() === "") {
                showError(this, "Phone number is required");
            } else if (!validation.isValid) {
                showError(this, `Phone number for ${validation.countryName} must be ${validation.expectedLength} digits`);
            } else if (hasRepeatedCharacters(validation.cleaned, 5)) {
                showError(this, "Phone number cannot contain 6 or more repeated digits");
            } else if (hasSequentialCharacters(validation.cleaned, 6)) {
                showError(this, "Phone number cannot be sequential");
            } else {
                showSuccess(this);
            }
            checkSignupFormValidity();
        });
    }

    if (countryCodeSelect && signupPhone) {
        countryCodeSelect.addEventListener('change', function() {
            if (signupPhone.value.trim() !== "") {
                const cleaned = signupPhone.value.replace(/\D/g, '');
                signupPhone.value = cleaned;
                signupPhone.dispatchEvent(new Event('blur'));
            }
        });
    }

    // Age validation
    if (signupAge) {
        signupAge.addEventListener("blur", function () {
            const age = parseInt(this.value);
            
            if (this.value === "") {
                showError(this, "Age is required");
            } else if (age < 18) {
                showError(this, "You must be at least 18 years old");
            } else if (age > 120) {
                showError(this, "Please enter a valid age (maximum 120)");
            } else {
                showSuccess(this);
            }
            checkSignupFormValidity();
        });

        signupAge.addEventListener("input", function () {
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
            checkSignupFormValidity();
        });
    }

    // Gender validation
    if (signupGender) {
        signupGender.addEventListener("change", function () {
            if (this.value === "") {
                showError(this, "Please select your gender");
            } else {
                showSuccess(this);
            }
            checkSignupFormValidity();
        });
    }

    // Password validation
    if (signupPassword) {
        signupPassword.addEventListener("input", function () {
            if (this.value.length > 128) {
                this.value = this.value.substring(0, 128);
            }
            updatePasswordStrength(this.value);
            checkSignupFormValidity();
        });

        signupPassword.addEventListener("blur", function () {
            if (this.value.trim() !== "") {
                validateStrictPassword(this);
            }
            checkSignupFormValidity();
        });

        signupPassword.addEventListener("focus", function () {
            if (this.value === "") {
                clearValidation(this);
                updatePasswordStrength("");
            }
        });
    }

    // Confirm password validation
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
            checkSignupFormValidity();
        });

        signupConfirmPassword.addEventListener("input", function () {
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
            checkSignupFormValidity();
        });
    }

    // Terms checkbox
    if (signupTermsCheckbox) {
        signupTermsCheckbox.addEventListener("change", function() {
            checkSignupFormValidity();
        });
    }

    // ==========================================
    // LOGIN FORM SUBMISSION WITH localStorage
    // ==========================================

    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("loginAlert");

            const emailInput = document.getElementById("loginEmail");
            const passwordInput = document.getElementById("loginPassword");
            const termsCheckbox = document.getElementById("acceptLoginTerms");
            const submitButton = document.getElementById("loginSubmitBtn");
            const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

            let isValid = true;

            const email = emailInput.value.trim();
            if (email === "" || email.length > 100 || !isValidEmail(email)) {
                if (email === "") showError(emailInput, "Email address is required");
                else if (email.length > 100) showError(emailInput, "Email is too long");
                else showError(emailInput, "Please enter a valid email address");
                isValid = false;
            } else {
                showSuccess(emailInput);
            }

            const password = passwordInput.value.trim();
            if (password === "" || password.length < 6 || password.length > 128) {
                if (password === "") showError(passwordInput, "Password is required");
                else if (password.length < 6) showError(passwordInput, "Password must be at least 6 characters");
                else showError(passwordInput, "Password is too long");
                isValid = false;
            } else {
                showSuccess(passwordInput);
            }

            if (!termsCheckbox.checked) {
                showAlert("loginAlert", "You must accept the Terms & Conditions", "warning");
                isValid = false;
            }

            if (!isValid) {
                showAlert("loginAlert", "Please fix the errors above", "danger");
                return;
            }

            // Validate credentials from localStorage
            setButtonLoading(submitButton);

            setTimeout(function () {
                const user = validateCredentials(email, password);
                
                if (user) {
                    // Valid credentials - user exists in localStorage
                    saveUserSession(user, rememberMe);
                    
                    removeButtonLoading(submitButton);
                    showAlert("loginAlert", `✅ Welcome back, ${user.name}! Redirecting to dashboard...`, "success");
                    console.log("✅ Login successful:", { email: user.email });

                    setTimeout(function() {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    // Invalid credentials - either email doesn't exist or password is wrong
                    const users = getAllUsers();
                    const emailExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
                    
                    removeButtonLoading(submitButton);
                    
                    if (!emailExists) {
                        // Email not registered
                        showAlert("loginAlert", "❌ Email not registered. Please sign up first!", "danger");
                        console.log("❌ Login failed: Email not found");
                        
                        // Highlight the email field
                        showError(emailInput, "This email is not registered");
                    } else {
                        // Email exists but password is wrong
                        showAlert("loginAlert", "❌ Incorrect password. Please try again.", "danger");
                        console.log("❌ Login failed: Incorrect password");
                        
                        // Highlight the password field
                        showError(passwordInput, "Incorrect password");
                    }
                }
            }, 1000);
        });
    }

    // ==========================================
    // SIGNUP FORM SUBMISSION WITH localStorage
    // ==========================================

    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();
            hideAlert("signupAlert");

            const titleInput = document.querySelector('input[name="signupTitle"]:checked');
            const nameInput = document.getElementById("signupName");
            const emailInput = document.getElementById("signupEmail");
            const phoneInput = document.getElementById("signupPhone");
            const ageInput = document.getElementById("signupAge");
            const genderInput = document.getElementById("signupGender");
            const passwordInput = document.getElementById("signupPassword");
            const confirmPasswordInput = document.getElementById("signupConfirmPassword");
            const termsCheckbox = document.getElementById("acceptTerms");
            const submitButton = document.getElementById("signupSubmitBtn");

            let isValid = true;

            if (!titleInput) {
                showAlert("signupAlert", "Please select your title (Mr./Ms./Mrs./Dr./Prof.)", "danger");
                isValid = false;
            }

            if (!nameInput.classList.contains("is-valid")) isValid = false;
            if (!emailInput.classList.contains("is-valid")) isValid = false;
            if (!phoneInput.classList.contains("is-valid")) isValid = false;
            if (!ageInput.classList.contains("is-valid")) isValid = false;
            if (!genderInput.classList.contains("is-valid")) isValid = false;
            if (!passwordInput.classList.contains("is-valid")) isValid = false;
            if (!confirmPasswordInput.classList.contains("is-valid")) isValid = false;

            if (!termsCheckbox.checked) {
                showAlert("signupAlert", "You must accept the Terms & Conditions", "warning");
                isValid = false;
            }

            if (!isValid) {
                showAlert("signupAlert", "Please fix the errors above", "danger");
                return;
            }

            // Register user in localStorage
            setButtonLoading(submitButton);

            setTimeout(function () {
                const userData = {
                    title: titleInput.value,
                    name: nameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    countryCode: countryCodeSelect ? countryCodeSelect.value : '+1',
                    age: parseInt(ageInput.value),
                    gender: genderInput.value,
                    password: passwordInput.value
                };

                const result = registerUser(userData);
                
                removeButtonLoading(submitButton);
                
                if (result.success) {
                    // Save user session
                    saveUserSession(result.user);
                    
                    showAlert("signupAlert", `✅ Welcome to Finsight, ${result.user.name}! Redirecting...`, "success");
                    console.log("Signup successful:", { email: result.user.email });

                    setTimeout(function() {
                        window.location.href = 'welcome.html';
                    }, 1500);
                } else {
                    showAlert("signupAlert", "❌ " + result.message, "danger");
                    console.log("Signup failed:", result.message);
                }
            }, 1000);
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

            const successMessage = document.getElementById("resetSuccessMessage");
            if (successMessage) {
                successMessage.classList.remove("d-none");
                
                setTimeout(function () {
                    successMessage.classList.add("d-none");
                    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                    if (modal) {
                        modal.hide();
                    }
                    forgotPasswordForm.reset();
                    clearValidation(emailInput);
                }, 3000);
            }

            console.log("Password reset requested for:", email);
        });
    }

    // ==========================================
    // SOCIAL LOGIN HANDLERS
    // ==========================================

    function handleSocialAuth(provider) {
        console.log(`${provider} authentication requested`);
        
        if (provider === 'Google') {
            window.open('https://accounts.google.com/signin', '_blank');
        } else if (provider === 'Facebook') {
            window.open('https://www.facebook.com/login/', '_blank');
        }
    }

    const googleLoginBtn = document.getElementById('googleLoginBtn');
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', function() {
            handleSocialAuth('Google');
        });
    }

    const facebookLoginBtn = document.getElementById('facebookLoginBtn');
    if (facebookLoginBtn) {
        facebookLoginBtn.addEventListener('click', function() {
            handleSocialAuth('Facebook');
        });
    }

    const googleSignupBtn = document.getElementById('googleSignupBtn');
    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            handleSocialAuth('Google');
        });
    }

    const facebookSignupBtn = document.getElementById('facebookSignupBtn');
    if (facebookSignupBtn) {
        facebookSignupBtn.addEventListener('click', function() {
            handleSocialAuth('Facebook');
        });
    }

    // ==========================================
    // CONSOLE LOG SUMMARY
    // ==========================================

    console.log("✅ localStorage authentication initialized");
    console.log("📦 Users stored in: finsight_users");
    console.log("🔐 Current session in: finsight_currentUser");
    console.log("✅ Title radio buttons initialized (Mr/Ms/Mrs/Dr/Prof)");
    console.log("✅ Progressive enabling: Fields → Terms Checkbox → Submit Button");
    console.log("✅ Login: Email + Password valid → Terms checkbox → Button enabled");
    console.log("✅ Signup: All 8 fields valid → Terms checkbox enabled → Check terms → Button enabled");
    console.log("🔵 Social login: Google and Facebook buttons → Open external auth");
    console.log("📱 International phone: 15 countries with auto-formatting");
    console.log("🇺🇸 US format: (555) 123-4567");
    console.log("🇮🇳 India format: 98765 43210");
    console.log("🔍 Password toggle initialized");
    console.log("✉️ Email validation (max 100 chars)");
    console.log("🎂 Age validation (18-120)");
    console.log("⚧️ Gender validation");
    console.log("👤 Name validation (3-50 chars, no repeated)");
    console.log("🔒 Password validation (8-128 chars, strict)");
    console.log("🔄 Redirects: Login → Dashboard, Signup → Welcome");
    
    // Log current localStorage state
    const users = getAllUsers();
    console.log(`📊 Total registered users: ${users.length}`);
});