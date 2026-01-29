/**
 * Theme Switcher for Landing Page
 * Implements light/dark mode toggle functionality
 * Works exactly like demo page theme switcher
 */

(function () {
    'use strict';

    // Theme management functions
    function getTheme() {
        try {
            return localStorage.getItem('theme') || 'system';
        } catch (e) {
            return 'system';
        }
    }

    function setTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
            applyTheme(theme);
        } catch (e) {
            console.error('Failed to save theme:', e);
        }
    }

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        const root = document.documentElement;
        const classList = root.classList;

        // Remove existing theme classes
        classList.remove('light', 'dark');

        // Determine actual theme to apply
        let actualTheme = theme;
        if (theme === 'system') {
            actualTheme = getSystemTheme();
        }

        // Apply theme class and color scheme
        classList.add(actualTheme);
        root.style.colorScheme = actualTheme;
    }

    function initializeTheme() {
        const currentTheme = getTheme();
        applyTheme(currentTheme);
    }

    function attachClickHandlers() {
        // Find all theme toggle buttons (both desktop and mobile)
        const themeButtons = document.querySelectorAll('button[type="button"][aria-haspopup="menu"]');

        themeButtons.forEach(button => {
            // Check if this is a theme button by looking for sun/moon icons
            const hasSunIcon = button.querySelector('.lucide-sun-medium, .lucide-sun');
            const hasMoonIcon = button.querySelector('.lucide-moon');

            if (hasSunIcon && hasMoonIcon) {
                // This is a theme button!
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    // Toggle between light and dark
                    const currentTheme = getTheme();
                    let newTheme;

                    if (currentTheme === 'dark') {
                        newTheme = 'light';
                    } else {
                        newTheme = 'dark';
                    }

                    setTheme(newTheme);
                });
            }
        });
    }

    // Listen for system theme changes
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addListener((e) => {
            const currentTheme = getTheme();
            if (currentTheme === 'system') {
                applyTheme('system');
            }
        });
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeTheme();
            attachClickHandlers();
            watchSystemTheme();
        });
    } else {
        initializeTheme();
        attachClickHandlers();
        watchSystemTheme();
    }

    // Re-attach handlers if DOM changes (for dynamic content)
    const observer = new MutationObserver(() => {
        attachClickHandlers();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
