/**
 * Finsight - Navigation Script
 * Handles smooth scrolling and navigation interactions
 * Author: Keerthi Chandrakanth
 */

/**
 * Finsight - Navigation JavaScript
 * Handles smooth scrolling and navbar effects
 * Author: Person 1
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ==========================================

    // Get all navigation links that point to sections
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the href attribute
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || href === '') {
                return;
            }

            // Get the target element
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            // If target exists, smooth scroll to it
            if (targetElement) {
                e.preventDefault();

                // Calculate position (accounting for fixed navbar height)
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;

                // Smooth scroll
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });


    // ==========================================
    // NAVBAR SHADOW ON SCROLL
    // ==========================================

    const navbar = document.querySelector('.navbar');

    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', updateNavbarOnScroll);

    // Check on initial load
    updateNavbarOnScroll();


    // ==========================================
    // ACTIVE LINK HIGHLIGHTING
    // ==========================================

    // Get all sections that have an ID
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollPosition = window.scrollY + 100; // Offset for better detection

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            // Check if current scroll position is within this section
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section's link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // Add scroll event listener for active link highlighting
    window.addEventListener('scroll', highlightActiveLink);

    // Check on initial load
    highlightActiveLink();


    // ==========================================
    // SCROLL TO TOP BUTTON (Optional)
    // ==========================================

    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);

    // Show/hide scroll to top button
    function toggleScrollTopButton() {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }

    window.addEventListener('scroll', toggleScrollTopButton);

    // Scroll to top when button is clicked
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });


    // ==========================================
    // MOBILE MENU AUTO-CLOSE
    // ==========================================

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const navbar = document.querySelector('.navbar');
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');

        // Check if click is outside navbar and menu is open
        if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse);
            bsCollapse.hide();
        }
    });

    // ==========================================
    // NEW: CTA BUTTON INTERACTION HANDLER
    // ==========================================

    /**
     * Redirects the user to the login page and activates the Sign Up tab.
     */
    function redirectToSignup() {
        // Redirect to login page with a query parameter to activate the signup tab
        window.location.href = 'login.html?tab=signup';
    }

    /**
     * Handles placeholder action buttons (Watch Demo, Contact Sales)
     * @param {string} actionName - The name of the action being performed
     */
    function handlePlaceholderAction(actionName) {
        console.log(`Action requested: ${actionName}. Placeholder action executed.`);
        // Note: We use window.scrollTo instead of window.alert() for user feedback
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 1. "Get Started" in Navbar (ID: getStartedNavBtn)
    const getStartedNavBtn = document.getElementById('getStartedNavBtn');
    if (getStartedNavBtn) {
        getStartedNavBtn.addEventListener('click', redirectToSignup);
    }

    // 2. "Start Free Trial" in Hero Section (ID: startFreeTrialHeroBtn)
    const startFreeTrialHeroBtn = document.getElementById('startFreeTrialHeroBtn');
    if (startFreeTrialHeroBtn) {
        startFreeTrialHeroBtn.addEventListener('click', redirectToSignup);
    }

    // 3. "Start Free Trial" in CTA Section (ID: startFreeTrialCTABtn)
    const startFreeTrialCTABtn = document.getElementById('startFreeTrialCTABtn');
    if (startFreeTrialCTABtn) {
        startFreeTrialCTABtn.addEventListener('click', redirectToSignup);
    }

    // 4. "Contact Sales" Button (ID: contactSalesBtn)
    const contactSalesBtn = document.getElementById('contactSalesBtn');
    if (contactSalesBtn) {
        contactSalesBtn.addEventListener('click', function() {
            handlePlaceholderAction('Contact Sales');
        });
    }

    // ==========================================
    // NEW: LOGIN PAGE TAB ACTIVATION HANDLER
    // ==========================================

    /**
     * Checks if the URL contains a query parameter to automatically switch
     * to the Sign Up tab on the login.html page.
     */
    function activateSignupTabOnLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const tab = urlParams.get('tab');

        if (tab === 'signup') {
            const signupTabButton = document.getElementById('signup-tab');
            const signupContent = document.getElementById('signup-content');
            const loginTabButton = document.getElementById('login-tab');
            const loginContent = document.getElementById('login-content');

            // Use Bootstrap JS methods to toggle tabs correctly
            if (signupTabButton && signupContent && loginTabButton && loginContent) {
                // Deactivate Login tab manually using Bootstrap classes
                loginTabButton.classList.remove('active');
                loginContent.classList.remove('show', 'active');

                // Activate Sign Up tab manually using Bootstrap classes
                signupTabButton.classList.add('active');
                signupContent.classList.add('show', 'active');

                console.log("✅ Switched to Sign Up tab based on URL query parameter.");
            }
        }
    }

    // Only run this activation logic on the login.html page.
    if (window.location.pathname.endsWith('login.html')) {
        activateSignupTabOnLoad();
    }

    console.log("📍 CTA and Navigation links initialized.");

});