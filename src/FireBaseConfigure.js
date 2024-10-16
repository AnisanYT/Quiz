
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAKiu5kbtEp-Lmmf4dIP7iwETYBQgsrC2g",
  authDomain: "historiaculturalcr.firebaseapp.com",
  projectId: "historiaculturalcr",
  storageBucket: "historiaculturalcr.appspot.com",
  messagingSenderId: "682030223411",
  appId: "1:682030223411:web:7ae16598f9fa15adda1346"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
