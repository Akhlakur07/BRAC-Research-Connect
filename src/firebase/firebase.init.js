import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAOYuacz4fo1SE3mCNL5ssrNT1JirZyiAI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bracu-research-connect.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bracu-research-connect",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "bracu-research-connect.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "947640377158",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:947640377158:web:260b9b71d87527a2eecf47",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);