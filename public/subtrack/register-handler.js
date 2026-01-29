// Register Form Handler
// Connects the registration UI to the mock auth service

(function () {
    'use strict';

    console.log('[REGISTER] Form handler loaded');

    function initRegisterForm() {
        // Wait for auth service to be available
        if (typeof window.SubTrackAuth === 'undefined') {
            setTimeout(initRegisterForm, 100);
            return;
        }

        const form = document.querySelector('form');
        const emailInput = document.getElementById('email-password');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');

        if (form && emailInput && passwordInput && confirmPasswordInput) {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;

                // Validation
                if (!email || !password || !confirmPassword) {
                    showError('Please fill in all fields');
                    return;
                }

                if (!isValidEmail(email)) {
                    showError('Please enter a valid email address');
                    return;
                }

                if (password.length < 6) {
                    showError('Password must be at least 6 characters');
                    return;
                }

                if (password !== confirmPassword) {
                    showError('Passwords do not match');
                    return;
                }

                const result = window.SubTrackAuth.register(email, password);

                if (result.success) {
                    showSuccess('Account created successfully! Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/subtrack/dashboard.html';
                    }, 500);
                } else {
                    showError(result.error);
                }
            });

            console.log('[REGISTER] Form initialized');
        }

        // Google signup button
        const googleButton = document.querySelector('button[type="button"]');
        if (googleButton && googleButton.textContent.includes('Google')) {
            googleButton.addEventListener('click', function (e) {
                e.preventDefault();
                showInfo('Google OAuth is not available in demo mode. Please use email registration.');
            });
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(message) {
        alert('Error: ' + message);
    }

    function showSuccess(message) {
        alert('Success: ' + message);
    }

    function showInfo(message) {
        alert('Info: ' + message);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRegisterForm);
    } else {
        initRegisterForm();
    }

})();
