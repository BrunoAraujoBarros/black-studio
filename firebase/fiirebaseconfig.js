// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAuth, getReactNativePersistence } from "firebase/auth"; // Importar getReactNativePersistence
// // import AsyncStorage from "@react-native-async-storage/async-storage"; // Corrige a importação de AsyncStorage
// // import { getFirestore } from "firebase/firestore";
// //
// // // Sua configuração do Firebase
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCQFtOexzQvIlRYif0yQzBG6YrKP5FK66Q",
// //   authDomain: "blackstudioapp.firebaseapp.com",
// //   projectId: "blackstudioapp",
// //   storageBucket: "blackstudioapp.appspot.com",
// //   messagingSenderId: "158770135057",
// //   appId: "1:158770135057:web:c932d2ec2beb13bc9a71b0"
// // };
// //
// // // Inicialize o Firebase
// // export const app = initializeApp(firebaseConfig);
// // export const autenticacao = getAuth(app); // Usando getAuth para inicializar
// // export const db = getFirestore(app);
//
//
// // // Importa as funções necessárias dos SDKs que você precisa
// // import { initializeApp } from "firebase/app";
// // import { initializeAuth, getReactNativePersistence } from "firebase/auth"; // Altere para initializeAuth
// // import AsyncStorage from "@react-native-async-storage/async-storage"; // Importação do AsyncStorage
// // import { getFirestore } from "firebase/firestore";
// //
// // // Configuração do Firebase
// // const firebaseConfig = {
// //   apiKey: "AIzaSyCQFtOexzQvIlRYif0yQzBG6YrKP5FK66Q",
// //   authDomain: "blackstudioapp.firebaseapp.com",
// //   projectId: "blackstudioapp",
// //   storageBucket: "blackstudioapp.appspot.com",
// //   messagingSenderId: "158770135057",
// //   appId: "1:158770135057:web:c932d2ec2beb13bc9a71b0"
// // };
// //
// // // Inicialize o Firebase
// // const app = initializeApp(firebaseConfig);
// // export const db = getFirestore(app);
// //
// // // Inicialize o Auth com persistência usando AsyncStorage
// // export const autenticacao = initializeAuth(app, {
// //   persistence: getReactNativePersistence(AsyncStorage),
// // });
//
// // Importa as funções necessárias dos SDKs que você precisa
// import { initializeApp } from "firebase/app";
// import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getFirestore } from "firebase/firestore";
// import { Platform } from 'react-native'; // Importa o Platform
//
// // Configuração do Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCQFtOexzQvIlRYif0yQzBG6YrKP5FK66Q",
//   authDomain: "blackstudioapp.firebaseapp.com",
//   projectId: "blackstudioapp",
//   storageBucket: "blackstudioapp.appspot.com",
//   messagingSenderId: "158770135057",
//   appId: "1:158770135057:web:c932d2ec2beb13bc9a71b0"
// };
//
// // Inicialize o Firebase
// const app = initializeApp(firebaseConfig);
// export const db = getFirestore(app);
//
// // Verifique a plataforma para inicializar o Auth corretamente
// export const autenticacao = Platform.OS === 'web'
//     ? getAuth(app)  // Para a web, usa getAuth sem persistência
//     : initializeAuth(app, {
//       persistence: getReactNativePersistence(AsyncStorage),  // Para dispositivos móveis, usa AsyncStorage
//     });
// export default class firebase {
// }

// Importa as funções necessárias dos SDKs que você precisa
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";  // Importar o Firebase Storage
import { Platform } from 'react-native'; // Importa o Platform

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCQFtOexzQvIlRYif0yQzBG6YrKP5FK66Q",
    authDomain: "blackstudioapp.firebaseapp.com",
    projectId: "blackstudioapp",
    storageBucket: "blackstudioapp.appspot.com",
    messagingSenderId: "158770135057",
    appId: "1:158770135057:web:c932d2ec2beb13bc9a71b0"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Inicializa o Storage do Firebase e exporta
export const storage = getStorage(app); // Aqui está a adição do Storage

// Verifique a plataforma para inicializar o Auth corretamente
export const autenticacao = Platform.OS === 'web'
    ? getAuth(app)  // Para a web, usa getAuth sem persistência
    : initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),  // Para dispositivos móveis, usa AsyncStorage
    });
