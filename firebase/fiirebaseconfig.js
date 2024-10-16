// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth"; // Importar getReactNativePersistence
import AsyncStorage from "@react-native-async-storage/async-storage"; // Corrige a importação de AsyncStorage
import { getFirestore } from "firebase/firestore";

// Sua configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQFtOexzQvIlRYif0yQzBG6YrKP5FK66Q",
  authDomain: "blackstudioapp.firebaseapp.com",
  projectId: "blackstudioapp",
  storageBucket: "blackstudioapp.appspot.com",
  messagingSenderId: "158770135057",
  appId: "1:158770135057:web:c932d2ec2beb13bc9a71b0"
};

// Inicialize o Firebase
export const app = initializeApp(firebaseConfig);
export const autenticacao = getAuth(app); // Usando getAuth para inicializar
export const db = getFirestore(app);
