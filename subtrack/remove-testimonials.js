'use strict';

console.log('[DOM-FIXER] Script loaded');

function patchAllImages() {
    const images = document.querySelectorAll('img');
    let patched = 0;

    images.forEach(img => {
        if (img.src && img.src.includes('/_next/image?url=')) {
            try {
                const url = new URL(img.src);
                const actualPath = url.searchParams.get('url');
                if (actualPath) {
                    img.src = actualPath;
                    img.srcset = '';
                    img.removeAttribute('srcset');
                    patched++;
                }
            } catch (e) {
                const match = img.src.match(/[?&]url=([^&]+)/);
                if (match) {
                    img.src = decodeURIComponent(match[1]);
                    img.srcset = '';
                    img.removeAttribute('srcset');
                    patched++;
                }
            }
        }
    });

    if (patched > 0) {
        console.log(`[DOM-FIXER] ✅ Patched ${patched} dashboard images`);
    }
    return patched;
}

function removeMascots() {
    // Remove SubTrack mascots and any mascot images
    const mascotSelectors = [
        'img[alt*="mascot" i]',
        'img[alt*="Mascot" i]',
        'img[alt*="vexly" i]',
        'img[alt*="SubTrack" i]',
        'img[src*="mascot"]',
        'img[src*="vexly"]',
        'img[src*="hero-mascot"]',
        'img[src*="cta-mascot"]'
    ];

    let removed = 0;

    mascotSelectors.forEach(selector => {
        const imgs = document.querySelectorAll(selector);
        imgs.forEach(img => {
            console.log('[DOM-FIXER] Removing mascot img:', img.alt || img.src);
            img.style.display = 'none'; // Hide instead of remove to avoid breaking layout
            removed++;
        });
    });

    if (removed > 0) {
        console.log(`[DOM-FIXER] ✅ Removed ${removed} mascot elements`);
    }
    return removed;
}

function removeTestimonials() {
    /**
     * UPDATED: Remove ONLY the OLD SubTrack/Discord testimonials
     * KEEP the Reddit reviews (IntelligentDragon1 and kjas)
     * 
     * Strategy: Look for sections with specific OLD testimonial keywords
     * that are NOT the Reddit reviews we want to keep.
     */

    // These are the OLD testimonial keywords to REMOVE
    const oldTestimonialKeywords = [
        'phs318u',        // Old Hacker News testimonial
        'FiveSkill',      // Old Discord testimonial
        'talking about too many subscriptions',  // Part of phs318u
        'Love how straightforward'  // Part of FiveSkill
    ];

    // These are keywords from Reddit reviews we want to KEEP
    const keepKeywords = [
        'IntelligentDragon1',
        'kjas',
        'I started using it a few weeks ago',
        'I was losing track of all my subscriptions'
    ];

    const sections = document.querySelectorAll('section');
    let removed = 0;

    sections.forEach(section => {
        const text = section.textContent.toLowerCase();

        // Check if this section contains any keywords we want to KEEP
        const shouldKeep = keepKeywords.some(kw => text.includes(kw.toLowerCase()));

        if (shouldKeep) {
            // This is a section with Reddit reviews - DO NOT REMOVE
            console.log('[DOM-FIXER] Keeping Reddit testimonial section');
            return;
        }

        // Check if this section contains OLD testimonials we want to remove
        const hasOldTestimonial = oldTestimonialKeywords.some(kw => text.includes(kw.toLowerCase()));

        if (hasOldTestimonial) {
            console.log('[DOM-FIXER] Hiding OLD testimonial section');
            section.style.display = 'none';
            removed++;
        }
    });

    if (removed > 0) {
        console.log(`[DOM-FIXER] ✅ Removed ${removed} OLD testimonials`);
    }
    return removed;
}

function cleanup() {
    console.log('[DOM-FIXER] Running cleanup...');
    patchAllImages();
    removeMascots();
    removeTestimonials();
}

// CRITICAL: Wait for Next.js hydration to complete before modifying DOM
// This prevents breaking the theme switcher and other React components

function waitForHydration() {
    // Wait for React to hydrate by checking if the theme button exists
    const themeButton = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('Toggle theme')
    );

    if (themeButton) {
        console.log('[DOM-FIXER] Theme button found, React likely hydrated');
        // Wait a bit more to be safe
        setTimeout(() => {
            console.log('[DOM-FIXER] Starting cleanup after hydration');
            cleanup();
        }, 500);
        return true; // Stop retrying
    } else {
        console.log('[DOM-FIXER] Theme button not found yet, retrying...');
        setTimeout(waitForHydration, 100);
        return false;
    }
}

// Start the hydration wait process
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(waitForHydration, 1000);
    });
} else {
    setTimeout(waitForHydration, 1000);
}

// Also run on window load as backup
window.addEventListener('load', () => {
    setTimeout(cleanup, 2000);
});

// Set up observer to catch new mascots added by React
function startObserver() {
    if (!document.body) {
        setTimeout(startObserver, 10);
        return;
    }

    const observer = new MutationObserver(() => {
        // Only remove mascots, don't patch images repeatedly
        clearTimeout(window.domFixerTimeout);
        window.domFixerTimeout = setTimeout(() => {
            removeMascots();
        }, 100);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'srcset', 'alt']
    });

    console.log('[DOM-FIXER] ✅ Observer active - monitoring for mascots');
}

// Start observer after hydration
setTimeout(startObserver, 3000);
