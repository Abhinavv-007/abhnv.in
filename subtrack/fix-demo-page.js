(function () {
    'use strict';

    console.log('[Demo Fixes] Starting demo page fixes...');

    // ===========================
    // 1. ADD LOGO TO DEMO SIDEBAR
    // ===========================
    function addDemoLogo() {
        // Find sidebar logo area
        const sidebarLogos = document.querySelectorAll('aside a[href="index.html"], aside a[href="/"]');

        sidebarLogos.forEach(logoLink => {
            if (logoLink.dataset.logoFixed) return;
            logoLink.dataset.logoFixed = 'true';

            const img = logoLink.querySelector('img');
            if (img) {
                // Logo already exists, just ensure correct size
                img.style.width = '32px';
                img.style.height = '32px';
                console.log('[Demo Logo] Logo already present, size ensured');
            } else {
                // Add logo if missing
                const newLogo = document.createElement('img');
                newLogo.src = '_static/logo/logo.png';
                newLogo.alt = 'SubTrack';
                newLogo.width = 32;
                newLogo.height = 32;
                newLogo.className = 'ml-1.5 size-8 shrink-0';
                newLogo.style.cssText = 'color: transparent';

                // Insert before the text span if it exists
                const span = logoLink.querySelector('span');
                if (span) {
                    logoLink.insertBefore(newLogo, span);
                } else {
                    logoLink.appendChild(newLogo);
                }

                console.log('[Demo Logo] Logo added to sidebar');
            }
        });
    }

    // ===========================
    // 2. FIX SIDEBAR DISCORD → LINKEDIN
    // ===========================
    function fixSidebarCommunityLink() {
        // Find all sidebar links in the COMMUNITY section
        const sidebarLinks = document.querySelectorAll('aside nav a[href*="discord"], aside nav a:not([href])');

        sidebarLinks.forEach(link => {
            // Check if this is a Discord link by looking at the text or href
            const linkText = link.textContent.trim();
            const svg = link.querySelector('svg');

            if (linkText.toLowerCase().includes('community') || linkText.toLowerCase().includes('discord')) {
                if (link.dataset.linkedinFixed) return;
                link.dataset.linkedinFixed = 'true';

                // Update href to LinkedIn
                link.href = 'https://www.linkedin.com/in/abhnv07/';
                link.target = '_blank';
                link.rel = 'noopener';

                // Update the icon to LinkedIn
                if (svg) {
                    svg.setAttribute('viewBox', '0 0 24 24');
                    svg.setAttribute('fill', 'currentColor');
                    svg.innerHTML = '<title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>';
                }

                // Update the text
                const textSpan = link.querySelector('span');
                if (textSpan) {
                    textSpan.textContent = 'LinkedIn';
                }

                console.log('[Sidebar] Updated Community link to LinkedIn');
            }
        });

        // Also check for the specific LinkedIn link that already exists
        const linkedInLinks = document.querySelectorAll('aside nav a[href*="linkedin"]');
        linkedInLinks.forEach(link => {
            const textSpan = link.querySelector('span');
            if (textSpan && textSpan.textContent !== 'LinkedIn') {
                textSpan.textContent = 'LinkedIn';
                console.log('[Sidebar] Updated LinkedIn link text');
            }
        });
    }

    // ===========================
    // RUN ALL FIXES
    // ===========================
    function runAllFixes() {
        console.log('[Demo Fixes] Running all fixes...');
        addDemoLogo();
        fixSidebarCommunityLink();
        console.log('[Demo Fixes] All fixes applied!');
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllFixes);
    } else {
        runAllFixes();
    }

    // Watch for DOM changes (React might re-render)
    const observer = new MutationObserver(() => {
        addDemoLogo();
        fixSidebarCommunityLink();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('[Demo Fixes] Watching for DOM changes...');

})();
