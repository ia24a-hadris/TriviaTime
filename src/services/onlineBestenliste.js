import { getApps, initializeApp } from 'firebase/app';
import { collection, doc, getDoc, getDocs, getFirestore, limit, orderBy, query, setDoc, where } from 'firebase/firestore';
import { firebaseConfig } from '../config/firebaseConfig';
import { ausWarteschlangeEntfernen, ladeWarteschlange } from './speicher';

// Online-Bestenliste (Pakete S2 und S7) mit Firebase Firestore.
// Genau zwei Aktionen wie im Konzept: speichereOnline (= saveScore) und ladeTopScores (= getTopScores).
// Die Screens merken nicht, ob online oder lokal gespeichert wird (Service gekapselt, Plan B möglich).

const SAMMLUNG = 'scores'; // «Tabelle» in Firestore
const TIMEOUT_MS = 10000; // ohne Antwort nach 10 s: wie «kein Netz» behandeln

let db = null;

export function istKonfiguriert() {
  return firebaseConfig != null;
}

function datenbank() {
  if (!istKonfiguriert()) throw new Error('NICHT_KONFIGURIERT');
  if (!db) {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

// Firestore wartet ohne Netz sehr lange – darum ein eigenes Zeitlimit
function mitZeitlimit(promise) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('TIMEOUT')), TIMEOUT_MS)),
  ]);
}

// Nur diese Felder gehen online – keine persönlichen Daten ausser dem frei gewählten Nickname (Konzept Kap. 10)
function nurErlaubteFelder(eintrag) {
  const { nickname, punkte, kategorie, kategorieId, schwierigkeit, anzahl, richtige, datum } = eintrag;
  return { nickname, punkte, kategorie, kategorieId, schwierigkeit, anzahl, richtige, datum };
}

/**
 * Speichert ein Resultat online. Die id aus dem lokalen Speicher wird als Dokument-ID verwendet:
 * wird derselbe Score zweimal gesendet, entsteht kein Duplikat.
 */
export async function speichereOnline(eintrag) {
  const ref = doc(datenbank(), SAMMLUNG, eintrag.id);
  const vorhanden = await mitZeitlimit(getDoc(ref));
  if (vorhanden.exists()) return; // schon gesendet
  await mitZeitlimit(setDoc(ref, nurErlaubteFelder(eintrag)));
}

/**
 * Lädt die besten Resultate. Mit kategorieId nur diese Kategorie.
 * (Bei Kategorie-Filter wird lokal sortiert, damit Firestore keinen zusätzlichen Index braucht.)
 */
export async function ladeTopScores(kategorieId = null, max = 20) {
  const sammlung = collection(datenbank(), SAMMLUNG);
  const abfrage =
    kategorieId == null
      ? query(sammlung, orderBy('punkte', 'desc'), limit(max))
      : query(sammlung, where('kategorieId', '==', kategorieId), limit(200));
  const ergebnis = await mitZeitlimit(getDocs(abfrage));
  const liste = ergebnis.docs.map((d) => ({ id: d.id, ...d.data() }));
  return liste.sort((a, b) => b.punkte - a.punkte).slice(0, max);
}

/**
 * Sendet alle Punkte aus der Warteschlange. Ein Eintrag wird erst gelöscht, wenn er online bestätigt ist.
 * Gibt zurück, wie viele gesendet wurden und wie viele noch warten.
 */
export async function sendeWarteschlange() {
  if (!istKonfiguriert()) return { gesendet: 0, offen: (await ladeWarteschlange()).length };
  const liste = await ladeWarteschlange();
  let gesendet = 0;
  for (const eintrag of liste) {
    try {
      await speichereOnline(eintrag);
      await ausWarteschlangeEntfernen(eintrag.id);
      gesendet++;
    } catch {
      break; // kein Netz: Rest bleibt in der Warteschlange für später
    }
  }
  return { gesendet, offen: liste.length - gesendet };
}

/**
 * Machbarkeitstest (Paket S2): einen Testeintrag schreiben und wieder lesen.
 * Gibt einen Text für die Anzeige zurück.
 */
export async function machbarkeitstest() {
  if (!istKonfiguriert()) {
    return '⚠ Firebase ist noch nicht eingerichtet (src/config/firebaseConfig.js ist leer).';
  }
  const id = `test-${Date.now().toString(36)}`;
  const eintrag = {
    id,
    nickname: 'Testlauf',
    punkte: 0,
    kategorie: 'Machbarkeitstest',
    kategorieId: 0,
    schwierigkeit: 'Leicht',
    anzahl: 5,
    richtige: 0,
    datum: new Date().toISOString(),
  };
  const start = Date.now();
  try {
    await speichereOnline(eintrag);
    const gelesen = await mitZeitlimit(getDoc(doc(datenbank(), SAMMLUNG, id)));
    const dauer = Date.now() - start;
    return gelesen.exists()
      ? `✓ Machbarkeitstest bestanden: Eintrag «${id}» geschrieben und wieder gelesen (${dauer} ms).`
      : '✗ Eintrag wurde geschrieben, aber nicht wieder gefunden.';
  } catch (e) {
    const grund =
      e.message === 'TIMEOUT'
        ? 'keine Antwort nach 10 s (Netz?)'
        : e.code === 'permission-denied'
          ? 'Zugriff verweigert – Sicherheitsregeln prüfen'
          : e.code || e.message;
    return `✗ Machbarkeitstest fehlgeschlagen: ${grund}`;
  }
}
