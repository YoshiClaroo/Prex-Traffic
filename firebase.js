import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Configuración de Firebase (VERIFICA QUE ESTOS DATOS SON CORRECTOS)
const firebaseConfig = {
  apiKey: "AIzaSyAwo7__VkdjNpVhw3abhQ_PhlA6n0OD6R8",
  authDomain: "prex-traffic.firebaseapp.com",
  projectId: "prex-traffic",
  storageBucket: "prex-traffic.appspot.com",
  messagingSenderId: "282869209200",
  appId: "1:282869209200:web:8602bcda68d0a32aef7cb5",
  measurementId: "G-0LDNZ5LRCE"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Habilitar persistencia (opcional pero recomendado)
enableIndexedDbPersistence(db).catch((err) => {
  console.log("Persistencia fallida: "+err.code);
});

// Función mejorada para guardar bots
export const saveBot = async (botData) => {
  try {
    // Generar ID en formato "numero/letras" (ej: "7/h5b35b4a")
    const botId = `${Math.floor(Math.random() * 10)}/${Math.random().toString(36).substring(2, 8)}`;
    
    // Referencia al documento
    const botRef = doc(db, "bots", botId);
    
    // Datos a guardar
    const botToSave = {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed || 1,
      createdAt: serverTimestamp(),
      status: "active"
    };
    
    console.log("Intentando guardar:", botToSave); // Debug
    
    // Guardar en Firestore
    await setDoc(botRef, botToSave);
    
    console.log("Bot guardado con ID:", botId); // Debug
    return botId;
    
  } catch (error) {
    console.error("Error completo al guardar:", error); // Debug detallado
    throw new Error(`Error al guardar: ${error.message}`);
  }
};
