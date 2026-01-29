/**
 * Landing Page FAQ Accordion Handler
 * Enables accordion functionality for the static FAQ section on index.html
 * Uses event delegation for robustness
 */

(function () {
    'use strict';

    function handleAccordionClick(e) {
        // Find closest button with the correct attribute
        const button = e.target.closest('button[data-radix-collection-item]');

        // If not checking an FAQ button, ignore
        if (!button) return;

        // Ensure we are in the FAQ section (optional check)
        const container = button.closest('[data-orientation="vertical"]');
        if (!container) return;

        // Stop propagation to prevent other handlers from interfering
        e.preventDefault();
        e.stopPropagation();

        const panelId = button.getAttribute('aria-controls');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const panel = document.getElementById(panelId);

        if (!panel) return;

        // Toggle state
        if (isExpanded) {
            // Collapse
            button.setAttribute('aria-expanded', 'false');
            button.setAttribute('data-state', 'closed');
            container.setAttribute('data-state', 'closed');

            panel.setAttribute('data-state', 'closed');
            panel.setAttribute('hidden', '');
            panel.style.display = 'none'; // Force hide
        } else {
            // Expand
            button.setAttribute('aria-expanded', 'true');
            button.setAttribute('data-state', 'open');
            container.setAttribute('data-state', 'open');

            panel.setAttribute('data-state', 'open');
            panel.removeAttribute('hidden');
            panel.style.display = 'block'; // Force show
        }
    }

    // Initialize
    function init() {
        // Only run on landing page path
        if (window.location.pathname === '/' || window.location.pathname === '/subtrack/index.html' || window.location.pathname === '') {
            // Remove existing listeners if possible (not really possible with anonymous functions, but delegation avoids duplicates)
            document.removeEventListener('click', handleAccordionClick);
            document.addEventListener('click', handleAccordionClick);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
