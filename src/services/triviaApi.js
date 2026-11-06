// Quiz-API-Service (Paket S4) – Special Feature «Netzwerk/API».
// Lädt Kategorien und Fragen aus der Open Trivia DB (https://opentdb.com).
// Die Screens rufen nur ladeKategorien() und ladeFragen() auf und müssen nichts über die API wissen.

const BASE_URL = 'https://opentdb.com';
const TIMEOUT_MS = 10000; // Konzept: Antwortet die API nicht innerhalb von 10 s, gilt das als Verbindungsfehler
const RATE_LIMIT_WARTEN_MS = 5000; // Die API erlaubt nur 1 Anfrage alle 5 Sekunden pro IP-Adresse

// Schwierigkeit in der App (Deutsch) → Wert für die API
const SCHWIERIGKEIT = { Leicht: 'easy', Mittel: 'medium', Schwer: 'hard' };

// Fehler mit einem Code für die App und einer verständlichen Meldung für die Benutzer (keine technischen Codes zeigen)
export class TriviaApiError extends Error {
  constructor(code, meldung) {
    super(meldung);
    this.name = 'TriviaApiError';
    this.code = code; // 'NETZWERK' | 'TIMEOUT' | 'ZU_WENIG_FRAGEN' | 'UNGUELTIG' | 'ZU_VIELE_ANFRAGEN' | 'UNBEKANNT'
    this.meldung = meldung;
  }
}

const MELDUNGEN = {
  NETZWERK: 'Keine Verbindung. Prüfe WLAN oder mobile Daten und versuche es nochmals.',
  TIMEOUT: 'Die Fragen-Datenbank antwortet nicht. Bitte versuche es nochmals.',
  ZU_WENIG_FRAGEN: 'Für diese Auswahl gibt es nicht genug Fragen. Wähle weniger Fragen oder eine andere Schwierigkeit.',
  UNGUELTIG: 'Diese Einstellungen sind ungültig. Bitte prüfe das Quiz-Setup.',
  ZU_VIELE_ANFRAGEN: 'Zu viele Anfragen in kurzer Zeit. Bitte warte einen Moment.',
  UNBEKANNT: 'Etwas ist schiefgelaufen. Bitte versuche es nochmals.',
};

function fehler(code) {
  return new TriviaApiError(code, MELDUNGEN[code]);
}

const warten = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch mit Zeitlimit: bricht nach timeoutMs ab, damit die App nicht endlos «lädt»
async function holeJson(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const antwort = await fetch(url, { signal: controller.signal });
    if (!antwort.ok) {
      throw fehler(antwort.status === 429 ? 'ZU_VIELE_ANFRAGEN' : 'UNBEKANNT');
    }
    return await antwort.json();
  } catch (e) {
    if (e instanceof TriviaApiError) throw e;
    if (e.name === 'AbortError') throw fehler('TIMEOUT');
    throw fehler('NETZWERK'); // z.B. Flugmodus oder kein Empfang im Tunnel
  } finally {
    clearTimeout(timer);
  }
}

// Zu viele Anfragen kommt auf zwei Arten: als HTTP 429 oder als response_code 5.
// In beiden Fällen einmal automatisch nach 5 Sekunden nochmals versuchen.
async function holeJsonMitWiederholung(url, timeoutMs, wartenMs) {
  for (let versuch = 1; versuch <= 2; versuch++) {
    try {
      const daten = await holeJson(url, timeoutMs);
      if (daten && daten.response_code === 5 && versuch === 1) {
        await warten(wartenMs);
        continue;
      }
      return daten;
    } catch (e) {
      if (e.code === 'ZU_VIELE_ANFRAGEN' && versuch === 1) {
        await warten(wartenMs);
        continue;
      }
      throw e;
    }
  }
  return undefined; // wird nie erreicht
}

// Fisher-Yates: mischt die Antworten, damit die richtige nicht immer an derselben Stelle steht
export function mischen(liste) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

// Die API liefert mit encode=url3986 alle Texte URL-kodiert (z.B. %20). Das wandelt sie zurück in normalen Text.
// So gibt es keine Probleme mit HTML-Zeichen wie &quot; oder &#039;.
const dekodieren = (text) => decodeURIComponent(text);

/**
 * Lädt alle Kategorien für die Auswahlliste im Quiz-Setup.
 * @returns {Promise<Array<{id:number, name:string}>>} alphabetisch sortiert
 */
export async function ladeKategorien({
  baseUrl = BASE_URL,
  timeoutMs = TIMEOUT_MS,
  rateLimitWartenMs = RATE_LIMIT_WARTEN_MS,
} = {}) {
  const daten = await holeJsonMitWiederholung(`${baseUrl}/api_category.php`, timeoutMs, rateLimitWartenMs);
  if (!daten || !Array.isArray(daten.trivia_categories)) throw fehler('UNBEKANNT');
  return [...daten.trivia_categories].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Lädt alle Fragen einer Runde mit EINER Anfrage. Danach braucht die Runde kein Netz mehr.
 * @param {object} einstellungen
 * @param {number} einstellungen.anzahl  5–20 Fragen
 * @param {number} [einstellungen.kategorieId]  ID aus ladeKategorien(); leer = alle Kategorien
 * @param {'Leicht'|'Mittel'|'Schwer'} [einstellungen.schwierigkeit]
 * @returns {Promise<Array<{nr:number, frage:string, kategorie:string, schwierigkeit:string, typ:string, antworten:string[], richtig:string}>>}
 */
export async function ladeFragen(
  { anzahl, kategorieId, schwierigkeit },
  { baseUrl = BASE_URL, timeoutMs = TIMEOUT_MS, rateLimitWartenMs = RATE_LIMIT_WARTEN_MS } = {}
) {
  // Gleiche Regeln wie die Validierung im Formular (5–20 Fragen)
  if (!Number.isInteger(anzahl) || anzahl < 5 || anzahl > 20) throw fehler('UNGUELTIG');
  if (schwierigkeit && !SCHWIERIGKEIT[schwierigkeit]) throw fehler('UNGUELTIG');

  const parameter = [`amount=${anzahl}`, 'encode=url3986'];
  if (kategorieId) parameter.push(`category=${kategorieId}`);
  if (schwierigkeit) parameter.push(`difficulty=${SCHWIERIGKEIT[schwierigkeit]}`);
  const url = `${baseUrl}/api.php?${parameter.join('&')}`;

  const daten = await holeJsonMitWiederholung(url, timeoutMs, rateLimitWartenMs);

  switch (daten && daten.response_code) {
    case 0:
      break;
    case 1:
      throw fehler('ZU_WENIG_FRAGEN');
    case 2:
      throw fehler('UNGUELTIG');
    case 5:
      throw fehler('ZU_VIELE_ANFRAGEN');
    default:
      throw fehler('UNBEKANNT');
  }

  return daten.results.map((r, index) => {
    const richtig = dekodieren(r.correct_answer);
    const alle = [richtig, ...r.incorrect_answers.map(dekodieren)];
    return {
      nr: index + 1,
      frage: dekodieren(r.question),
      kategorie: dekodieren(r.category),
      schwierigkeit: r.difficulty, // 'easy' | 'medium' | 'hard'
      typ: r.type, // 'multiple' (4 Antworten) oder 'boolean' (True/False)
      // True/False immer in derselben Reihenfolge, sonst mischen
      antworten: r.type === 'boolean' ? ['True', 'False'] : mischen(alle),
      richtig,
    };
  });
}
