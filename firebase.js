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
  getDocs 
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

// Funciones para exportar
export const saveBot = async (botId, data) => {
  try {
    await setDoc(doc(db, "bots", botId), data);
    return true;
  } catch (error) {
    console.error("Error saving bot:", error);
    return false;
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

export const deleteBot = async (botId) => {
  try {
    await deleteDoc(doc(db, "bots", botId));
    return true;
  } catch (error) {
    console.error("Error deleting bot:", error);
    return false;
  }
};

export const listBots = async (userId) => {
  try {
    const q = query(collection(db, "bots"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error listing bots:", error);
    return [];
  }
};
