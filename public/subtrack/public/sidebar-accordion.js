/**
 * SubTrack Sidebar Accordion & Hydration
 * - Implements exclusive accordion behavior (one open at a time).
 * - Hydrates missing sub-links for smooth navigation across sections.
 */

(function () {
    'use strict';

    console.log('[Sidebar] Initializing Accordion & Hydration...');

    // 1. Full Navigation Map
    const SIDEBAR_DATA = {
        "Getting Started": {
            path: "getting-started",
            links: [
                { text: "Creating your account", file: "creating-your-account.html" },
                { text: "Adding your first subscription", file: "adding-your-first-subscription.html" },
                { text: "Understanding your dashboard", file: "understanding-your-dashboard.html" },
                { text: "Installing mobile app", file: "installing-mobile-app.html" }
            ]
        },
        "Managing Subscriptions": {
            path: "subscriptions",
            links: [
                { text: "How to add a subscription", file: "how-to-add-subscription.html" },
                { text: "Using auto-renew setting", file: "using-auto-renew-setting.html" },
                { text: "Tracking lifetime purchases", file: "tracking-lifetime-purchases.html" },
                { text: "Custom billing cycles", file: "custom-billing-cycles.html" },
                { text: "Using categories", file: "using-categories.html" },
                { text: "Understanding monthly cost", file: "understanding-monthly-cost-calculations.html" }
            ]
        },
        "Family Sharing": {
            path: "family",
            links: [
                { text: "Adding family members", file: "adding-family-members.html" },
                { text: "Assigning subscriptions", file: "assigning-subscriptions-to-members.html" },
                { text: "Setting default family member", file: "setting-default-family-member.html" }
            ]
        },
        "Billing & Payments": {
            path: "billing",
            links: [
                { text: "Understanding pricing plans", file: "understanding-pricing-plans.html" },
                { text: "Purchase not syncing", file: "purchase-not-syncing.html" },
                { text: "Checkout not working", file: "checkout-not-working.html" },
                { text: "Refund policy", file: "refund-policy.html" }
            ]
        },
        "Account & Security": {
            path: "account",
            links: [
                { text: "Data Privacy and Security", file: "data-privacy-and-security.html" },
                { text: "Setting Your Timezone", file: "setting-your-timezone.html" },
                { text: "Setting Your Base Currency", file: "setting-base-currency.html" },
                { text: "Notification Settings", file: "notification-settings.html" }
            ]
        },
        "Troubleshooting": {
            path: "troubleshooting",
            links: [
                { text: "Contact Support", file: "contact-support.html" },
                { text: "Push notifications not working", file: "push-notifications-not-working.html" },
                { text: "Checkout errors", file: "checkout-errors.html" }
            ]
        }
    };

    // Helper: Determining current relative depth
    function getRelativePathPrefix() {
        const path = window.location.pathname;
        if (path.includes('/subtrack/help/getting-started/') ||
            path.includes('/subtrack/help/subscriptions/') ||
            path.includes('/subtrack/help/family/') ||
            path.includes('/subtrack/help/billing/') ||
            path.includes('/subtrack/help/account/') ||
            path.includes('/subtrack/help/troubleshooting/')) {
            return '../';
        }
        return './'; // Fallback
    }

    // 2. Initialize Logic
    function initSidebar() {
        const buttons = document.querySelectorAll('aside nav button');
        const overlay = document.querySelector('aside nav div div ul'); // Some structures might differ

        buttons.forEach(btn => {
            // Identify section name
            const span = btn.querySelector('span');
            if (!span) return;
            const sectionName = span.textContent.trim();

            // Normalize section name (remove extra spaces/newlines)
            const key = Object.keys(SIDEBAR_DATA).find(k => k.toLowerCase() === sectionName.toLowerCase().replace(/\s+/g, ' '));

            if (!key) return;

            const parentLi = btn.closest('li');
            if (!parentLi) return;

            // Check if sub-list exists
            let subList = parentLi.querySelector('ul');

            // Hydrate if missing
            if (!subList) {
                const data = SIDEBAR_DATA[key];
                subList = document.createElement('ul');
                subList.className = 'mt-1 space-y-1 px-2 hidden'; // Start hidden

                // Determine correct prefix to reach root of help section relative to current file
                // If we are in /help/account/x.html, we need ../ for other sections? 
                // Wait, most files are in /help/CAT/file.html.
                // Links to same category: file.html
                // Links to diff category: ../other-cat/file.html

                // Let's simplify: Use Absolute Paths if possible? 
                // Or dynamic relative.
                const currentPath = window.location.pathname;
                const isDeep = currentPath.split('/').length > 3; // /help/cat/file

                data.links.forEach(link => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.className = 'block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground';
                    a.textContent = link.text;

                    // Logic for href
                    // If we are in "Account" and link is "Account", just filename.
                    // If we are in "Account" and link is "Billing", ../billing/filename.

                    if (currentPath.includes(`/${data.path}/`)) {
                        a.href = link.file;
                    } else if (isDeep) {
                        a.href = `../${data.path}/${link.file}`;
                    } else {
                        // We might be on /help.html?
                        a.href = `help/${data.path}/${link.file}`;
                    }

                    // Highlight active
                    if (currentPath.endsWith(link.file)) {
                        a.classList.add('bg-muted', 'text-foreground');
                        a.classList.remove('text-muted-foreground');
                        // Auto-open this section
                        btn.dataset.forceOpen = 'true';
                    }

                    li.appendChild(a);
                    subList.appendChild(li);
                });

                parentLi.appendChild(subList);
            } else {
                // Ensure existing sublist has a class for toggling
                subList.classList.add('transition-all');
            }

            // Click Handler
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const isAlreadyOpen = !subList.classList.contains('hidden') && subList.style.display !== 'none';

                // 1. Close ALL others
                document.querySelectorAll('aside nav ul > li > ul').forEach(el => {
                    el.classList.add('hidden');
                    el.style.display = 'none';
                    // Reset Chevron
                    const otherBtn = el.parentElement.querySelector('button svg');
                    if (otherBtn) otherBtn.style.transform = 'rotate(0deg)';
                });

                // 2. Toggle Current
                if (!isAlreadyOpen) {
                    subList.classList.remove('hidden');
                    subList.style.display = 'block';
                    const chevron = btn.querySelector('svg');
                    if (chevron) chevron.style.transform = 'rotate(180deg)';
                }
            });

            // Auto-open if marked (current page)
            if (btn.dataset.forceOpen === 'true' ||
                (subList && subList.innerHTML.includes('text-foreground') && !subList.innerHTML.includes('hover:text-foreground'))) {
                subList.classList.remove('hidden');
                subList.style.display = 'block';
                const chevron = btn.querySelector('svg');
                if (chevron) chevron.style.transform = 'rotate(180deg)';
            } else {
                // Ensure closed start
                subList.classList.add('hidden');
                subList.style.display = 'none';
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSidebar);
    } else {
        initSidebar();
    }
})();
