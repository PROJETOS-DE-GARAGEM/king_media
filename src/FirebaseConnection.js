import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAIdYAlGFfChvxQjtUwdWftc0LRGGCMga0",
  authDomain: "kingmedia-30444.firebaseapp.com",
  projectId: "kingmedia-30444",
  storageBucket: "kingmedia-30444.firebasestorage.app",
  messagingSenderId: "475344656673",
  appId: "1:475344656673:web:4ff69417b6845e25dfc660",
  measurementId: "G-8QSH5Z15K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
export {db};