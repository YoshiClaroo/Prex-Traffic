import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { 
  getAuth, 
  signInAnonymously,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwo7__VkdjNpVhw3abhQ_PhlA6n0OD6R8",
  authDomain: "prex-traffic.firebaseapp.com",
  projectId: "prex-traffic",
  storageBucket: "prex-traffic.appspot.com",
  messagingSenderId: "282869209200",
  appId: "1:282869209200:web:8602bcda68d0a32aef7cb5",
  measurementId: "G-0LDNZ5LRCE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Variable global para el usuario
let currentUser = null;

// Función para autenticar
const initAuth = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((userCredential) => {
            currentUser = userCredential.user;
            resolve(userCredential.user);
          })
          .catch((error) => {
            console.error("Error en auth:", error);
            resolve(null);
          });
      }
    });
  });
};

// Función para guardar bots (actualizada)
export const saveBot = async (botData) => {
  if (!currentUser) {
    await initAuth(); // Espera a la autenticación
    if (!currentUser) throw new Error("Error de autenticación");
  }

  try {
    const botId = `${Math.floor(Math.random() * 10)}/${Math.random().toString(36).substring(2, 8)}`;
    
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      userId: currentUser.uid,
      createdAt: serverTimestamp()
    });
    
    return botId;
  } catch (error) {
    console.error("Error en saveBot:", error);
    throw error;
  }
};
