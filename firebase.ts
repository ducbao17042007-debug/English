// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDxQ07om2e5w0oj_EWcVGrFhsz3UHRBcgU",
    authDomain: "kids-english-app-f56ab.firebaseapp.com",
    projectId: "kids-english-app-f56ab",
    storageBucket: "kids-english-app-f56ab.firebasestorage.app",
    messagingSenderId: "696835280283",
    appId: "1:696835280283:web:124e800438bd4b9df0653e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;