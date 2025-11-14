// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration should be stored in environment variables.
// Create a .env.local file in the root of your project and add your config there:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
// NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

const firebaseConfig = {
  projectId: "studio-8431315151-41f4f",
  appId: "1:444802905508:web:7f608bffed844f64af7d31",
  apiKey: "AIzaSyCNluEV_MJym_0oKYPUlumt4gG5kDq6T14",
  authDomain: "studio-8431315151-41f4f.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "444802905508",
};

// Initialize Firebase for SSR and SSG, preventing re-initialization on client-side hot-reloads.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
