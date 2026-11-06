import { useCallback, useEffect, useState } from 'react';
import { ladeFragen } from '../services/triviaApi';
import { auswerten, rechenzeile, zusammenfassen } from '../services/quizLogik';

// Ablauf einer Quizrunde (Paket S5). Die Logik ist hier, das Aussehen im Frage-Screen (T4, Tanushree).
// So arbeiten wir in getrennten Dateien und vermeiden Merge-Konflikte (Risiko R3 in der Planung).
//
// status:
//   'laden'    – Fragen werden geladen
//   'fehler'   – Laden hat nicht geklappt (fehler enthält die Meldung)
//   'frage'    – aktuelle Frage ist offen
//   'feedback' – Antwort gewählt, richtig/falsch wird angezeigt, «Weiter» ist möglich
//   'fertig'   – letzte Frage beantwortet, zusammenfassung ist bereit
export default function useQuiz({ anzahl, kategorieId, schwierigkeit }) {
  const [status, setStatus] = useState('laden');
  const [fehler, setFehler] = useState(null);
  const [fragen, setFragen] = useState([]);
  const [index, setIndex] = useState(0);
  const [gewaehlt, setGewaehlt] = useState(null);
  const [ergebnisse, setErgebnisse] = useState([]);
  const [versuch, setVersuch] = useState(0);

  // Alle Fragen der Runde mit EINER Anfrage laden – danach braucht die Runde kein Netz mehr
  useEffect(() => {
    let aktiv = true;
    setStatus('laden');
    setFehler(null);
    setIndex(0);
    setGewaehlt(null);
    setErgebnisse([]);
    ladeFragen({ anzahl, kategorieId, schwierigkeit })
      .then((geladen) => {
        if (!aktiv) return;
        setFragen(geladen);
        setStatus('frage');
      })
      .catch((e) => {
        if (!aktiv) return;
        setFehler(e.meldung ?? 'Etwas ist schiefgelaufen.');
        setStatus('fehler');
      });
    return () => {
      aktiv = false;
    };
  }, [anzahl, kategorieId, schwierigkeit, versuch]);

  const frage = fragen[index] ?? null;

  // Nur die erste Antwort pro Frage zählt
  const antworten = useCallback(
    (antwort) => {
      if (status !== 'frage' || !frage) return;
      setGewaehlt(antwort);
      setErgebnisse((alt) => [...alt, auswerten(frage, antwort)]);
      setStatus('feedback');
    },
    [status, frage]
  );

  // Zur nächsten Frage – oder fertig nach der letzten
  const weiter = useCallback(() => {
    if (status !== 'feedback') return;
    if (index + 1 < fragen.length) {
      setIndex(index + 1);
      setGewaehlt(null);
      setStatus('frage');
    } else {
      setStatus('fertig');
    }
  }, [status, index, fragen.length]);

  const erneutLaden = useCallback(() => setVersuch((v) => v + 1), []);

  const { richtige, punkte } = zusammenfassen(ergebnisse);
  const letztesErgebnis = status === 'feedback' ? ergebnisse[ergebnisse.length - 1] : null;

  return {
    status,
    fehler,
    frage,
    nr: index + 1,
    anzahl: fragen.length || anzahl,
    gewaehlt,
    letztesErgebnis,
    richtige,
    punkte,
    rechenzeile: status === 'fertig' ? rechenzeile(fragen, ergebnisse) : null,
    antworten,
    weiter,
    erneutLaden,
  };
}
