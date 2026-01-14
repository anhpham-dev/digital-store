# 🏪 Digital Store - Firebase Configuration Guide

This document provides a step-by-step guide to setting up and configuring Firebase for your Digital Store project.

## 🚀 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and give it a name (e.g., `digital-store`).
3. (Optional) Enable/Disable Google Analytics according to your preference.
4. Click **"Create project"**.

## 🔑 2. Enable Authentication

1. In the Firebase Sidebar, go to **Build > Authentication**.
2. Click **"Get Started"**.
3. Go to the **"Sign-in method"** tab.
4. Click **"Add new provider"** and select **Email/Password**.
5. Enable it and click **Save**.
   * *Note: To add the initial admin user, go to the **Users** tab and click **"Add user"**.*

## 📂 3. Initialize Cloud Firestore

1. In the Sidebar, go to **Build > Firestore Database**.
2. Click **"Create database"**.
3. Choose a location (choose the one closest to your target users).
4. Select **"Start in test mode"** for development (or production mode if you are ready to write specific rules).
5. Click **Create**.

## 📁 4. Initialize Firebase Storage (Optional)

If you want to host images directly on Firebase:
1. In the Sidebar, go to **Build > Storage**.
2. Click **"Get Started"** and select **"Start in test mode"**.
3. Choose your storage location and click **Done**.

### 💡 Alternative: External Image Hosting
If you prefer NOT to use Firebase Storage, you can:
1. Host your images on services like [Imgur](https://imgur.com/), [PostImages](https://postimages.org/), or your own server.
2. In the Admin Panel, simply **paste the direct image URL** into the URL field provided below the upload box.

## 💻 5. Register Your Web App

1. Go to **Project Overview**.
2. Click the **Web icon (</>)**.
3. Enter `Digital Store Web` and click **Register app**.
4. Copy the config values. If you skipped Step 4, you can leave `STORAGE_BUCKET` empty or use the default provided.

## ⚙️ 6. Configure Environment Variables

1. In your project root, create a file named `.env` (or copy `.env.example`).
2. Copy the values from the Firebase Web App registration (Step 5) into your `.env` file:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📜 7. Firebase Security Rules (Recommended)

To ensure your store is secure, you should eventually configure rules.

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if true; // Allow public read for products
      allow write: if request.auth != null; // Only authenticated users (admins) can write
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---
*Now you are all set! Run `npm run dev` to start your application.*
