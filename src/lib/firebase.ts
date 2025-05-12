import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase client-side only
let app;
let db;
let auth;
if (typeof window !== 'undefined' && firebaseConfig.apiKey) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    }
    // Type assertion since app may be undefined if init skipped
    auth = getAuth(app as FirebaseApp);
    db = getFirestore(app as FirebaseApp);
  } catch (e) {
    console.warn('Firebase initialization failed or skipped:', e);
  }
} else if (typeof window !== 'undefined') {
  console.warn('Firebase API key is missing: skipping initialization');
}
// Export firebase services
export { db, auth };
export default app;
