/**
 * Runtime Override Patch for SubTrack
 * 
 * This script fixes:
 * 1. Email addresses (support@subtrack.abhnv.in → support@abhnv.in)
 * 2. Image paths & Mascots (Zoom, 3D, Swaps)
 * 3. Testimonials (IntelligentDragon → FiveSkill)
 * 4. Demo Page Fixes (Logo shift RIGHT, Discord → LinkedIn)
 * 
 * PERFORMANCE: Runs synchronously before page render to prevent flashing
 */

(function () {
    'use strict';

    // Hide body initially to prevent flash
    if (document.body) {
        document.body.style.visibility = 'hidden';
    }

    const imagePathMap = {
        'fiveskill.webp': '/avatars/fiveskill.png',
        'fiveskill.png': '/avatars/fiveskill.png',
        'mugi.webp': '/avatars/mugi.png',
        'mugi.png': '/avatars/mugi.png',
        'kjas.webp': '/avatars/kjas.png',
        'kjas.png': '/avatars/kjas.png',
        // Testimonial Swap
        'intelligentdragon1.webp': '/avatars/fiveskill.png',

        // Defaut Maps
        'mascot-1.png': '/subtrack/images/onboarding/mascot-1.png',
        'mascot-2.png': '/subtrack/images/onboarding/mascot-2.png',
        'mascot-3.png': '/subtrack/images/onboarding/mascot-3.png',
        'mascot-4.png': '/subtrack/images/onboarding/mascot-4.png',
    };

    function fixSubTrackLogo() {
        try {
            // Replace all SubTrack logo images with static path
            const logos = document.querySelectorAll('img[alt="SubTrack"]');
            logos.forEach(logo => {
                // Replace Next.js optimized URLs with direct static path
                if (logo.src.includes('/subtrack/_next/image') || logo.srcset) {
                    logo.src = '/subtrack/_static/logo/logo.png';
                    logo.removeAttribute('srcset');
                    logo.removeAttribute('data-nimg');
                    logo.setAttribute('fetchpriority', 'high');
                }
            });
        } catch (e) { console.error(e); }
    }

    function fixEmailLinks() {
        try {
            const mailtoLinks = document.querySelectorAll('a[href^="mailto:support@subtrack.abhnv.in"]');
            mailtoLinks.forEach(link => link.href = 'mailto:support@abhnv.in');

            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
            let node;
            while (node = walker.nextNode()) {
                if (node.textContent.includes('support@subtrack.abhnv.in')) {
                    node.textContent = node.textContent.replace(/support@subtrack\.app/g, 'support@abhnv.in');
                }
            }
        } catch (e) { console.error(e); }
    }

    function fixDemoPage() {
        // Run only on demo pages (or if URL contains 'demo')
        if (window.location.pathname.includes('/subtrack/demo') || window.location.href.includes('demo')) {
            try {
                // 1. Shift Logo LEFT by 3px
                const logo = document.querySelector('img[alt="SubTrack"]');
                if (logo && logo.parentElement) {
                    logo.parentElement.style.transform = 'translateX(-3px)';
                    logo.parentElement.style.transition = 'none';
                }

                // 2. Discord -> LinkedIn (instant, no transition)
                const discordLinks = document.querySelectorAll('a[href*="discord"]');
                discordLinks.forEach(link => {
                    link.href = 'https://www.linkedin.com/in/abhnv07/';
                    link.style.transition = 'none';

                    // Replace text
                    const textNodes = [];
                    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT, null, false);
                    let node;
                    while (node = walker.nextNode()) {
                        textNodes.push(node);
                    }
                    textNodes.forEach(textNode => {
                        if (textNode.textContent.includes('Discord')) {
                            textNode.textContent = textNode.textContent.replace('Discord', 'LinkedIn');
                        }
                    });

                    // Replace old LinkedIn SVG with new one
                    const svg = link.querySelector('svg');
                    if (svg) {
                        // Completely clear old SVG and replace with new LinkedIn logo
                        svg.innerHTML = '';
                        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        svg.setAttribute('viewBox', '0 0 24 24');
                        svg.setAttribute('fill', 'currentColor');
                        svg.removeAttribute('stroke');
                        svg.removeAttribute('stroke-width');
                        svg.removeAttribute('stroke-linecap');
                        svg.removeAttribute('stroke-linejoin');

                        // Add new LinkedIn logo path
                        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        path.setAttribute('d', 'M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z');
                        svg.appendChild(path);
                    }
                });
            } catch (e) { console.error(e); }
        }
    }

    function fixImagePaths() {
        try {
            const images = document.querySelectorAll('img');

            images.forEach(img => {
                let currentSrc = img.src;
                const parent = img.parentElement;

                // --- GLOBAL ZOOM & 3D FOR MASCOTS ---
                if (currentSrc.includes('mascot-') && parent) {
                    let className = parent.className;
                    // Check if it's a card container (has size classes)
                    if (className.includes('size-')) {
                        if (!className.includes('help-onboarding-img')) {
                            // Apply Zoom
                            className = className.replace(/size-\d+/, 'size-48').replace(/sm:size-\d+/, 'sm:size-64');
                            // Apply 3D
                            className += ' help-onboarding-img';
                            parent.className = className;
                        }
                    }
                }

                if (currentSrc.includes('/subtrack/_next/image')) {
                    // --- TARGETED SWAP LOGIC ---
                    const anchor = img.closest('a');
                    const href = anchor ? anchor.getAttribute('href') : '';

                    let newMascot = null;

                    // Logic: Swap ONLY if links to specific articles (Bottom Section)
                    // Keep 1-4 if links to Categories (Top Section)

                    const isArticleLink = href && (
                        href.includes('/creating-your-account') ||
                        href.includes('/adding-your-first') ||
                        href.includes('/installing-mobile') ||
                        href.includes('/understanding-your-dashboard')
                    );

                    if (isArticleLink) {
                        if (currentSrc.includes('mascot-1.png')) newMascot = '/subtrack/images/onboarding/mascot-5.png';
                        else if (currentSrc.includes('mascot-2.png')) newMascot = '/subtrack/images/onboarding/mascot-6.png';
                        else if (currentSrc.includes('mascot-4.png')) newMascot = '/subtrack/images/onboarding/mascot-7.png';
                        else if (currentSrc.includes('mascot-6.png')) newMascot = '/subtrack/images/onboarding/mascot-8.png';
                    } else {
                        // Ensure Top Section (Category Links) use correct base mascots (1-4)
                        if (currentSrc.includes('mascot-1.png')) newMascot = '/subtrack/images/onboarding/mascot-1.png';
                        else if (currentSrc.includes('mascot-2.png')) newMascot = '/subtrack/images/onboarding/mascot-2.png';
                        else if (currentSrc.includes('mascot-3.png')) newMascot = '/subtrack/images/onboarding/mascot-3.png';
                        else if (currentSrc.includes('mascot-4.png')) newMascot = '/subtrack/images/onboarding/mascot-4.png';
                    }

                    if (newMascot) {
                        img.src = newMascot;
                        img.removeAttribute('srcset');
                        return;
                    }

                    // --- STANDARD MAP ---
                    for (const [key, val] of Object.entries(imagePathMap)) {
                        if (currentSrc.includes(key)) {
                            img.src = val;
                            img.removeAttribute('srcset');
                            break;
                        }
                    }
                }
            });
        } catch (e) { console.error(e); }
    }


    function applyAll() {
        fixSubTrackLogo();
        fixEmailLinks();
        fixImagePaths();
        // fixDemoPage(); // Handled via static CSS in demo.html

        // Show body after all fixes are applied
        if (document.body) {
            document.body.style.visibility = 'visible';
        }
    }

    // CRITICAL: Run synchronously IMMEDIATELY
    applyAll();

    // Backup: Also run on DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyAll);
    }

    // Monitor for dynamic changes (reduced frequency)
    setInterval(applyAll, 200);

    // Watch for DOM mutations
    new MutationObserver(applyAll).observe(document.body, { childList: true, subtree: true });
})();
