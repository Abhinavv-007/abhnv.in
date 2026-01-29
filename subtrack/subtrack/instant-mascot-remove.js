// Instant mascot removal and image optimization
(function () {
    'use strict';

    // Hide mascot images IMMEDIATELY
    function hideMascots() {
        const style = document.createElement('style');
        style.textContent = `
      /* Hide all mascot images instantly */
      img[alt*="mascot" i],
      img[src*="mascot" i],
      .mascot-container,
      [class*="mascot"] img {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
      }
      
      /* Optimize image loading */
      img {
        image-rendering: -webkit-optimize-contrast;
        image-rendering: crisp-edges;
      }
    `;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Run immediately - before DOM loads
    hideMascots();

    // Also run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideMascots);
    }

    console.log('[Mascot Remover] Instant hide applied');
})();
