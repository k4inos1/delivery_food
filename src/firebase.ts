import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const fallbackFirebaseConfig = {
  apiKey: 'demo-api-key',
  authDomain: 'demo-project.firebaseapp.com',
  projectId: 'demo-project',
  storageBucket: 'demo-project.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:demoapp',
};

const envFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const firebaseConfig = {
  apiKey: envFirebaseConfig.apiKey ?? fallbackFirebaseConfig.apiKey,
  authDomain: envFirebaseConfig.authDomain ?? fallbackFirebaseConfig.authDomain,
  projectId: envFirebaseConfig.projectId ?? fallbackFirebaseConfig.projectId,
  storageBucket: envFirebaseConfig.storageBucket ?? fallbackFirebaseConfig.storageBucket,
  messagingSenderId: envFirebaseConfig.messagingSenderId ?? fallbackFirebaseConfig.messagingSenderId,
  appId: envFirebaseConfig.appId ?? fallbackFirebaseConfig.appId,
};

const requiredFirebaseKeys = Object.values(envFirebaseConfig);

export const isFirebaseConfigured = requiredFirebaseKeys.every(Boolean);

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export default app;
