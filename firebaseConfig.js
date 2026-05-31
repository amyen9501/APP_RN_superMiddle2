import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBozyx3awG0hvySnDirNOKnKIh3S1wcxsM",
  authDomain: "app-rn2026.firebaseapp.com",
  projectId: "app-rn2026",
  storageBucket: "app-rn2026.firebasestorage.app",
  messagingSenderId: "505030554216",
  appId: "1:505030554216:web:0240ebcfde04f898e601dd",
  measurementId: "G-J5HSKKBF53"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };