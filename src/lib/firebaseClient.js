// src/lib/firebaseClient.js
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

// Read config from env (NEXT_PUBLIC_* must exist in .env.local)
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyD1t1VNXUVjY3Q4lNt7eJk1gMIe1dYEfGI",
  authDomain: "iotagriproject-f93ee.firebaseapp.com",
  databaseURL: "https://iotagriproject-f93ee-default-rtdb.firebaseio.com",
  projectId: "iotagriproject-f93ee",
  storageBucket: "iotagriproject-f93ee.firebasestorage.app",
  messagingSenderId: "182362566932",
  appId: "1:182362566932:web:bb3345d28da7eab14dd201",
  measurementId: "G-J27X75C0H7",
};

// initialize app only once (prevents "duplicate app" error)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const rtdb = getDatabase(app);
