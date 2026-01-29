# Enable Firebase Authentication - Quick Start

## ✅ Firebase Credentials Added Successfully!

Your Firebase configuration is now working correctly. The error message changed from **"invalid API key"** to **"invalid credentials"**, which means Firebase is communicating properly with your project.

---

## 🔧 Enable Email/Password Authentication

You need to enable Email/Password sign-in in your Firebase Console:

### Step 1: Go to Firebase Console
Visit: [Firebase Console - Authentication](https://console.firebase.google.com/project/subtrackers/authentication/providers)

(Or manually: Firebase Console → Your Project "Subtrack" → Authentication → Sign-in method)

### Step 2: Enable Email/Password
1. Click on **"Email/Password"** in the providers list
2. **Enable** the first toggle (Email/Password)
3. Click **"Save"**

![Enable Email/Password Example](https://firebase.google.com/static/docs/auth/images/email-password-auth.png)

### Step 3: (Optional) Enable Google Sign-In
1. Click on **"Google"** in the providers list
2. **Enable** the toggle
3. Select your **support email** (abhinavraj1414@gmail.com)
4. Click **"Save"**

---

## 🎯 Testing Authentication

### Option 1: Create an Account (Recommended)
1. Navigate to: http://localhost:3000/register.html
2. Enter your email and password
3. Click "Sign Up"
4. You'll be redirected to the dashboard

### Option 2: Add User Manually in Firebase Console
1. Go to: [Firebase Console - Users](https://console.firebase.google.com/project/subtrackers/authentication/users)
2. Click **"Add user"**
3. Enter email: `test@example.com`
4. Enter password: `password123`
5. Click **"Add user"**
6. Now you can log in with those credentials

---

## ✨ What's Working Now

- ✅ Firebase credentials configured correctly
- ✅ No more "invalid API key" errors
- ✅ Firebase SDK initializing successfully
- ✅ Authentication requests reaching Firebase servers
- ⏳ **Waiting on:** Email/Password authentication to be enabled in your Firebase Console

Once you enable Email/Password authentication, the login will work immediately!
