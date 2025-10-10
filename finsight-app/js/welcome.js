/**
 * Finsight - Welcome Onboarding JavaScript
 * Person 1: Welcome Page Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    
    console.log('✅ Welcome page initialized');

    // Current step tracking
    let currentStep = 1;

    // ==========================================
    // STEP NAVIGATION
    // ==========================================

    /**
     * Navigate to a specific step
     * @param {number} stepNumber - Step to navigate to (1-3)
     */
    window.nextStep = function(stepNumber) {
        // Validate step number
        if (stepNumber < 1 || stepNumber > 3) {
            console.error('Invalid step number:', stepNumber);
            return;
        }

        // Hide current card
        const currentCard = document.getElementById(`step${currentStep}`);
        if (currentCard) {
            currentCard.classList.remove('active');
        }

        // Update current step indicator
        const currentStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
        if (currentStepEl) {
            currentStepEl.classList.remove('active');
            if (stepNumber > currentStep) {
                currentStepEl.classList.add('completed');
            }
        }

        // Show new card
        const newCard = document.getElementById(`step${stepNumber}`);
        if (newCard) {
            newCard.classList.add('active');
        }

        // Update new step indicator
        const newStepEl = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (newStepEl) {
            newStepEl.classList.add('active');
        }

        // Update current step
        currentStep = stepNumber;

        // Scroll to top smoothly
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        console.log('Navigated to step:', stepNumber);
    };

    // ==========================================
    // STEP INDICATOR CLICK
    // ==========================================

    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            nextStep(stepNumber);
        });
    });

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================

    document.addEventListener('keydown', function(e) {
        // Right arrow or Enter - Next step
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
            if (currentStep < 3) {
                nextStep(currentStep + 1);
            }
        }
        // Left arrow - Previous step
        else if (e.key === 'ArrowLeft') {
            if (currentStep > 1) {
                nextStep(currentStep - 1);
            }
        }
        // Escape - Skip to dashboard
        else if (e.key === 'Escape') {
            if (confirm('Skip onboarding and go to dashboard?')) {
                window.location.href = 'dashboard.html';
            }
        }
    });

    // ==========================================
    // AUTO-ADVANCE TIMER (Optional)
    // ==========================================

    let autoAdvanceTimer = null;

    /**
     * Start auto-advance timer for step 1
     */
    function startAutoAdvance() {
        // Only auto-advance on step 1
        if (currentStep === 1) {
            autoAdvanceTimer = setTimeout(function() {
                // Show tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'auto-advance-tooltip';
                tooltip.innerHTML = '<small>👉 Click Continue to proceed</small>';
                tooltip.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 10px 20px;
                    border-radius: 25px;
                    z-index: 1000;
                    animation: fadeIn 0.5s ease;
                `;
                document.body.appendChild(tooltip);

                // Remove after 5 seconds
                setTimeout(() => {
                    tooltip.remove();
                }, 5000);
            }, 5000); // Show after 5 seconds
        }
    }

    /**
     * Clear auto-advance timer
     */
    function clearAutoAdvance() {
        if (autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
            autoAdvanceTimer = null;
        }
    }

    // Start auto-advance on page load
    startAutoAdvance();

    // Clear auto-advance when user interacts
    document.addEventListener('click', clearAutoAdvance);

    // ==========================================
    // FEATURE CARDS ANIMATION
    // ==========================================

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // ==========================================
    // START OPTION CARDS ANIMATION
    // ==========================================

    const startOptionCards = document.querySelectorAll('.start-option-card');
    startOptionCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.15}s`;
    });

    // ==========================================
    // TRACK USER PROGRESS
    // ==========================================

    const progressData = {
        startTime: new Date(),
        stepsCompleted: [1],
        currentStep: 1
    };

    // Update progress when step changes
    function updateProgress(stepNumber) {
        progressData.currentStep = stepNumber;
        if (!progressData.stepsCompleted.includes(stepNumber)) {
            progressData.stepsCompleted.push(stepNumber);
        }
        console.log('Progress:', progressData);
    }

    // Override nextStep to include progress tracking
    const originalNextStep = window.nextStep;
    window.nextStep = function(stepNumber) {
        originalNextStep(stepNumber);
        updateProgress(stepNumber);
    };

    // ==========================================
    // COMPLETION CELEBRATION
    // ==========================================

    /**
     * Show celebration when user reaches step 3
     */
    function showCelebration() {
        // Create confetti effect (simple version)
        const colors = ['#4A90E2', '#50C878', '#F39C12', '#E74C3C'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                createConfetti(colors[Math.floor(Math.random() * colors.length)]);
            }, i * 50);
        }
    }

    /**
     * Create a confetti element
     */
    function createConfetti(color) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${color};
            top: -10px;
            left: ${Math.random() * 100}%;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(confetti);

        // Animate falling
        const duration = 2000 + Math.random() * 1000;
        const rotation = Math.random() * 360;
        
        confetti.animate([
            { 
                transform: 'translateY(0) rotate(0deg)', 
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`, 
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }

    // Show celebration when reaching step 3
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const step3Card = document.getElementById('step3');
            if (step3Card && step3Card.classList.contains('active')) {
                showCelebration();
                observer.disconnect(); // Only celebrate once
            }
        });
    });

    observer.observe(document.body, {
        attributes: true,
        subtree: true,
        attributeFilter: ['class']
    });

    // ==========================================
    // ACCESSIBILITY IMPROVEMENTS
    // ==========================================

    // Add ARIA labels
    const continueButtons = document.querySelectorAll('.btn-primary');
    continueButtons.forEach(btn => {
        if (btn.textContent.includes('Continue')) {
            btn.setAttribute('aria-label', 'Continue to next step');
        }
    });

    // Announce step changes to screen readers
    function announceStep(stepNumber) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = `Step ${stepNumber} of 3`;
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    }

    // Override nextStep to include announcements
    const nextStepWithAnnouncement = window.nextStep;
    window.nextStep = function(stepNumber) {
        nextStepWithAnnouncement(stepNumber);
        announceStep(stepNumber);
    };

    // ==========================================
    // LOCAL STORAGE (Optional)
    // ==========================================

    /**
     * Save onboarding completion status
     * Note: This is optional and can be used to skip onboarding on future visits
     */
    function markOnboardingComplete() {
        try {
            localStorage.setItem('finsight_onboarding_completed', 'true');
            console.log('Onboarding completion status saved');
        } catch (e) {
            console.log('Could not save onboarding status:', e);
        }
    }

    // Mark complete when user clicks any "Get Started" option
    const startButtons = document.querySelectorAll('.start-option-card .btn');
    startButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            markOnboardingComplete();
        });
    });

    // Also mark complete on skip
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function() {
            markOnboardingComplete();
        });
    }

    // ==========================================
    // CONSOLE SUMMARY
    // ==========================================

    console.log('🎉 Welcome onboarding ready');
    console.log('⌨️  Keyboard navigation: Arrow keys, Enter, Escape');
    console.log('🎨 Animations loaded');
    console.log('♿ Accessibility features enabled');

});