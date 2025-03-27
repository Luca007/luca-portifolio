// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrxT8NXrvg59C_KoX-sH3Fa26EaZWuyK4",
  authDomain: "curriculo-d20af.firebaseapp.com",
  projectId: "curriculo-d20af",
  storageBucket: "curriculo-d20af.firebasestorage.app",
  messagingSenderId: "259221061959",
  appId: "1:259221061959:web:8c552eee0ce6a74a074c62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
