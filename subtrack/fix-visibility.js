'use strict';

console.log('[VISIBILITY-FIX] Loading visibility fix script');

// Force all content to be visible immediately
function forceVisibility() {
    console.log('[VISIBILITY-FIX] Forcing visibility on all elements');

    // Remove any scroll-lock classes
    if (document.body) {
        document.body.classList.remove('antigravity-scroll-lock');
        document.body.style.removeProperty('overflow');
    }

    // Force all elements with opacity:0 to be visible
    const hiddenElements = document.querySelectorAll('[style*="opacity:0"], [style*="opacity: 0"]');
    hiddenElements.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });

    // Add global CSS to override any hiding styles
    const style = document.createElement('style');
    style.id = 'visibility-fix-styles';
    style.innerHTML = `
        /* Force visibility for scroll-reveal elements */
        [style*="opacity:0"],
        [style*="opacity: 0"] {
            opacity: 1 !important;
            transform: none !important;
            visibility: visible !important;
        }
        
        /* Remove scroll lock */
        body.antigravity-scroll-lock {
            overflow: auto !important;
        }
        
        /* Ensure sections are visible */
        section {
            opacity: 1 !important;
            visibility: visible !important;
        }
    `;

    // Only add if not already present
    if (!document.getElementById('visibility-fix-styles')) {
        document.head.appendChild(style);
    }

    console.log('[VISIBILITY-FIX] Visibility fix applied');
}

// Run immediately
forceVisibility();

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceVisibility);
} else {
    forceVisibility();
}

// Run on window load
window.addEventListener('load', forceVisibility);

// Run after potential React hydration
setTimeout(forceVisibility, 100);
setTimeout(forceVisibility, 500);
setTimeout(forceVisibility, 1000);

console.log('[VISIBILITY-FIX] Script initialized');
