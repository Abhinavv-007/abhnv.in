/**
 * Homepage Coming Soon CTA Disabler
 * Disables and blurs authentication CTAs on the homepage with "Coming soon" labels
 */

(function () {
    'use strict';

    // Only run on homepage
    if (!window.SUBTRACK_COMING_SOON || (window.location.pathname !== '/' && window.location.pathname !== '/index')) {
        return;
    }

    // Track processed elements to avoid duplicates
    const processedElements = new WeakSet();

    // CTA selectors - text patterns and href patterns
    const TEXT_PATTERNS = [
        /sign\s*in/i,
        /log\s*in/i,
        /start\s*tracking/i,
        /track.*free/i,
        /get\s*started/i,
        /dashboard/i,
        /track.*subscriptions/i
    ];

    const HREF_PATTERNS = [
        '/subtrack/login',
        '/subtrack/register',
        '/subtrack/dashboard',
        '#pricing' // Also disable pricing links
    ];

    /**
     * Check if an element matches CTA criteria
     */
    function isAuthCTA(element) {
        // Check if it's a link or button
        const tagName = element.tagName.toLowerCase();
        if (tagName !== 'a' && tagName !== 'button') {
            return false;
        }

        // Check text content
        const text = element.textContent || '';
        const matchesText = TEXT_PATTERNS.some(pattern => pattern.test(text));

        // Check href
        const href = element.getAttribute('href') || '';
        const matchesHref = HREF_PATTERNS.some(pattern => href.includes(pattern));

        return matchesText || matchesHref;
    }

    /**
     * Disable a CTA element
     */
    function disableCTA(element) {
        if (processedElements.has(element)) {
            return; // Already processed
        }

        // Add disabled class
        element.classList.add('cs-disabled');

        // Prevent all click events
        const preventClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Optionally show modal
            if (typeof window.showComingSoonModal === 'function') {
                window.showComingSoonModal();
            }

            return false;
        };

        element.addEventListener('click', preventClick, { capture: true });
        element.addEventListener('mousedown', preventClick, { capture: true });
        element.addEventListener('touchstart', preventClick, { capture: true });

        // Label removed to fix alignment - blur and modal still active
        /* 
        const parent = element.parentElement;
        if (parent && !parent.querySelector('.cs-soon')) {
            const label = document.createElement('div');
            label.className = 'cs-soon';
            label.textContent = 'Coming soon';

            // Insert after the element
            if (element.nextSibling) {
                parent.insertBefore(label, element.nextSibling);
            } else {
                parent.appendChild(label);
            }
        }
        */

        processedElements.add(element);
        console.log('[Coming Soon] Disabled CTA:', element.textContent?.trim());
    }

    /**
     * Scan and disable all CTAs
     */
    function disableAllCTAs() {
        const elements = document.querySelectorAll('a, button');
        elements.forEach(element => {
            if (isAuthCTA(element)) {
                disableCTA(element);
            }
        });
    }

    /**
     * Setup MutationObserver after body exists
     */
    function setupObserver() {
        if (!document.body) {
            // Body doesn't exist yet, wait
            setTimeout(setupObserver, 50);
            return;
        }

        // Watch for DOM changes (Next.js hydration/updates)
        const observer = new MutationObserver((mutations) => {
            let shouldRescan = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        shouldRescan = true;
                    }
                });
            });

            if (shouldRescan) {
                // Debounce rescans
                clearTimeout(window._csRescanTimeout);
                window._csRescanTimeout = setTimeout(disableAllCTAs, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('[Coming Soon] MutationObserver active');
    }

    /**
     * Initialize with MutationObserver for Next.js hydration
     */
    function init() {
        // Initial scan
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                disableAllCTAs();
                setupObserver();
            });
        } else {
            disableAllCTAs();
            setupObserver();
        }

        console.log('[Coming Soon] Homepage CTA disabler initialized');
    }

    // Start
    init();
})();
