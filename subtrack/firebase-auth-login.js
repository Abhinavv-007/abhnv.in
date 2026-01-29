// Firebase Authentication Handler for Login Page
import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

console.log('[Firebase Auth] Login handler loaded');

// Set persistence to local (survives browser restarts)
setPersistence(auth, browserLocalPersistence)
    .then(() => {
        console.log('[Firebase Auth] Persistence set to LOCAL');
    })
    .catch((error) => {
        console.error('[Firebase Auth] Persistence error:', error);
    });

// Check if user is already logged in and redirect to dashboard
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('[Firebase Auth] User already logged in, redirecting to dashboard');
        // Use replace to avoid back button issues
        window.location.replace('/dashboard.html');
    }
});

// Helper function to show error messages
function showError(message) {
    alert(`Login Error: ${message}`);
    console.error('[Firebase Auth]', message);
}

function showSuccess(message) {
    console.log('[Firebase Auth]', message);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Firebase Auth] Setting up login form handlers');

    // Get form elements
    const passwordForm = document.querySelector('form');
    const emailInput = document.getElementById('email-password');
    const passwordInput = document.getElementById('password');

    // Email/Password Sign In
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent NextAuth from intercepting

            const email = emailInput?.value?.trim();
            const password = passwordInput?.value;

            if (!email || !password) {
                showError('Please enter both email and password');
                return;
            }

            try {
                console.log('[Firebase Auth] Attempting email/password sign in');
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                showSuccess('Login successful! Redirecting...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.replace('/dashboard.html');
                }, 500);
            } catch (error) {
                console.error('[Firebase Auth] Sign in error:', error);

                // User-friendly error messages
                switch (error.code) {
                    case 'auth/user-not-found':
                        showError('No account found with this email. Please sign up first.');
                        break;
                    case 'auth/wrong-password':
                        showError('Incorrect password. Please try again.');
                        break;
                    case 'auth/invalid-email':
                        showError('Please enter a valid email address.');
                        break;
                    case 'auth/invalid-credential':
                        showError('Invalid email or password. Please check and try again.');
                        break;
                    case 'auth/too-many-requests':
                        showError('Too many failed attempts. Please try again later.');
                        break;
                    default:
                        showError(error.message || 'Login failed. Please try again.');
                }
            }
        });
    }

    // Google Sign In - Find button by text content to avoid selector conflicts
    const allButtons = Array.from(document.querySelectorAll('button'));
    const googleButton = allButtons.find(btn => btn.textContent.includes('Google'));

    if (googleButton) {
        googleButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent NextAuth from intercepting

            const provider = new GoogleAuthProvider();

            try {
                console.log('[Firebase Auth] Attempting Google sign in');
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                console.log('[Firebase Auth] Google sign in successful:', user.email);
                showSuccess('Signed in with Google! Redirecting...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.replace('/dashboard.html');
                }, 500);
            } catch (error) {
                console.error('[Firebase Auth] Google sign in error:', error);

                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        showError('Sign in cancelled. Please try again.');
                        break;
                    case 'auth/popup-blocked':
                        showError('Popup blocked. Please allow popups for this site.');
                        break;
                    default:
                        showError(error.message || 'Google sign in failed. Please try again.');
                }
            }
        });
    }
});
