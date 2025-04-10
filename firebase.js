import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
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

// Función para guardar un nuevo bot
export const saveBot = async (botId, botData) => {
  try {
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed,
      createdAt: botData.createdAt
    });
    return true;
  } catch (error) {
    console.error("Error saving bot:", error);
    return false;
  }
};

// Función para obtener configuración de un bot
export const getBot = async (botId) => {
  try {
    const docSnap = await getDoc(doc(db, "bots", botId));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error getting bot:", error);
    return null;
  }
};
