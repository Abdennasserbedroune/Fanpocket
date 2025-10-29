import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import {
  getAuth,
  connectAuthEmulator,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
  getFirestore,
  connectFirestoreEmulator,
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

const getEnvVar = key => {
  if (typeof window !== 'undefined' && window.ENV && window.ENV[key]) {
    return window.ENV[key];
  }
  return '';
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID'),
};

let app;
let auth;
let db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  const useEmulator = getEnvVar('VITE_USE_EMULATOR') === 'true';
  if (useEmulator) {
    connectAuthEmulator(auth, 'http://localhost:9099', {
      disableWarnings: true,
    });
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Firebase emulators connected');
  }

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { app, auth, db };
