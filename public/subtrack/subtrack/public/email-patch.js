/**
 * Runtime Override Patch for SubTrack
 * 
 * This script fixes:
 * 1. Email addresses (support@subtrack.abhnv.in → support@abhnv.in)
 * 2. Image paths & Mascots (Zoom, 3D, Swaps)
 * 3. Testimonials (IntelligentDragon → FiveSkill)
 * 4. Demo Page Fixes (Logo shift, Discord → LinkedIn)
 */

(function () {
    'use strict';

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
                // 1. Shift Logo Left
                const logo = document.querySelector('img[alt="SubTrack"]');
                if (logo) {
                    logo.style.transform = 'translateX(-10px)';
                    logo.style.transition = 'transform 0.1s ease';
                }

                // 2. Discord -> LinkedIn
                const discordLinks = document.querySelectorAll('a[href*="discord"]');
                discordLinks.forEach(link => {
                    link.href = 'https://www.linkedin.com/in/abhnv07/';
                    // Optional: Update text if it says "Discord"
                    if (link.textContent.includes('Discord')) {
                        link.textContent = link.textContent.replace('Discord', 'LinkedIn');
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
        fixEmailLinks();
        fixImagePaths();
        fixDemoPage();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll);
    else applyAll();

    setInterval(applyAll, 300); // Frequent check for fast Demo updates

    new MutationObserver(applyAll).observe(document.body, { childList: true, subtree: true });
})();
