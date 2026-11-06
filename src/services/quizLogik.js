// Quiz-Regeln (Paket S5) – reine Funktionen ohne UI, darum leicht zu testen.
// Punkte pro richtige Antwort je nach Schwierigkeit (Konzept Kap. 1.3): Leicht 10, Mittel 20, Schwer 30.

export const PUNKTE_PRO_RICHTIGE = { easy: 10, medium: 20, hard: 30 };

// Schwierigkeit für Anzeigen (API-Wert → Deutsch)
export const SCHWIERIGKEIT_DE = { easy: 'Leicht', medium: 'Mittel', hard: 'Schwer' };

export function punkteFuer(frage) {
  return PUNKTE_PRO_RICHTIGE[frage.schwierigkeit] ?? 0;
}

// Prüft eine Antwort. Falsche Antworten geben 0 Punkte (keine Minuspunkte).
export function auswerten(frage, antwort) {
  const richtig = antwort === frage.richtig;
  return { richtig, punkte: richtig ? punkteFuer(frage) : 0 };
}

// Fasst eine fertige Runde zusammen.
// ergebnisse: Liste von { richtig, punkte } – eine pro beantwortete Frage
export function zusammenfassen(ergebnisse) {
  const richtige = ergebnisse.filter((e) => e.richtig).length;
  const punkte = ergebnisse.reduce((summe, e) => summe + e.punkte, 0);
  return { richtige, anzahl: ergebnisse.length, punkte };
}

// Text für die Rechenzeile auf dem Resultat-Screen (Lernförderlichkeit, Konzept Kap. 6.4),
// z.B. «8 richtig × 20 Punkte (Mittel) = 160». Bei gemischten Schwierigkeiten nur die Summe.
export function rechenzeile(fragen, ergebnisse) {
  const { richtige, punkte } = zusammenfassen(ergebnisse);
  const stufen = [...new Set(fragen.map((f) => f.schwierigkeit))];
  if (stufen.length === 1) {
    const stufe = stufen[0];
    return `${richtige} richtig × ${PUNKTE_PRO_RICHTIGE[stufe]} Punkte (${SCHWIERIGKEIT_DE[stufe]}) = ${punkte}`;
  }
  return `${richtige} richtig, Punkte je nach Schwierigkeit (10 / 20 / 30) = ${punkte}`;
}
