import { initializeApp } from "firebase/app"

import { getFirestore } from "firebase/firestore"


import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "api_key",

  authDomain: "smart-finance-app-sr.firebaseapp.com",

  projectId: "smart-finance-app-sr",

  storageBucket: "smart-finance-app-sr.firebasestorage.app",

  messagingSenderId: "987494516937",

  appId: "1:987494516937:web:e177223e68a7dff71ee518"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Firestore Database
export const db = getFirestore(app)

// Firebase Authentication
export const auth = getAuth(app)
