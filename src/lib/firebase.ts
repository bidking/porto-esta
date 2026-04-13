import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyD1KekbG7UTf2Za0K9v8IW972kOlGFYcXQ",
  authDomain: "portofolio-1d06f.firebaseapp.com",
  projectId: "portofolio-1d06f",
  storageBucket: "portofolio-1d06f.firebasestorage.app",
  messagingSenderId: "948048444585",
  appId: "1:948048444585:web:1304c6460a213f1764fdb8",
  measurementId: "G-QSZB5KZ5VQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Analytics is optional and may not work in all environments (like iframes)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);


