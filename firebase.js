import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  collection,
  getDocs,
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

// Función para generar IDs en formato "numero/letras"
function generateBotId() {
  const randomNum = Math.floor(Math.random() * 10); // Número del 0 al 9
  const randomChars = Math.random().toString(36).substring(2, 8); // 6 caracteres alfanuméricos
  return `${randomNum}/${randomChars}`;
}

export const saveBot = async (botData) => {
  try {
    const botId = generateBotId();
    
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed,
      createdAt: serverTimestamp()
    });
    
    return botId;
  } catch (error) {
    console.error("Error al guardar bot:", error);
    throw new Error("No se pudo guardar el bot en la base de datos");
  }
};

export const getBot = async (botId) => {
  try {
    const docSnap = await getDoc(doc(db, "bots", botId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error al obtener bot:", error);
    throw new Error("No se pudo cargar la configuración del bot");
  }
};

export const listBots = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "bots"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al listar bots:", error);
    throw new Error("No se pudieron cargar los bots existentes");
  }
};

export const deleteBot = async (botId) => {
  try {
    await deleteDoc(doc(db, "bots", botId));
  } catch (error) {
    console.error("Error al eliminar bot:", error);
    throw new Error("No se pudo eliminar el bot");
  }
};
