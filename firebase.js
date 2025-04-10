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

// Autenticación anónima (puedes cambiar a otro método si prefieres)
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if (!user) signInAnonymously(auth);
});

// Función para generar IDs en formato "numero/letras"
function generateBotId() {
  return `${Math.floor(Math.random() * 10)}/${Math.random().toString(36).substring(2, 8)}`;
}

export const saveBot = async (botData) => {
  if (!currentUser) throw new Error("Usuario no autenticado");
  
  try {
    const botId = generateBotId();
    
    await setDoc(doc(db, "bots", botId), {
      url: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed || 1,
      userId: currentUser.uid,
      createdAt: serverTimestamp(),
      status: "active"
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
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    // Verificar que el bot pertenece al usuario actual
    if (currentUser && data.userId !== currentUser.uid) {
      throw new Error("No tienes permiso para acceder a este bot");
    }
    return data;
  } catch (error) {
    console.error("Error al obtener bot:", error);
    throw error;
  }
};

export const listBots = async () => {
  if (!currentUser) return [];
  
  try {
    const q = query(
      collection(db, "bots"),
      where("userId", "==", currentUser.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error al listar bots:", error);
    return [];
  }
};

export const deleteBot = async (botId) => {
  if (!currentUser) throw new Error("Usuario no autenticado");
  
  try {
    const botRef = doc(db, "bots", botId);
    const docSnap = await getDoc(botRef);
    
    if (!docSnap.exists()) throw new Error("Bot no encontrado");
    if (docSnap.data().userId !== currentUser.uid) {
      throw new Error("No tienes permiso para eliminar este bot");
    }
    
    await deleteDoc(botRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar bot:", error);
    throw error;
  }
};
