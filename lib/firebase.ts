import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCPi6G9W1TBvE9eJdg7AVpD7pnuCOufguE",
  authDomain: "elhenawy-stores.firebaseapp.com",
  projectId: "elhenawy-stores",
  storageBucket: "elhenawy-stores.firebasestorage.app",
  messagingSenderId: "49837556638",
  appId: "1:49837556638:web:fab7029b04e17f2e600c8f",
  measurementId: "G-F7E8Y5JGW6",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)
