import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCMtAA2hvo6wb5OS1DBqKWc3DxY83urQAg",
    authDomain: "hireby-535a3.firebaseapp.com",
    projectId: "hireby-535a3",
    storageBucket: "hireby-535a3.firebasestorage.app",
    messagingSenderId: "950964636409",
    appId: "1:950964636409:web:674893b916d18de9953028"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);