import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "ecoecho-2wq7b",
  "appId": "1:545299551119:web:744797b9be1d0bdb75f1fa",
  "storageBucket": "ecoecho-2wq7b.firebasestorage.app",
  "apiKey": "AIzaSyCdCbXz67g0yarUU28Tq_enUPLec4Sh7B4",
  "authDomain": "ecoecho-2wq7b.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "545299551119"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
