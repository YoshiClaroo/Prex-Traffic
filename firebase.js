import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para generar ID de 8 caracteres
function generateShortId() {
  return Math.random().toString(36).substring(2, 10);
}

export const saveBot = async (botData) => {
  try {
    const botId = `${Math.floor(Math.random() * 10)}/${generateShortId()}`;
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed,
      createdAt: serverTimestamp()
    });
    return botId;
  } catch (error) {
    console.error("Error saving bot:", error);
    return null;
  }
};

export const getBot = async (botId) => {
  try {
    const docSnap = await getDoc(doc(db, "bots", botId));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error("Error getting bot:", error);
    return null;
  }
};

export const listBots = async () => {
  try {
    const q = query(collection(db, "bots"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error listing bots:", error);
    return [];
  }
};

export const deleteBot = async (botId) => {
  try {
    await deleteDoc(doc(db, "bots", botId));
    return true;
  } catch (error) {
    console.error("Error deleting bot:", error);
    return false;
  }
};
