/**
 * Finsight - Authentication Validation
 * Handles comprehensive form validation for login and signup pages
 * Enhanced with strict password requirements and forgot password flow
 * Author: Finsight Team
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // AUTO-OPEN SIGNUP TAB IF URL PARAMETER EXISTS
    // ==========================================
    
    // Check if URL has ?tab=signup or ?tab=login parameter
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam === 'signup') {
        // Activate signup tab
        const signupTab = document.getElementById('signup-tab');
        if (signupTab) {
            const signupTabInstance = new bootstrap.Tab(signupTab);
            signupTabInstance.show();
        }
    } else if (tabParam === 'login') {
        // Activate login tab (already default, but explicit)
        const loginTab = document.getElementById('login-tab');
        if (loginTab) {
            const loginTabInstance = new bootstrap.Tab(loginTab);
            loginTabInstance.show();
        }
    }
    
    // ==========================================
    // LOGIN FORM VALIDATION
    // ==========================================
    
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const loginSuccessAlert = document.getElementById('loginSuccessAlert');
    const loginErrorAlert = document.getElementById('loginErrorAlert');
    const loginErrorMessage = document.getElementById('loginErrorMessage');
    const agreeLoginTerms = document.getElementById('agreeLoginTerms');
    
    // Enable/Disable login button based on terms checkbox
    if (agreeLoginTerms) {
        agreeLoginTerms.addEventListener('change', function() {
            loginSubmitBtn.disabled = !this.checked;
        });
    }
    
    // Toggle password visibility for login
    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const type = loginPassword.type === 'password' ? 'text' : 'password';
            loginPassword.type = type;
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Real-time email validation for login
    loginEmail.addEventListener('input', function() {
        validateEmail(this);
    });
    
    // Real-time password validation for login
    loginPassword.addEventListener('input', function() {
        validatePasswordLength(this, 6);
    });
    
    // Login form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous alerts
        hideAlert(loginSuccessAlert);
        hideAlert(loginErrorAlert);
        
        // Validate form
        if (!loginForm.checkValidity()) {
            e.stopPropagation();
            loginForm.classList.add('was-validated');
            showAlert(loginErrorAlert, 'Please fill in all required fields correctly.');
            return;
        }
        
        // Additional custom validation
        if (!validateEmail(loginEmail)) {
            showAlert(loginErrorAlert, 'Please enter a valid email address.');
            return;
        }
        
        if (!validatePasswordLength(loginPassword, 6)) {
            showAlert(loginErrorAlert, 'Password must be at least 6 characters long.');
            return;
        }
        
        if (!agreeLoginTerms.checked) {
            showAlert(loginErrorAlert, 'You must agree to the terms and conditions.');
            return;
        }
        
        loginForm.classList.add('was-validated');
        
        // Show loading state
        showLoadingState(loginSubmitBtn);
        
        // Simulate API call (replace with actual API call)
        setTimeout(function() {
            // Hide loading state
            hideLoadingState(loginSubmitBtn);
            
            // Show success message
            showAlert(loginSuccessAlert, 'Login successful! Redirecting...');
            
            // Reset form
            loginForm.classList.remove('was-validated');
            loginForm.reset();
            agreeLoginTerms.checked = false;
            loginSubmitBtn.disabled = true;
            
            // Simulate redirect (replace with actual redirect)
            setTimeout(function() {
                // window.location.href = 'dashboard.html';
                console.log('Redirecting to dashboard...');
            }, 1500);
        }, 2000);
    });
    
    
    // ==========================================
    // SIGNUP FORM VALIDATION
    // ==========================================
    
    const signupForm = document.getElementById('signupForm');
    const signupName = document.getElementById('signupName');
    const signupEmail = document.getElementById('signupEmail');
    const signupPassword = document.getElementById('signupPassword');
    const signupConfirmPassword = document.getElementById('signupConfirmPassword');
    const toggleSignupPassword = document.getElementById('toggleSignupPassword');
    const agreeTerms = document.getElementById('agreeTerms');
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');
    const signupSuccessAlert = document.getElementById('signupSuccessAlert');
    const signupErrorAlert = document.getElementById('signupErrorAlert');
    const signupErrorMessage = document.getElementById('signupErrorMessage');
    const passwordStrength = document.getElementById('passwordStrength');
    const passwordStrengthText = document.getElementById('passwordStrengthText');
    
    // Password requirement elements
    const reqLength = document.getElementById('req-length');
    const reqUppercase = document.getElementById('req-uppercase');
    const reqLowercase = document.getElementById('req-lowercase');
    const reqNumber = document.getElementById('req-number');
    const reqSpecial = document.getElementById('req-special');
    
    // Enable/Disable signup button based on terms checkbox
    if (agreeTerms) {
        agreeTerms.addEventListener('change', function() {
            signupSubmitBtn.disabled = !this.checked;
        });
    }
    
    // Toggle password visibility for signup
    if (toggleSignupPassword) {
        toggleSignupPassword.addEventListener('click', function() {
            const type = signupPassword.type === 'password' ? 'text' : 'password';
            signupPassword.type = type;
            signupConfirmPassword.type = type;
            
            // Toggle icon
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Real-time name validation
    signupName.addEventListener('input', function() {
        validateName(this);
    });
    
    // Real-time email validation for signup
    signupEmail.addEventListener('input', function() {
        validateEmail(this);
    });
    
    // Real-time password strength check and requirements
    signupPassword.addEventListener('input', function() {
        checkPasswordStrength(this.value);
        checkPasswordRequirements(this.value);
        validateStrictPassword(this);
        
        // Check if passwords match when confirm password has value
        if (signupConfirmPassword.value) {
            validatePasswordMatch(signupPassword, signupConfirmPassword);
        }
    });
    
    // Real-time confirm password validation
    signupConfirmPassword.addEventListener('input', function() {
        validatePasswordMatch(signupPassword, signupConfirmPassword);
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous alerts
        hideAlert(signupSuccessAlert);
        hideAlert(signupErrorAlert);
        
        // Validate form
        if (!signupForm.checkValidity()) {
            e.stopPropagation();
            signupForm.classList.add('was-validated');
            showAlert(signupErrorAlert, 'Please fill in all required fields correctly.');
            return;
        }
        
        // Additional custom validations
        if (!validateName(signupName)) {
            showAlert(signupErrorAlert, 'Name must be at least 3 characters long.');
            return;
        }
        
        if (!validateEmail(signupEmail)) {
            showAlert(signupErrorAlert, 'Please enter a valid email address.');
            return;
        }
        
        if (!validateStrictPassword(signupPassword)) {
            showAlert(signupErrorAlert, 'Password must contain uppercase, lowercase, number, and special character.');
            return;
        }
        
        if (!validatePasswordMatch(signupPassword, signupConfirmPassword)) {
            showAlert(signupErrorAlert, 'Passwords do not match.');
            return;
        }
        
        if (!agreeTerms.checked) {
            showAlert(signupErrorAlert, 'You must agree to the terms and conditions.');
            agreeTerms.classList.add('is-invalid');
            return;
        }
        
        signupForm.classList.add('was-validated');
        
        // Show loading state
        showLoadingState(signupSubmitBtn);
        
        // Simulate API call (replace with actual API call)
        setTimeout(function() {
            // Hide loading state
            hideLoadingState(signupSubmitBtn);
            
            // Show success message
            showAlert(signupSuccessAlert, 'Account created successfully!');
            
            // Reset form
            signupForm.classList.remove('was-validated');
            signupForm.reset();
            passwordStrength.style.width = '0%';
            passwordStrengthText.textContent = '';
            agreeTerms.checked = false;
            signupSubmitBtn.disabled = true;
            
            // Reset password requirements display
            resetPasswordRequirements();
            
            // Switch to login tab after 2 seconds
            setTimeout(function() {
                const loginTab = document.getElementById('login-tab');
                const loginTabInstance = new bootstrap.Tab(loginTab);
                loginTabInstance.show();
            }, 2000);
        }, 2000);
    });
    
    
    // ==========================================
    // FORGOT PASSWORD FLOW - TWO STEPS
    // ==========================================
    
    const sendResetCodeBtn = document.getElementById('sendResetCodeBtn');
    const resetPasswordBtn = document.getElementById('resetPasswordBtn');
    const resetEmail = document.getElementById('resetEmail');
    const resetCodeSentAlert = document.getElementById('resetCodeSentAlert');
    const resetSuccessAlert = document.getElementById('resetSuccessAlert');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
    
    const resetStep1 = document.getElementById('resetStep1');
    const resetStep2 = document.getElementById('resetStep2');
    const verificationCode = document.getElementById('verificationCode');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const toggleNewPassword = document.getElementById('toggleNewPassword');
    const resetEmailDisplay = document.getElementById('resetEmailDisplay');
    const newPasswordStrength = document.getElementById('newPasswordStrength');
    const newPasswordStrengthText = document.getElementById('newPasswordStrengthText');
    
    // Toggle new password visibility
    if (toggleNewPassword) {
        toggleNewPassword.addEventListener('click', function() {
            const type = newPassword.type === 'password' ? 'text' : 'password';
            newPassword.type = type;
            confirmNewPassword.type = type;
            
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // New password strength check
    if (newPassword) {
        newPassword.addEventListener('input', function() {
            checkPasswordStrengthForElement(this.value, newPasswordStrength, newPasswordStrengthText);
            
            if (confirmNewPassword.value) {
                validatePasswordMatch(newPassword, confirmNewPassword);
            }
        });
    }
    
    // Confirm new password validation
    if (confirmNewPassword) {
        confirmNewPassword.addEventListener('input', function() {
            validatePasswordMatch(newPassword, confirmNewPassword);
        });
    }
    
    // Step 1: Send verification code
    if (sendResetCodeBtn) {
        sendResetCodeBtn.addEventListener('click', function() {
            // Hide previous alert
            hideAlert(resetCodeSentAlert);
            
            // Validate email
            if (!resetEmail.value || !validateEmailString(resetEmail.value)) {
                resetEmail.classList.add('is-invalid');
                return;
            }
            
            resetEmail.classList.remove('is-invalid');
            resetEmail.classList.add('is-valid');
            
            // Disable button and show loading
            sendResetCodeBtn.disabled = true;
            sendResetCodeBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';
            
            // Simulate API call to send verification code
            setTimeout(function() {
                // Show success alert
                showAlert(resetCodeSentAlert);
                
                // Reset button
                sendResetCodeBtn.disabled = false;
                sendResetCodeBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Send Verification Code';
                
                // Store email and move to step 2
                resetEmailDisplay.textContent = resetEmail.value;
                
                setTimeout(function() {
                    // Hide step 1, show step 2
                    resetStep1.classList.add('d-none');
                    resetStep2.classList.remove('d-none');
                    
                    // Hide send button, show reset button
                    sendResetCodeBtn.classList.add('d-none');
                    resetPasswordBtn.classList.remove('d-none');
                    
                    hideAlert(resetCodeSentAlert);
                }, 1500);
            }, 1500);
        });
    }
    
    // Step 2: Reset password with code
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', function() {
            // Hide previous alert
            hideAlert(resetSuccessAlert);
            
            // Validate verification code
            if (!verificationCode.value || verificationCode.value.length !== 6) {
                verificationCode.classList.add('is-invalid');
                return;
            }
            verificationCode.classList.remove('is-invalid');
            verificationCode.classList.add('is-valid');
            
            // Validate new password with strict requirements
            if (!validateStrictPassword(newPassword)) {
                newPassword.classList.add('is-invalid');
                return;
            }
            
            // Validate password match
            if (newPassword.value !== confirmNewPassword.value) {
                confirmNewPassword.classList.add('is-invalid');
                return;
            }
            confirmNewPassword.classList.remove('is-invalid');
            confirmNewPassword.classList.add('is-valid');
            
            // Disable button and show loading
            resetPasswordBtn.disabled = true;
            resetPasswordBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Resetting...';
            
            // Simulate API call to reset password
            setTimeout(function() {
                // Show success alert
                showAlert(resetSuccessAlert);
                
                // Reset button
                resetPasswordBtn.disabled = false;
                resetPasswordBtn.innerHTML = '<i class="fas fa-check me-2"></i> Reset Password';
                
                // Close modal and reset after 2 seconds
                setTimeout(function() {
                    const modalInstance = bootstrap.Modal.getInstance(forgotPasswordModal);
                    if (modalInstance) {
                        modalInstance.hide();
                    }
                    
                    // Reset modal to step 1
                    resetStep1.classList.remove('d-none');
                    resetStep2.classList.add('d-none');
                    sendResetCodeBtn.classList.remove('d-none');
                    resetPasswordBtn.classList.add('d-none');
                    
                    // Clear all inputs
                    resetEmail.value = '';
                    verificationCode.value = '';
                    newPassword.value = '';
                    confirmNewPassword.value = '';
                    
                    // Remove validation classes
                    document.querySelectorAll('.is-valid, .is-invalid').forEach(function(el) {
                        el.classList.remove('is-valid', 'is-invalid');
                    });
                    
                    hideAlert(resetSuccessAlert);
                    
                    // Show login tab
                    const loginTab = document.getElementById('login-tab');
                    const loginTabInstance = new bootstrap.Tab(loginTab);
                    loginTabInstance.show();
                }, 2000);
            }, 1500);
        });
    }
    
    
    // ==========================================
    // VALIDATION HELPER FUNCTIONS
    // ==========================================
    
    /**
     * Validate name field
     */
    function validateName(nameInput) {
        const name = nameInput.value.trim();
        
        if (name.length < 3) {
            nameInput.classList.add('is-invalid');
            nameInput.classList.remove('is-valid');
            return false;
        }
        
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * Validate email field
     */
    function validateEmail(emailInput) {
        const email = emailInput.value.trim();
        const isValid = validateEmailString(email);
        
        if (!isValid) {
            emailInput.classList.add('is-invalid');
            emailInput.classList.remove('is-valid');
            return false;
        }
        
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * Validate email string format
     */
    function validateEmailString(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Validate password length
     */
    function validatePasswordLength(passwordInput, minLength) {
        const password = passwordInput.value;
        
        if (password.length < minLength) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
            return false;
        }
        
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * STRICT PASSWORD VALIDATION
     * Must contain: uppercase, lowercase, number, special character
     */
    function validateStrictPassword(passwordInput) {
        const password = passwordInput.value;
        
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        const hasMinLength = password.length >= 8;
        
        const isValid = hasUppercase && hasLowercase && hasNumber && hasSpecial && hasMinLength;
        
        if (!isValid) {
            passwordInput.classList.add('is-invalid');
            passwordInput.classList.remove('is-valid');
            return false;
        }
        
        passwordInput.classList.remove('is-invalid');
        passwordInput.classList.add('is-valid');
        return true;
    }
    
    /**
     * Check password requirements and update UI checklist
     */
    function checkPasswordRequirements(password) {
        const hasLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
        updateRequirement(reqLength, hasLength);
        updateRequirement(reqUppercase, hasUppercase);
        updateRequirement(reqLowercase, hasLowercase);
        updateRequirement(reqNumber, hasNumber);
        updateRequirement(reqSpecial, hasSpecial);
    }
    
    /**
     * Update individual requirement display
     */
    function updateRequirement(element, isMet) {
        const icon = element.querySelector('i');
        if (isMet) {
            icon.classList.remove('fa-circle', 'text-muted');
            icon.classList.add('fa-check-circle', 'text-success');
            element.classList.add('text-success');
            element.classList.remove('text-muted');
        } else {
            icon.classList.remove('fa-check-circle', 'text-success');
            icon.classList.add('fa-circle', 'text-muted');
            element.classList.remove('text-success');
            element.classList.add('text-muted');
        }
    }
    
    /**
     * Reset password requirements display
     */
    function resetPasswordRequirements() {
        [reqLength, reqUppercase, reqLowercase, reqNumber, reqSpecial].forEach(function(el) {
            const icon = el.querySelector('i');
            icon.classList.remove('fa-check-circle', 'text-success');
            icon.classList.add('fa-circle', 'text-muted');
            el.classList.remove('text-success');
            el.classList.add('text-muted');
        });
    }
    
    /**
     * Check password strength and update progress bar
     */
    function checkPasswordStrength(password) {
        checkPasswordStrengthForElement(password, passwordStrength, passwordStrengthText);
    }
    
    /**
     * Generic password strength checker for any element
     */
    function checkPasswordStrengthForElement(password, strengthBar, strengthText) {
        let strength = 0;
        let strengthTextValue = '';
        let strengthColor = '';
        
        if (password.length === 0) {
            strengthBar.style.width = '0%';
            strengthText.textContent = '';
            strengthBar.className = 'progress-bar';
            return;
        }
        
        // Length check
        if (password.length >= 8) strength += 20;
        
        // Contains lowercase
        if (/[a-z]/.test(password)) strength += 20;
        
        // Contains uppercase
        if (/[A-Z]/.test(password)) strength += 20;
        
        // Contains numbers
        if (/[0-9]/.test(password)) strength += 20;
        
        // Contains special characters
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 20;
        
        // Determine strength level
        if (strength <= 20) {
            strengthTextValue = 'Very Weak';
            strengthColor = 'bg-danger';
        } else if (strength <= 40) {
            strengthTextValue = 'Weak';
            strengthColor = 'bg-danger';
        } else if (strength <= 60) {
            strengthTextValue = 'Fair';
            strengthColor = 'bg-warning';
        } else if (strength <= 80) {
            strengthTextValue = 'Good';
            strengthColor = 'bg-info';
        } else {
            strengthTextValue = 'Strong';
            strengthColor = 'bg-success';
        }
        
        // Update progress bar
        strengthBar.style.width = strength + '%';
        strengthBar.className = 'progress-bar ' + strengthColor;
        strengthText.textContent = strengthTextValue;
        strengthText.className = 'text-muted small';
    }
    
    /**
     * Validate password match
     */
    function validatePasswordMatch(passwordInput, confirmPasswordInput) {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (password !== confirmPassword || confirmPassword === '') {
            confirmPasswordInput.classList.add('is-invalid');
            confirmPasswordInput.classList.remove('is-valid');
            return false;
        }
        
        confirmPasswordInput.classList.remove('is-invalid');
        confirmPasswordInput.classList.add('is-valid');
        return true;
    }
    
    
    // ==========================================
    // UI HELPER FUNCTIONS
    // ==========================================
    
    /**
     * Show alert message
     */
    function showAlert(alertElement, message = null) {
        if (message && alertElement.querySelector('span')) {
            alertElement.querySelector('span').textContent = message;
        }
        alertElement.classList.remove('d-none');
    }
    
    /**
     * Hide alert message
     */
    function hideAlert(alertElement) {
        alertElement.classList.add('d-none');
    }
    
    /**
     * Show loading state on button
     */
    function showLoadingState(button) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner-border');
        const loadingText = button.querySelector('.loading-text');
        
        if (btnText) btnText.classList.add('d-none');
        if (spinner) spinner.classList.remove('d-none');
        if (loadingText) loadingText.classList.remove('d-none');
        
        button.disabled = true;
    }
    
    /**
     * Hide loading state on button
     */
    function hideLoadingState(button) {
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.spinner-border');
        const loadingText = button.querySelector('.loading-text');
        
        if (btnText) btnText.classList.remove('d-none');
        if (spinner) spinner.classList.add('d-none');
        if (loadingText) loadingText.classList.add('d-none');
        
        button.disabled = false;
    }
    
    
    // ==========================================
    // CLEAR VALIDATION ON TAB SWITCH
    // ==========================================
    
    const authTabs = document.querySelectorAll('#authTabs button[data-bs-toggle="tab"]');
    authTabs.forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(e) {
            // Reset all forms when switching tabs
            loginForm.classList.remove('was-validated');
            signupForm.classList.remove('was-validated');
            loginForm.reset();
            signupForm.reset();
            
            // Reset checkboxes and buttons
            if (agreeLoginTerms) {
                agreeLoginTerms.checked = false;
                loginSubmitBtn.disabled = true;
            }
            if (agreeTerms) {
                agreeTerms.checked = false;
                signupSubmitBtn.disabled = true;
            }
            
            // Hide all alerts
            hideAlert(loginSuccessAlert);
            hideAlert(loginErrorAlert);
            hideAlert(signupSuccessAlert);
            hideAlert(signupErrorAlert);
            
            // Reset password strength
            if (passwordStrength) {
                passwordStrength.style.width = '0%';
                passwordStrengthText.textContent = '';
            }
            
            // Reset password requirements
            resetPasswordRequirements();
            
            // Remove validation classes
            document.querySelectorAll('.is-valid, .is-invalid').forEach(function(el) {
                el.classList.remove('is-valid', 'is-invalid');
            });
        });
    });
    
});