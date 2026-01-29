// Firebase Authentication Guard for Protected Pages
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

console.log('[Firebase Auth Guard] Checking authentication status');

// Protected pages that require authentication
const protectedPages = ['/dashboard', '/dashboard.html'];
const currentPath = window.location.pathname;

// Check if current page is protected
const isProtectedPage = protectedPages.some(page => currentPath.includes(page));

if (isProtectedPage) {
    console.log('[Firebase Auth Guard] This is a protected page, verifying authentication');

    // Create and show a simple loading overlay
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'auth-loading';
    loadingDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--background, #ffffff);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
    `;
    loadingDiv.innerHTML = '<div style="text-align: center;"><div style="font-size: 14px; color: #888;">Verifying authentication...</div></div>';
    document.body.appendChild(loadingDiv);

    // Wait for Firebase auth state
    onAuthStateChanged(auth, (user) => {
        // Remove loading overlay
        const loading = document.getElementById('auth-loading');
        if (loading) loading.remove();

        if (user) {
            // User is signed in - show the dashboard
            console.log('[Firebase Auth Guard] User authenticated:', user.email);

            // Store user info in window for dashboard to access
            window.currentUser = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email.split('@')[0],
                photoURL: user.photoURL
            };
        } else {
            // No user is signed in, redirect to login
            console.log('[Firebase Auth Guard] No user authenticated, redirecting to login');
            window.location.replace('/login.html');
        }
    });
} else {
    console.log('[Firebase Auth Guard] This page does not require authentication');
}

// Export sign out function for use in dashboard
export async function signOut() {
    try {
        await auth.signOut();
        console.log('[Firebase Auth Guard] User signed out');
        window.location.replace('/login.html');
    } catch (error) {
        console.error('[Firebase Auth Guard] Sign out error:', error);
        alert('Error signing out. Please try again.');
    }
}
