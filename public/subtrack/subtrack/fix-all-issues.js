/**
 * SubTrack UI Fixes - Enhanced with better React hydration handling
 * Fixes: Theme Switcher, FAQ Accordion, Logo Size, Discord Links
 */

(function () {
    'use strict';

    console.log('[SubTrack Fixes] Initializing all UI fixes...');

    // ===========================
    // 1. LOGO SIZE FIX (2x = 64px)
    // ===========================
    function fixLogoSize() {
        const style = document.createElement('style');
        style.id = 'subtrack-logo-size-fix';
        style.textContent = `
            /* Logo size: 64px (2x of 32px) */
            img[alt="SubTrack"] {
                width: 64px !important;
                height: 64px !important;
                min-width: 64px !important;
                min-height: 64px !important;
            }
            
            /* Fix sidebar logo too */
            aside img[alt="SubTrack"] {
                width: 48px !important;
                height: 48px !important;
            }
            
            /* Footer logo */
            footer img[alt="SubTrack"] {
                width: 64px !important;
                height: 64px !important;
            }
        `;

        if (!document.getElementById('subtrack-logo-size-fix')) {
            document.head.appendChild(style);
            console.log('[Logo Fix] Applied 64px (2x) logo size');
        }

        // Also fix logo src directly - USE ABSOLUTE PATH
        document.querySelectorAll('img[alt="SubTrack"]').forEach(img => {
            if (img.src.includes('_next/image') || img.src.includes('%2F_static')) {
                img.src = '/subtrack/_static/logo/logo.png';
                img.srcset = '';
                img.removeAttribute('srcSet');
                img.style.width = '64px';
                img.style.height = '64px';
            }
        });

        // Initialize Coming Soon Modal Logic globally if not already present
        if (!window.SUBTRACK_COMING_SOON_CONFIG) {
            window.SUBTRACK_COMING_SOON_CONFIG = {
                badge: "Preview",
                title: "Coming soon",
                subtitle: "You're viewing a demo build. Accounts, cloud sync, and billing will ship in a later release.",
                demoUrl: "/subtrack/demo",
                contactUrl: "mailto:support@abhnv.in",
                linkedInUrl: "https://www.linkedin.com/in/abhnv07/"
            };

            // Delegated listener for Log In buttons
            document.addEventListener('click', function (e) {
                const link = e.target.closest('a[href="/subtrack/login"]');
                if (link) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('[Fix] Intercepted Login click');
                    if (window.showComingSoonModal) {
                        window.showComingSoonModal();
                    } else if (typeof window.showComingSoonModal === 'undefined') {
                        // Fallback if modal script isn't loaded yet?
                        // It should be loaded by fix-all-issues or index.html
                        console.warn('[Fix] showComingSoonModal not found');
                    }
                }
            }, true);
        }
    }

    // ===========================
    // 2. THEME SWITCHER - IMPROVED
    // ===========================
    function fixThemeSwitcher() {
        // Use CSS-based approach to force clickability + JS override
        if (!document.getElementById('theme-switcher-fix-css')) {
            const style = document.createElement('style');
            style.id = 'theme-switcher-fix-css';
            style.textContent = `
                /* Force theme button to be clickable */
                button[id^="radix-"]:has(.lucide-sun-medium, .lucide-sun, .lucide-moon) {
                    pointer-events: auto !important;
                    cursor: pointer !important;
                }
            `;
            document.head.appendChild(style);
        }

        const themeButtons = document.querySelectorAll('button[id^="radix-"]');
        let fixed = false;

        themeButtons.forEach(button => {
            const hasSun = button.querySelector('.lucide-sun-medium, .lucide-sun');
            const hasMoon = button.querySelector('.lucide-moon');

            if (!hasSun && !hasMoon) return;
            if (button.dataset.themeFixedNew === 'true') return;

            // CRITICAL: Skip modal buttons - don't interfere!
            if (button.id.startsWith('modal-') || button.closest('#coming-soon-modal')) {
                return;
            }

            console.log('[Theme] Applying direct listener to theme button:', button.id);

            // Add our handler DIRECTLY without cloning
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // Stop ALL other listeners

                const html = document.documentElement;
                const isDark = html.classList.contains('dark');
                const newTheme = isDark ? 'light' : 'dark';

                html.classList.remove('light', 'dark');
                html.classList.add(newTheme);
                html.style.colorScheme = newTheme;
                localStorage.setItem('theme', newTheme);

                console.log('[Theme] Toggled to:', newTheme);
            }, true); // Use capture phase to run BEFORE React

            button.dataset.themeFixedNew = 'true';
            fixed = true;
        });

        if (fixed) {
            console.log('[Theme] Theme switcher fixed with capturing listener');
        }
    }

    // ===========================
    // 3. FAQ ACCORDION - IMPROVED
    // ===========================
    function fixFaqAccordion() {
        // Add CSS to ensure hidden content is visible when opened
        if (!document.getElementById('faq-accordion-fix')) {
            const style = document.createElement('style');
            style.id = 'faq-accordion-fix';
            style.textContent = `
                /* Override hidden attribute on accordion content */
                [data-radix-accordion-content][data-state="open"],
                [role="region"][data-state="open"] {
                    display: block !important;
                    height: auto !important;
                }
                [data-radix-accordion-content][data-state="closed"],
                [role="region"][data-state="closed"] {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }

        const allAccordionButtons = document.querySelectorAll(
            '#faq button[data-state], [data-orientation="vertical"] button[data-state]'
        );

        let fixed = 0;
        allAccordionButtons.forEach(button => {
            if (button.dataset.accordionFixedNew === 'true') return;

            // Add our handler DIRECTLY without cloning
            button.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // Stop ALL other listeners

                const isOpen = this.getAttribute('data-state') === 'open';
                const contentId = this.getAttribute('aria-controls');
                const content = document.getElementById(contentId);
                const parent = this.closest('[data-state]');

                if (!content) {
                    console.warn('[FAQ] No content found for:', contentId);
                    return;
                }

                // Close ALL other accordion items first
                allAccordionButtons.forEach(otherBtn => {
                    if (otherBtn !== this) {
                        const otherContentId = otherBtn.getAttribute('aria-controls');
                        const otherContent = document.getElementById(otherContentId);
                        const otherParent = otherBtn.closest('[data-state]');

                        otherBtn.setAttribute('data-state', 'closed');
                        otherBtn.setAttribute('aria-expanded', 'false');
                        if (otherContent) {
                            otherContent.setAttribute('data-state', 'closed');
                            otherContent.hidden = true;
                        }
                        if (otherParent && otherParent !== otherBtn) {
                            otherParent.setAttribute('data-state', 'closed');
                        }
                    }
                });

                // Toggle current item
                if (isOpen) {
                    this.setAttribute('data-state', 'closed');
                    this.setAttribute('aria-expanded', 'false');
                    content.setAttribute('data-state', 'closed');
                    content.hidden = true;
                    if (parent) parent.setAttribute('data-state', 'closed');
                } else {
                    this.setAttribute('data-state', 'open');
                    this.setAttribute('aria-expanded', 'true');
                    content.setAttribute('data-state', 'open');
                    content.hidden = false;
                    content.removeAttribute('hidden');
                    if (parent) parent.setAttribute('data-state', 'open');
                }

                console.log('[FAQ] Toggled:', contentId, '→', isOpen ? 'closed' : 'open');
            }, true); // Use capture phase to run BEFORE Radix

            button.dataset.accordionFixedNew = 'true';
            fixed++;
        });

        if (fixed > 0) {
            console.log('[FAQ] Fixed', fixed, 'accordion buttons with capturing listeners');
        }
    }

    // ===========================
    // 4. DISCORD → LINKEDIN
    // ===========================
    function fixDiscordLinks() {
        const linkedInUrl = 'https://www.linkedin.com/in/abhnv07/';

        const linkedInIcon = `<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-5 shrink-0" style="width:20px;height:20px"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`;

        document.querySelectorAll('a').forEach(link => {
            const text = link.textContent.toLowerCase();
            const href = (link.href || '').toLowerCase();

            if (text.includes('discord') || href.includes('discord')) {
                link.href = linkedInUrl;
                link.target = '_blank';

                const textSpan = link.querySelector('span') || link;
                if (textSpan.textContent.toLowerCase().includes('discord')) {
                    textSpan.textContent = 'LinkedIn';
                }

                const svg = link.querySelector('svg');
                if (svg) {
                    svg.outerHTML = linkedInIcon;
                }
            }
        });
    }

    // ===========================
    // 5. REMOVE PLACEHOLDERS & UNBLUR
    // ===========================
    function removeUIArtifacts() {
        document.querySelectorAll('.animate-pulse, .hidden.h-9.w-28').forEach(el => {
            el.style.display = 'none';
        });

        document.querySelectorAll('header a, nav a').forEach(link => {
            link.style.setProperty('filter', 'none', 'important');
            link.style.setProperty('opacity', '1', 'important');
        });
    }

    // ===========================
    // RUN ALL FIXES
    // ===========================
    function runAllFixes() {
        console.log('[SubTrack Fixes] Running all fixes...');
        fixLogoSize();
        removeUIArtifacts();
        fixDiscordLinks();

        // Run theme and FAQ fixes with a small delay to ensure React is done
        setTimeout(() => {
            fixThemeSwitcher();
            fixFaqAccordion();
            console.log('[SubTrack Fixes] All fixes applied!');
        }, 100);
    }

    //Wait for React hydration to complete
    function waitForHydration() {
        const checkInterval = setInterval(() => {
            // Check if key elements are present
            const hasThemeButton = document.querySelector('button[id^="radix-"]');
            const hasFaqButtons = document.querySelectorAll('#faq button[data-state]').length > 0;

            if (hasThemeButton && hasFaqButtons) {
                console.log('[SubTrack Fixes] React hydration detected, applying fixes...');
                clearInterval(checkInterval);
                runAllFixes();

                // Re-apply fixes periodically to catch any late replacements
                setTimeout(runAllFixes, 1000);
                setTimeout(runAllFixes, 2000);
            }
        }, 100);

        // Safety timeout
        setTimeout(() => {
            clearInterval(checkInterval);
            runAllFixes();
        }, 5000);
    }

    // Start after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForHydration);
    } else {
        waitForHydration();
    }

})();
