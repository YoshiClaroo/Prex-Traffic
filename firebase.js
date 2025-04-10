import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwo7__VkdjNpVhw3abhQ_PhlA6n0OD6R8",
  authDomain: "prex-traffic.firebaseapp.com",
  projectId: "prex-traffic",
  storageBucket: "prex-traffic.appspot.com",
  messagingSenderId: "282869209200",
  appId: "1:282869209200:web:8602bcda68d0a32aef7cb5",
  measurementId: "G-0LDNZ5LRCE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para generar ID en formato "numero/letras" (ej: "7/h5b35b4a")
function generateBotId() {
  return `${Math.floor(Math.random() * 10)}/${Math.random().toString(36).substring(2, 8)}`;
}

export const saveBot = async (botData) => {
  try {
    const botId = generateBotId();
    
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      createdAt: serverTimestamp()
    });
    
    return botId;
  } catch (error) {
    console.error("Error al guardar bot:", error);
    throw new Error("No se pudo guardar el bot. ¿Está Firestore configurado?");
  }
};
