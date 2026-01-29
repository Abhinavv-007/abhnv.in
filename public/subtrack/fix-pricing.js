'use strict';

console.log('[PRICING-FIX] Loading pricing fix script');

/**
 * FIXED: This script was previously using querySelectorAll('*') and setting
 * textContent on all elements, which DESTROYS the DOM structure.
 * 
 * Now we only target specific elements that need text changes.
 */
function updatePricing() {
    console.log('[PRICING-FIX] Updating pricing section');

    try {
        // Find the pricing section
        const pricingSection = document.getElementById('pricing') || document.querySelector('section[id="pricing"]');

        if (!pricingSection) {
            console.log('[PRICING-FIX] Pricing section not found, will retry');
            return false;
        }

        console.log('[PRICING-FIX] Found pricing section');

        // Update headline - be specific about which h2
        const headlines = pricingSection.querySelectorAll('h2');
        headlines.forEach(headline => {
            if (headline.textContent.includes('One Payment')) {
                headline.textContent = 'Simple Pricing';
                console.log('[PRICING-FIX] Updated headline');
            }
        });

        // Update specific subtext elements - only direct text content
        pricingSection.querySelectorAll('p.text-muted-foreground').forEach(subtext => {
            if (subtext.textContent.includes('once')) {
                subtext.textContent = 'Choose monthly or yearly. Cancel anytime.';
                console.log('[PRICING-FIX] Updated subtext');
            }
        });

        // Only update text in SPECIFIC leaf-level elements
        // Target span and text elements, NOT containers
        const textOnlyElements = pricingSection.querySelectorAll('span, p');
        textOnlyElements.forEach(el => {
            // Skip if element has child elements (not a leaf)
            if (el.children.length > 0) return;

            const text = el.textContent;
            let newText = text;

            // Only make specific safe replacements
            if (text.includes('Discord alerts')) {
                newText = newText.replace(/Discord alerts/g, 'Email & push alerts');
            }

            if (text.toLowerCase() === 'lifetime' || text.toLowerCase().includes('lifetime license')) {
                newText = newText.replace(/lifetime/gi, 'subscription');
            }

            if (text.toLowerCase() === 'license') {
                newText = newText.replace(/license/gi, 'subscription');
            }

            if (newText !== text) {
                el.textContent = newText;
                console.log('[PRICING-FIX] Updated text:', text, '->', newText);
            }
        });

        // Hide "Popular" badges by class or specific text
        pricingSection.querySelectorAll('span, div').forEach(el => {
            if (el.children.length === 0 && (el.textContent.trim() === 'Popular' || el.textContent.trim() === 'POPULAR')) {
                el.style.display = 'none';
                console.log('[PRICING-FIX] Hid Popular badge');
            }
        });

        console.log('[PRICING-FIX] Pricing update complete - DOM structure preserved');
        return true;
    } catch (error) {
        console.error('[PRICING-FIX] Error updating pricing:', error);
        return false;
    }
}

// Run after DOM is ready and React has hydrated
let attempts = 0;
const maxAttempts = 10;

function tryUpdate() {
    attempts++;
    const success = updatePricing();

    if (!success && attempts < maxAttempts) {
        console.log(`[PRICING-FIX] Retry ${attempts}/${maxAttempts}`);
        setTimeout(tryUpdate, 300);
    } else if (success) {
        console.log('[PRICING-FIX] Successfully updated pricing');
    } else {
        console.log('[PRICING-FIX] Failed to find pricing section after all attempts');
    }
}

// Start after hydration
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(tryUpdate, 1000);
    });
} else {
    setTimeout(tryUpdate, 1000);
}

// Backup on window load
window.addEventListener('load', () => {
    setTimeout(updatePricing, 2000);
});

console.log('[PRICING-FIX] Script initialized');
