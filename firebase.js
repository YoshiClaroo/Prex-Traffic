import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js';

const firebaseConfig = { /* Tus credenciales */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Guardar bot (ahora con tiempo y repeticiones)
export const saveBot = async (botId, data) => {
    await setDoc(doc(db, "bots", botId), {
        targetUrl: data.url,
        duration: data.duration,
        repetitions: data.repetitions,
        createdAt: new Date()
    });
};

// Obtener bot
export const getBot = async (botId) => {
    const snapshot = await getDoc(doc(db, "bots", botId));
    return snapshot.exists() ? snapshot.data() : null;
};

// Eliminar bot
export const deleteBot = async (botId) => {
    await deleteDoc(doc(db, "bots", botId));
};

// Listar bots (para mostrar en interfaz)
export const listBots = async (userId) => {
    const q = query(collection(db, "bots"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
