// Firebase-Konfiguration (Paket S2 / S7 – Online-Bestenliste).
//
// So füllst du das aus:
// 1. console.firebase.google.com → Projekt «TriviaTime» → Projektübersicht → Web-App hinzufügen (</>)
// 2. Den Block «const firebaseConfig = { ... }» kopieren und unten die Werte ersetzen.
//
// Der apiKey ist bei Firebase-Web-Apps KEIN Geheimnis: er steht in jeder Web-App öffentlich.
// Geschützt werden die Daten durch die Sicherheitsregeln in Firestore (siehe firestore.rules im Projektordner).
//
// Solange hier null steht, läuft die App ohne Online-Bestenliste (Plan B: nur lokal).

export const firebaseConfig = {
  apiKey: 'AIzaSyAlPDqElqbpDQSmU5xGazSQP3H1ro6os1k',
  authDomain: 'triviatime-40c70.firebaseapp.com',
  projectId: 'triviatime-40c70',
  storageBucket: 'triviatime-40c70.firebasestorage.app',
  messagingSenderId: '243952912821',
  appId: '1:243952912821:web:f335991c7e42411c2371fc',
};
