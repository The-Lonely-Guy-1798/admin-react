// src/firebase/config.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCcQ-Bm7Cfw8TFUePvYCcOlVjHoTz21ME",
  authDomain: "freemium-novel-app.firebaseapp.com",
  projectId: "freemium-novel-app",
  storageBucket: "freemium-novel-app.firebasestorage.app",
  messagingSenderId: "62996163666",
  appId: "1:62996163666:web:baf391fef780aa57d8838b",
  measurementId: "G-20MDS57WMW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Analytics
export const analytics = getAnalytics(app);

export default app; 