import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Replace these placeholder values with your actual Firebase project configuration.
// You can find these in the Firebase Console under Project Settings > General > Your apps.
// For production, store these values in environment variables (e.g., import.meta.env.VITE_FIREBASE_API_KEY).
// When placeholders are active, Firebase operations will fail and the app will fall back to local data.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
