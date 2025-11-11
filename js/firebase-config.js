// Configuracao do Firebase (substitua pelos dados reais do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyAwXZAfK9_L3RVLyTqTF9KSRp4FGWnoHKk",
  authDomain: "it-incident-management.firebaseapp.com",
  projectId: "it-incident-management",
  storageBucket: "it-incident-management.firebasestorage.app",
  messagingSenderId: "29313293597",
  appId: "1:29313293597:web:3dab1cdd3b7aeda96e15f4",
  measurementId: "G-K45M6KGFZX"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

// Disponibiliza referencias globais para outros scripts
window.auth = auth;
window.db = db;
