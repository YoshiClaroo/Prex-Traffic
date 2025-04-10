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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función mejorada para guardar bots
export const saveBot = async (botId, botData) => {
  try {
    console.log("Intentando guardar bot con ID:", botId);
    console.log("Datos a guardar:", botData);
    
    await setDoc(doc(db, "bots", botId), {
      targetUrl: botData.url,
      duration: botData.duration,
      repetitions: botData.repetitions,
      speed: botData.speed,
      userId: "default-user", // Cambiar cuando implementes autenticación
      createdAt: new Date()
    });
    
    console.log("Bot guardado exitosamente");
    return true;
  } catch (error) {
    console.error("Error al guardar bot:", error);
    return false;
  }
};

// Función mejorada para obtener bots
export const getBot = async (botId) => {
  try {
    console.log("Buscando bot con ID:", botId);
    const docRef = doc(db, "bots", botId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Bot encontrado:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No existe el bot con ID:", botId);
      return null;
    }
  } catch (error) {
    console.error("Error al obtener bot:", error);
    return null;
  }
};

// Funciones adicionales (listar y eliminar)
export const listBots = async (userId) => {
  const q = query(collection(db, "bots"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteBot = async (botId) => {
  await deleteDoc(doc(db, "bots", botId));
};
