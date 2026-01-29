// Modal Button Fix - Re-attach handler AFTER fix-all-issues.js runs
(function () {
    'use strict';

    console.log('[MODAL FIX] Loading...');

    function attachModalHandler() {
        const closeBtn = document.getElementById('modal-close-btn');
        if (!closeBtn) {
            return;
        }

        console.log('[MODALFIX] Attaching close handler');

        // Remove ALL existing listeners by cloning and replacing
        const newBtn = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newBtn, closeBtn);

        // Add fresh listener that closes the modal
        newBtn.addEventListener('click', function (e) {
            console.log('[MODAL FIX] Close button clicked!');
            const modal = document.getElementById('coming-soon-modal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        }, { capture: true, once: true }); // Use capture=true to run BEFORE other listeners

        console.log('[MODAL FIX] Handler attached!');
    }

    // Wait for modal to appear, then fix it
    const observer = new MutationObserver(() => {
        if (document.getElementById('coming-soon-modal')) {
            console.log('[MODAL FIX] Modal detected, attaching handler in 500ms...');
            setTimeout(attachModalHandler, 500); // Wait for fix-all-issues.js to run
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    console.log('[MODAL FIX] Watching for modal...');
})();
