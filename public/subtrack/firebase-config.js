// Firebase Configuration for SubTrack
// ⚠️ REPLACE THESE WITH YOUR ACTUAL FIREBASE CREDENTIALS
// Get them from: https://console.firebase.google.com → Project Settings → General

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';

// Subtrack Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCGiBjvwQSLIN-UxGBXUb-aRLXSp1_wb_0",
    authDomain: "subtrackers.firebaseapp.com",
    projectId: "subtrackers",
    storageBucket: "subtrackers.firebasestorage.app",
    messagingSenderId: "387052943812",
    appId: "1:387052943812:web:acbcc72a0405d20ee54c91",
    measurementId: "G-RJFGQLVKVJ"
};

// Initialize Firebase
let app;
let auth;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('[Firebase] Initialized successfully');
} catch (error) {
    console.error('[Firebase] Initialization failed:', error);
    console.warn('[Firebase] Make sure to update firebase-config.js with your actual credentials');
}

export { auth };
