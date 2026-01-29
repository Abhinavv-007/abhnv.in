// Debug script to test modal button
(function () {
    'use strict';

    console.log('[DEBUG] Modal button debugger loaded');

    // Wait for modal to exist
    const checkInterval = setInterval(() => {
        const modal = document.getElementById('coming-soon-modal');
        const button = document.getElementById('close-modal');

        if (modal && button) {
            console.log('[DEBUG] Modal and button found!');
            console.log('[DEBUG] Button HTML:', button.outerHTML);
            console.log('[DEBUG] Button onclick attribute:', button.getAttribute('onclick'));
            console.log('[DEBUG] Button onclick property:', button.onclick);
            console.log('[DEBUG] Button at coordinates:', document.elementFromPoint(504, 564));

            // Add our own listener
            button.addEventListener('click', function (e) {
                console.log('[DEBUG] OUR LISTENER FIRED!');
                console.log('[DEBUG] Event:', e);
                window.closeComingSoonModal();
            }, true); // Use capturing phase

            console.log('[DEBUG] Debug listener attached');
            clearInterval(checkInterval);
        }
    }, 100);

    // Stop checking after 10 seconds
    setTimeout(() => clearInterval(checkInterval), 10000);
})();
