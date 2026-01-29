// Coming Soon Link Interceptor
// Intercepts auth-related links and shows modal instead

(function () {
    'use strict';

    // Check if coming soon mode is enabled
    if (!window.SUBTRACK_COMING_SOON || !window.showComingSoonModal) {
        return;
    }

    // Wait for DOM to be ready
    function initInterceptor() {
        // Selectors for links that should be intercepted
        const authSelectors = [
            'a[href="/subtrack/login"]',
            'a[href="login.html"]',
            'a[href="/subtrack/register"]',
            'a[href="register.html"]',
            'a[href="/subtrack/dashboard"]',
            'a[href="dashboard.html"]',
            'a[href*="login"]',
            'a[href*="register"]',
            'a[href*="sign-in"]',
            'a[href*="sign-up"]',
            'a[href*="signup"]',
            'a[href*="signin"]'
        ];

        // Text patterns to intercept (case insensitive)
        const authTextPatterns = [
            /sign in/i,
            /log in/i,
            /login/i,
            /sign up/i,
            /get started/i,
            /start tracking/i,
            /track.*subscriptions/i
        ];

        // Function to check if link should be intercepted
        function shouldIntercept(element) {
            const href = element.getAttribute('href') || '';
            const text = element.textContent || '';

            // Skip demo links
            if (href.includes('demo')) {
                return false;
            }

            // Check href patterns
            if (href && (
                href.includes('login') ||
                href.includes('register') ||
                href.includes('dashboard') ||
                href.includes('sign-in') ||
                href.includes('sign-up')
            )) {
                return true;
            }

            // Check text patterns
            for (const pattern of authTextPatterns) {
                if (pattern.test(text)) {
                    // But make sure it's not a help/documentation link
                    if (!href.includes('help') && !href.includes('faq')) {
                        return true;
                    }
                }
            }

            return false;
        }

        // Intercept clicks
        function interceptClick(e) {
            const link = e.target.closest('a');
            if (!link) return;

            if (shouldIntercept(link)) {
                e.preventDefault();
                e.stopPropagation();
                window.showComingSoonModal();
            }
        }

        // Intercept form submissions on auth pages
        function interceptFormSubmit(e) {
            const form = e.target;
            const action = form.getAttribute('action') || '';

            // If we're on an auth page or form has auth-related action
            if (
                action.includes('login') ||
                action.includes('register') ||
                action.includes('auth') ||
                window.location.pathname.includes('login') ||
                window.location.pathname.includes('register')
            ) {
                e.preventDefault();
                e.stopPropagation();
                window.showComingSoonModal();
            }
        }

        // Add event listeners
        document.addEventListener('click', interceptClick, true);
        document.addEventListener('submit', interceptFormSubmit, true);

        // Also intercept programmatic navigation (for SPA behavior)
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function () {
            const url = arguments[2];
            if (url && (
                url.includes('login') ||
                url.includes('register') ||
                url.includes('dashboard')
            ) && !url.includes('demo')) {
                window.showComingSoonModal();
                return;
            }
            return originalPushState.apply(history, arguments);
        };

        history.replaceState = function () {
            const url = arguments[2];
            if (url && (
                url.includes('login') ||
                url.includes('register') ||
                url.includes('dashboard')
            ) && !url.includes('demo')) {
                window.showComingSoonModal();
                return;
            }
            return originalReplaceState.apply(history, arguments);
        };

        console.log('Coming Soon interceptor initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInterceptor);
    } else {
        initInterceptor();
    }

})();
