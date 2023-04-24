import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfigDev = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY_DEV,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_DEV,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_DEV,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_DEV,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_DEV,
  appId: process.env.REACT_APP_FIREBASE_APP_ID_DEV,
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(process.env.NODE_ENV === "development" ? firebaseConfigDev : firebaseConfig, "main");
const authApp = initializeApp(process.env.NODE_ENV === "development" ? firebaseConfigDev : firebaseConfig, "AuthApp");

const auth = getAuth(app);
const secondaryAuth = getAuth(authApp);

const db = getFirestore(app);
const secondaryDB = getFirestore(authApp);

const storage = getStorage(app);

export { auth, secondaryAuth, db, secondaryDB, storage };
