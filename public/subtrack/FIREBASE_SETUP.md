# Firebase Authentication Setup

## 🚀 Quick Start

The app now uses Firebase Authentication instead of NextAuth. Follow these steps to configure it:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project" and follow the wizard
3. Once created, click "Continue"

### 2. Enable Authentication Methods

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable the following providers:
   - **Email/Password**: Click "Enable" → Save
   - **Google**: Click "Enable" → Add your project's OAuth consent screen details → Save

### 3. Register Your Web App

1. Click the gear icon ⚙️ → **Project settings**
2. Scroll down to "Your apps" → Click the **</>** (Web) icon
3. Register your app with a nickname (e.g., "SubTrack Web")
4. **Copy the Firebase config object** that appears

### 4. Update Firebase Configuration

Open `firebase-config.js` and replace the placeholder values:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 5. Configure Authorized Domains (for production)

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your production domain (e.g., `subtrack.abhnv.in`)
3. `localhost` is already authorized for development

---

## ✅ Testing

1. Start your dev server: `npm start`
2. Navigate to `http://localhost:3000/login.html`
3. Try logging in with Google or create an account
4. You should be redirected to the dashboard

---

## 🔧 Files Modified

- **NEW** `firebase-config.js` - Firebase initialization
- **NEW** `firebase-auth-login.js` - Login page handler  
- **NEW** `firebase-auth-register.js` - Registration page handler
- **NEW** `firebase-auth-guard.js` - Dashboard protection
- **MODIFIED** `login.html` - Now uses Firebase scripts
- **MODIFIED** `register.html` - Now uses Firebase scripts
- **MODIFIED** `dashboard.html` - Protected with Firebase auth guard

---

## 🐛 Troubleshooting

### "Firebase not configured" error
- Make sure you've updated `firebase-config.js` with your actual credentials

### Google sign-in popup blocked
- Allow popups for `localhost:3000` in your browser

### "Email/password not enabled" error
- Go to Firebase Console → Authentication → Sign-in method
- Enable Email/Password authentication

### Session not persisting after reload
- Firebase uses `browserLocalPersistence` by default
- Check browser console for any Firebase errors

---

## 📚 Next Steps

- **Production**: Update authorized domains in Firebase Console
- **Analytics**: Firebase Analytics is ready to use (optional)
- **Security Rules**: Configure Firestore/Storage rules as needed
