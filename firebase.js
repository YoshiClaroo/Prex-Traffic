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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para generar ID corto
function generateShortId() {
  return Math.random().toString(36).substring(2, 10);
}

export const saveBot = async (botData) => {
  try {
    console.log("Iniciando guardado de bot...");
    const botId = `${Math.floor(Math.random() * 10)}/${generateShortId()}`;
    
    console.log("ID generado:", botId);
    console.log("Datos a guardar:", botData);
    
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed,
      createdAt: serverTimestamp()
    });
    
    console.log("Bot guardado exitosamente");
    return botId;
  } catch (error) {
    console.error("Error en saveBot:", error);
    return null;
  }
};
