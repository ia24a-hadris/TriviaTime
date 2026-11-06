import { useCallback, useEffect, useState } from 'react';
import { istKonfiguriert, rangInKategorie, sendeWarteschlange } from '../services/onlineBestenliste';

// Sendet nach einer Runde die Punkte an die Online-Bestenliste (Paket S7).
// Der Score liegt schon lokal in der Warteschlange (S6) – hier wird die Warteschlange gesendet.
//
// status (für den Status-Kasten auf dem Resultat, Konzept Kap. 6.4):
//   'lokal'   – Online-Bestenliste nicht eingerichtet (Plan B): Punkte sind nur auf dem Handy
//   'senden'  – Score wird gesendet …
//   'online'  – in der Online-Bestenliste gespeichert (rang = Platz in der Kategorie oder null)
//   'offline' – kein Netz: lokal gespeichert, wird später automatisch gesendet
export default function useScoreSenden({ id, kategorieId }) {
  const [status, setStatus] = useState(istKonfiguriert() ? 'senden' : 'lokal');
  const [rang, setRang] = useState(null);
  const [versuch, setVersuch] = useState(0);

  useEffect(() => {
    if (!istKonfiguriert() || !id) return undefined;
    let aktiv = true;
    setStatus('senden');
    (async () => {
      const { offen } = await sendeWarteschlange();
      if (!aktiv) return;
      if (offen > 0) {
        setStatus('offline');
        return;
      }
      setStatus('online');
      try {
        const platz = await rangInKategorie(id, kategorieId);
        if (aktiv) setRang(platz);
      } catch {
        // Rang ist nur eine Zusatzinfo – ohne Rang trotzdem «online»
      }
    })();
    return () => {
      aktiv = false;
    };
  }, [id, kategorieId, versuch]);

  const erneutSenden = useCallback(() => setVersuch((v) => v + 1), []);

  return { status, rang, erneutSenden };
}
