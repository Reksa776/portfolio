import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCPPt2CQnt-3uyH11vLRE7_kHFy7gaqGl8",
  authDomain: "portofolio-3963e.firebaseapp.com",
  projectId: "portofolio-3963e",
  storageBucket: "portofolio-3963e.firebasestorage.app",
  messagingSenderId: "1060523788304",
  appId: "1:1060523788304:web:3daaddb17c8f4151c6e295",
  measurementId: "G-1Z04V6T5FZ"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);