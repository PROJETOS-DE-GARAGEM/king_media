import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI3ivXIVthDNum-icJy0-w4hwUQPb4Onk",
  authDomain: "king-media-3cbc2.firebaseapp.com",
  projectId: "king-media-3cbc2",
  storageBucket: "king-media-3cbc2.firebasestorage.app",
  messagingSenderId: "701998461358",
  appId: "1:701998461358:web:b02d0e310593825d49d83f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
