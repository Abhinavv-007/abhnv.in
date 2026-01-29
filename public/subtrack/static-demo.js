
document.addEventListener('DOMContentLoaded', function () {
    console.log("Initializing static demo interactions...");

    // Sidebar Toggle Logic
    const toggleButtons = document.querySelectorAll('button[aria-label="Toggle sidebar"], button[data-toggle="sidebar"]');
    const sidebar = document.querySelector('aside');
    const mainContent = document.querySelector('main');

    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            if (sidebar) {
                sidebar.classList.toggle('hidden');
                sidebar.classList.toggle('-translate-x-full');
            }
        });
    });

    // Remove "Loading demo data..." if it exists in the static file
    const loader = document.evaluate("//div[contains(text(),'Loading demo data...')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if (loader) {
        loader.style.display = 'none';
    }

    // Ensure content is visible
    if (mainContent) {
        mainContent.style.opacity = '1';
        mainContent.style.visibility = 'visible';
    }
});
