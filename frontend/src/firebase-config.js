import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace with your Firebase project configuration
// You'll get this from your Firebase console -> Project Settings -> General -> Your apps
const firebaseConfig = {
  // You need to replace these with your actual Firebase config values
  apiKey: "your-api-key-here",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// For development/demo purposes, you can use these placeholder values
// but you'll need to replace them with real Firebase config for production
const demoConfig = {
  apiKey: "demo-api-key",
  authDomain: "twitch-clone-demo.firebaseapp.com",
  projectId: "twitch-clone-demo",
  storageBucket: "twitch-clone-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id"
};

// Use demo config for now - user will replace with real config
const app = initializeApp(demoConfig);
const db = getFirestore(app);

export { db };
export default app;