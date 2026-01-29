// Firebase Authentication Handler for Registration Page
import { auth } from './firebase-config.js';
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

console.log('[Firebase Auth] Registration handler loaded');

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('[Firebase Auth] User already logged in, redirecting to dashboard');
        window.location.replace('/dashboard.html');
    }
});

// Helper functions
function showError(message) {
    alert(`Registration Error: ${message}`);
    console.error('[Firebase Auth]', message);
}

function showSuccess(message) {
    console.log('[Firebase Auth]', message);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Firebase Auth] Setting up registration form handlers');

    // Get form elements
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // Email/Password Registration
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent NextAuth from intercepting

            const email = emailInput?.value?.trim();
            const password = passwordInput?.value;
            const confirmPassword = confirmPasswordInput?.value;

            // Validation
            if (!email || !password || !confirmPassword) {
                showError('Please fill in all fields');
                return;
            }

            if (!isValidEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match');
                return;
            }

            try {
                console.log('[Firebase Auth] Creating account with email/password');
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Set display name from email
                const displayName = email.split('@')[0];
                await updateProfile(user, { displayName });

                console.log('[Firebase Auth] Account created successfully:', user.email);
                showSuccess('Account created successfully! Redirecting...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.replace('/dashboard.html');
                }, 500);
            } catch (error) {
                console.error('[Firebase Auth] Registration error:', error);

                // User-friendly error messages
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        showError('An account with this email already exists. Please sign in instead.');
                        break;
                    case 'auth/invalid-email':
                        showError('Please enter a valid email address.');
                        break;
                    case 'auth/weak-password':
                        showError('Password is too weak. Please use a stronger password.');
                        break;
                    case 'auth/operation-not-allowed':
                        showError('Email/password registration is not enabled. Please contact support.');
                        break;
                    default:
                        showError(error.message || 'Registration failed. Please try again.');
                }
            }
        });
    }

    // Google Sign Up - Find button by text content to avoid selector conflicts
    const allButtons = Array.from(document.querySelectorAll('button'));
    const googleButton = allButtons.find(btn => btn.textContent.includes('Google'));

    if (googleButton) {
        googleButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation(); // Prevent NextAuth from intercepting

            const provider = new GoogleAuthProvider();

            try {
                console.log('[Firebase Auth] Attempting Google sign up');
                const result = await signInWithPopup(auth, provider);
                const user = result.user;

                console.log('[Firebase Auth] Google sign up successful:', user.email);
                showSuccess('Signed up with Google! Redirecting...');

                // Redirect to dashboard
                setTimeout(() => {
                    window.location.replace('/dashboard.html');
                }, 500);
            } catch (error) {
                console.error('[Firebase Auth] Google sign up error:', error);

                switch (error.code) {
                    case 'auth/popup-closed-by-user':
                        showError('Sign up cancelled. Please try again.');
                        break;
                    case 'auth/popup-blocked':
                        showError('Popup blocked. Please allow popups for this site.');
                        break;
                    case 'auth/account-exists-with-different-credential':
                        showError('An account already exists with this email using a different sign-in method.');
                        break;
                    default:
                        showError(error.message || 'Google sign up failed. Please try again.');
                }
            }
        });
    }
});
