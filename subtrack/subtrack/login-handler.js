// Login Form Handler
// Connects the login UI to the mock auth service

(function () {
    'use strict';

    console.log('[LOGIN] Form handler loaded');

    function initLoginForm() {
        // Wait for auth service to be available
        if (typeof window.SubTrackAuth === 'undefined') {
            setTimeout(initLoginForm, 100);
            return;
        }

        // Password login form
        const passwordForm = document.querySelector('form');
        const emailInput = document.getElementById('email-password');
        const passwordInput = document.getElementById('password');

        if (passwordForm && emailInput && passwordInput) {
            passwordForm.addEventListener('submit', function (e) {
                e.preventDefault();

                const email = emailInput.value.trim();
                const password = passwordInput.value;

                if (!email || !password) {
                    showError('Please enter both email and password');
                    return;
                }

                const result = window.SubTrackAuth.login(email, password);

                if (result.success) {
                    showSuccess('Login successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = '/subtrack/dashboard.html';
                    }, 500);
                } else {
                    showError(result.error);
                }
            });

            console.log('[LOGIN] Password form initialized');
        }

        // Google login button
        const googleButton = document.querySelector('button[type="button"]');
        if (googleButton && googleButton.textContent.includes('Google')) {
            googleButton.addEventListener('click', function (e) {
                e.preventDefault();
                showInfo('Google OAuth is not available in demo mode. Use demo@subtrack.abhnv.in / demo123');
            });
        }

        // Magic link tab (if exists)
        const magicButton = document.querySelector('[data-state="inactive"]');
        if (magicButton) {
            // This would need more complex handling for the tabs
            console.log('[LOGIN] Magic link tab detected');
        }
    }

    function showError(message) {
        // Use browser's notification system or create a toast
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
        document.addEventListener('DOMContentLoaded', initLoginForm);
    } else {
        initLoginForm();
    }

})();
