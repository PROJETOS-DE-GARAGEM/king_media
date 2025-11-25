import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
 apiKey: "AIzaSyC8fLIOkN713ENGpvpZOGN9JhkWRB9FYSM",
  authDomain: "kingmidia-29f70.firebaseapp.com",
  projectId: "kingmidia-29f70",
  storageBucket: "kingmidia-29f70.firebasestorage.app",
  messagingSenderId: "999419914483",
  appId: "1:999419914483:web:8bd6359177dc03c10aaf86",
  measurementId: "G-GC0963V602"
};

const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app); 

