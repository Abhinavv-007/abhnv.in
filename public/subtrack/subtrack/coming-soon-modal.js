// Coming Soon Modal - ULTRA SIMPLE working version
(function () {
  'use strict';

  console.log('[MODAL] Script loaded');

  if (!window.SUBTRACK_COMING_SOON_CONFIG) {
    console.warn('[MODAL] Config not found');
    return;
  }

  const config = window.SUBTRACK_COMING_SOON_CONFIG;

  window.showComingSoonModal = function () {
    console.log('[MODAL] Showing modal');

    if (document.getElementById('coming-soon-modal')) {
      return; //already exists
    }

    const modalHTML = `
            <div id="coming-soon-modal" class="coming-soon-overlay" style="position:fixed; inset:0; background:rgba(0,0,0,0.75); backdrop-filter:blur(8px); z-index:9999999; display:flex; align-items:center; justify-content:center; padding:1rem;">
                <div class="coming-soon-modal" style="background:hsl(var(--background)); border:1px solid hsl(var(--border)); border-radius:1.5rem; padding:2rem; max-width:28rem; width:100%; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5);">
                    <div class="coming-soon-badge" style="display:inline-flex; align-items:center; gap:0.5rem; padding:0.25rem 0.75rem; background:hsl(var(--primary)/0.1); color:hsl(var(--primary)); border-radius:9999px; font-size:0.75rem; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:1rem;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="12"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                        ${config.badge}
                    </div>
                    <h2 class="coming-soon-title" style="font-size:1.875rem; font-weight:700; color:hsl(var(--foreground)); margin-bottom:0.75rem; line-height:1.2;">${config.title}</h2>
                    <p class="coming-soon-subtitle" style="color:hsl(var(--muted-foreground)); font-size:0.875rem; line-height:1.5; margin-bottom:1.5rem;">${config.subtitle}</p>
                    <div style="display:flex; flex-direction:column; gap:0.75rem;">
                        <a href="${config.demoUrl}" style="display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.625rem 1.5rem; border-radius:1rem; font-size:0.875rem; font-weight:500; text-decoration:none; cursor:pointer; border:none; width:100%; background:hsl(var(--primary)); color:hsl(var(--primary-foreground)); transition:all 0.2s;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path></svg>
                            View Demo
                        </a>
                        <button id="modal-close-btn" style="display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; padding:0.625rem 1.5rem; border-radius:1rem; font-size:0.875rem; font-weight:500; cursor:pointer; border:none; width:100%; background:hsl(var(--secondary)); color:hsl(var(--secondary-foreground)); transition:all 0.2s;">
                            Close
                        </button>
                    </div>
                    <div style="display:flex; align-items:center; justify-content:center; gap:1rem; margin-top:1rem; padding-top:1rem; border-top:1px solid hsl(var(--border));">
                        <a href="${config.contactUrl}" target="_blank" rel="noopener noreferrer" style="color:hsl(var(--muted-foreground)); font-size:0.75rem; text-decoration:none;">Contact</a>
                        <span style="color: hsl(var(--border));">•</span>
                        <a href="${config.linkedInUrl}" target="_blank" rel="noopener noreferrer" style="color:hsl(var(--muted-foreground)); font-size:0.75rem; text-decoration:none;">LinkedIn</a>
                    </div>
                </div>
            </div>
        `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';

    const modal = document.getElementById('coming-soon-modal');
    const closeBtn = document.getElementById(`modal-close-btn`);

    function closeModal() {
      console.log('[MODAL] Closing');
      if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.remove();
          document.body.style.overflow = '';
        }, 200);
      }
    }

    // Close on button click
    closeBtn.onclick = closeModal;

    // Close on overlay click (clicking outside modal)
    modal.onclick = function (e) {
      if (e.target === modal) {
        closeModal();
      }
    };

    // Close on ESC
    document.onkeydown = function (e) {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    console.log('[MODAL] Ready');
  };

  window.closeComingSoonModal = function () {
    const modal = document.getElementById('coming-soon-modal');
    if (modal) {
      modal.remove();
      document.body.style.overflow = '';
    }
  };

  console.log('[MODAL] Functions exported');
})();
