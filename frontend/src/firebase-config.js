import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics";

// Your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1W0KA2FD48KhZUguRvlAMdxZ5aIBAuFs",
  authDomain: "actual-twitch-clone.firebaseapp.com",
  projectId: "actual-twitch-clone",
  storageBucket: "actual-twitch-clone.firebasestorage.app",
  messagingSenderId: "867229898303",
  appId: "1:867229898303:web:cbceef059cb38d6766ca8a",
  measurementId: "G-BXM89RWX5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
export default app;