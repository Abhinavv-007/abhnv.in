// SubTrack Mock Authentication Service
// Provides client-side authentication for demo purposes
// Uses localStorage to simulate user sessions

(function () {
    'use strict';

    console.log('[AUTH] Mock authentication service loaded');

    // Auth state management
    const AUTH_KEY = 'subtrack_auth';
    const USERS_KEY = 'subtrack_users';

    // Initialize demo users if they don't exist
    function initDemoUsers() {
        if (!localStorage.getItem(USERS_KEY)) {
            const demoUsers = [
                {
                    id: '1',
                    email: 'demo@subtrack.abhnv.in',
                    password: 'demo123',
                    name: 'Demo User',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
            console.log('[AUTH] Demo users initialized');
        }
    }

    // Get all users
    function getUsers() {
        const usersJson = localStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    }

    // Save users
    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    // Get current session
    function getSession() {
        const sessionJson = localStorage.getItem(AUTH_KEY);
        return sessionJson ? JSON.parse(sessionJson) : null;
    }

    // Save session
    function saveSession(user) {
        const session = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            },
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(session));
        console.log('[AUTH] Session saved for:', user.email);
    }

    // Clear session
    function clearSession() {
        localStorage.removeItem(AUTH_KEY);
        console.log('[AUTH] Session cleared');
    }

    // Check if user is authenticated
    function isAuthenticated() {
        const session = getSession();
        if (!session) return false;

        // Check if session expired
        if (new Date(session.expiresAt) < new Date()) {
            clearSession();
            return false;
        }

        return true;
    }

    // Login function
    function login(email, password) {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            return { success: false, error: 'No account found with this email' };
        }

        if (user.password !== password) {
            return { success: false, error: 'Incorrect password' };
        }

        saveSession(user);
        return { success: true, user: user };
    }

    // Register function
    function register(email, password, name = '') {
        const users = getUsers();

        // Check if user already exists
        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: 'An account with this email already exists' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            email: email,
            password: password,
            name: name || email.split('@')[0],
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);
        saveSession(newUser);

        console.log('[AUTH] New user registered:', email);
        return { success: true, user: newUser };
    }

    // Logout function
    function logout() {
        clearSession();
        window.location.href = '/index.html';
    }

    // Magic link "login" (just a mock)
    function sendMagicLink(email) {
        // In a real app, this would send an email
        // For demo, we'll just log the user in if they exist
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (user) {
            saveSession(user);
            return { success: true, message: 'Magic link sent! (Demo: auto-logged in)' };
        } else {
            return { success: false, error: 'No account found with this email' };
        }
    }

    // Protect dashboard pages
    function protectPage() {
        // List of pages that require authentication
        const protectedPages = ['/dashboard', '/dashboard.html'];
        const currentPath = window.location.pathname;

        if (protectedPages.some(page => currentPath.includes(page))) {
            if (!isAuthenticated()) {
                console.log('[AUTH] Redirecting to login - not authenticated');
                window.location.href = '/login.html';
                return false;
            }
            console.log('[AUTH] Access granted to protected page');
        }
        return true;
    }

    // Redirect if already logged in
    function redirectIfAuthenticated() {
        const authPages = ['/login', '/register', '/login.html', '/register.html'];
        const currentPath = window.location.pathname;

        if (authPages.some(page => currentPath.includes(page)) && isAuthenticated()) {
            console.log('[AUTH] User already authenticated, redirecting to dashboard');
            window.location.href = '/dashboard.html';
        }
    }

    // Initialize
    initDemoUsers();

    // Expose API
    window.SubTrackAuth = {
        login,
        register,
        logout,
        sendMagicLink,
        isAuthenticated,
        getSession,
        protectPage,
        redirectIfAuthenticated
    };

    // Auto-protect and redirect
    document.addEventListener('DOMContentLoaded', function () {
        protectPage();
        redirectIfAuthenticated();
    });

})();
