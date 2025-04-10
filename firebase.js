<script type="module">
  // Importaciones necesarias
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
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

  // Tu configuración de Firebase
  const firebaseConfig = {
    apiKey: "AIzaSyAwo7__VkdjNpVhw3abhQ_PhlA6n0OD6R8",
    authDomain: "prex-traffic.firebaseapp.com",
    projectId: "prex-traffic",
    storageBucket: "prex-traffic.appspot.com",
    messagingSenderId: "282869209200",
    appId: "1:282869209200:web:8602bcda68d0a32aef7cb5",
    measurementId: "G-0LDNZ5LRCE"
  };

  // Inicializa Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFirestore(app);

  // Funciones para exportar
  const firebaseFunctions = {
    // Guardar un nuevo bot
    saveBot: async (botId, data) => {
      try {
        await setDoc(doc(db, "bots", botId), {
          targetUrl: data.url,
          duration: data.duration,
          repetitions: data.repetitions,
          createdAt: new Date(),
          userId: data.userId || "anonymous"
        });
        return true;
      } catch (error) {
        console.error("Error saving bot:", error);
        return false;
      }
    },

    // Obtener datos de un bot
    getBot: async (botId) => {
      const docRef = doc(db, "bots", botId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    },

    // Eliminar un bot
    deleteBot: async (botId) => {
      try {
        await deleteDoc(doc(db, "bots", botId));
        return true;
      } catch (error) {
        console.error("Error deleting bot:", error);
        return false;
      }
    },

    // Listar todos los bots de un usuario
    listBots: async (userId) => {
      try {
        const q = query(collection(db, "bots"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error listing bots:", error);
        return [];
      }
    }
  };

  // Exporta las funciones para usarlas en otros archivos
  window.firebaseApp = {
    app,
    analytics,
    db,
    ...firebaseFunctions
  };
</script>
