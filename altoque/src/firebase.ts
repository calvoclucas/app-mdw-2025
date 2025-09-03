// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBoVgAOs6x1NgQxycfZNS4MtsyHKJ7TUwU",
  authDomain: "altoque-74941.firebaseapp.com",
  projectId: "altoque-74941",
  storageBucket: "altoque-74941.firebasestorage.app",
  messagingSenderId: "956788600883",
  appId: "1:956788600883:web:4997a86fe70500055d7346",
  measurementId: "G-SH4JSYT2H3",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // <-- Exportar auth
export const analytics = getAnalytics(app); // <-- opcional
