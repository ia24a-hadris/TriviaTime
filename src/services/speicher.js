import AsyncStorage from '@react-native-async-storage/async-storage';

// Persistenz (Paket S6) – alles, was die App auf dem Handy behält (Konzept Kap. 10, Persistenz-Liste).
// Jeder Schlüssel enthält JSON-Text. Die Screens benutzen nur die Funktionen unten, nie AsyncStorage direkt.

const KEYS = {
  nickname: '@triviatime/nickname', // einmal eingeben, über das Modal ändern
  einstellungen: '@triviatime/lastSettings', // für «Schnellstart» und vorausgefülltes Setup
  verlauf: '@triviatime/history', // eigene Resultate, auch offline; Grundlage der lokalen Bestenliste (Plan B)
  warteschlange: '@triviatime/pendingScores', // noch nicht online gesendete Punkte (für S7)
};

const MAX_VERLAUF = 50; // ältere Runden werden gelöscht, damit der Speicher klein bleibt

// Liest JSON sicher: fehlende oder kaputte Daten führen nicht zum Absturz, sondern zum Standardwert
async function lesen(key, standard) {
  try {
    const text = await AsyncStorage.getItem(key);
    return text == null ? standard : JSON.parse(text);
  } catch {
    return standard;
  }
}

async function schreiben(key, wert) {
  await AsyncStorage.setItem(key, JSON.stringify(wert));
}

// Eindeutige ID pro Resultat: verhindert Duplikate, wenn ein Score später mehrmals gesendet wird
export function neueId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ---------- Nickname ----------

// Gleiche Regel wie im Konzept: 3–15 Zeichen, nur Buchstaben und Zahlen.
// Gibt die Fehlermeldung zurück (für die Anzeige direkt beim Feld) oder null, wenn alles stimmt.
export function pruefeNickname(text) {
  const name = (text ?? '').trim();
  if (name.length < 3) return 'Mindestens 3 Zeichen.';
  if (name.length > 15) return 'Höchstens 15 Zeichen.';
  if (!/^[A-Za-z0-9ÄÖÜäöü]+$/.test(name)) return 'Nur Buchstaben und Zahlen.';
  return null;
}

export async function ladeNickname() {
  return lesen(KEYS.nickname, null);
}

export async function speichereNickname(text) {
  const fehler = pruefeNickname(text);
  if (fehler) throw new Error(fehler);
  await schreiben(KEYS.nickname, text.trim());
}

// ---------- Letzte Quiz-Einstellungen ----------

// einstellungen: { kategorie, kategorieId, schwierigkeit, anzahl }
export async function ladeEinstellungen() {
  return lesen(KEYS.einstellungen, null);
}

export async function speichereEinstellungen({ kategorie, kategorieId, schwierigkeit, anzahl }) {
  await schreiben(KEYS.einstellungen, { kategorie, kategorieId, schwierigkeit, anzahl });
}

// ---------- Verlauf (eigene Resultate) ----------

export async function ladeVerlauf() {
  return lesen(KEYS.verlauf, []);
}

// Speichert ein fertiges Resultat zuerst lokal (Konzept Kap. 5: «Jeder Score wird zuerst auf dem Handy gespeichert»)
// und legt es in die Warteschlange für die Online-Bestenliste. Gibt den gespeicherten Eintrag zurück.
export async function speichereResultat({ kategorie, kategorieId, schwierigkeit, anzahl, richtige, punkte }) {
  const eintrag = {
    id: neueId(),
    datum: new Date().toISOString(),
    nickname: (await ladeNickname()) ?? 'Gast',
    kategorie,
    kategorieId,
    schwierigkeit,
    anzahl,
    richtige,
    punkte,
  };
  const verlauf = await ladeVerlauf();
  await schreiben(KEYS.verlauf, [eintrag, ...verlauf].slice(0, MAX_VERLAUF));
  await zurWarteschlange(eintrag);
  return eintrag;
}

export function letztesResultat(verlauf) {
  return verlauf[0] ?? null; // neuestes steht vorne
}

export function bestesResultat(verlauf) {
  return verlauf.reduce((best, e) => (best == null || e.punkte > best.punkte ? e : best), null);
}

// Lokale Bestenliste: die besten eigenen Resultate, optional nur einer Kategorie
export function lokaleBestenliste(verlauf, kategorieId = null, max = 20) {
  return verlauf
    .filter((e) => kategorieId == null || e.kategorieId === kategorieId)
    .sort((a, b) => b.punkte - a.punkte)
    .slice(0, max);
}

// ---------- Warteschlange (noch nicht online gesendete Punkte) ----------

export async function ladeWarteschlange() {
  return lesen(KEYS.warteschlange, []);
}

export async function zurWarteschlange(eintrag) {
  const liste = await ladeWarteschlange();
  if (!liste.some((e) => e.id === eintrag.id)) {
    await schreiben(KEYS.warteschlange, [...liste, eintrag]);
  }
}

// Erst löschen, wenn der Server den Eintrag bestätigt hat (wird in S7 benutzt)
export async function ausWarteschlangeEntfernen(id) {
  const liste = await ladeWarteschlange();
  await schreiben(KEYS.warteschlange, liste.filter((e) => e.id !== id));
}
