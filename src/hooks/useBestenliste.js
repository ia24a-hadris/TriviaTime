import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { istKonfiguriert, ladeTopScores, sendeWarteschlange } from '../services/onlineBestenliste';
import { ladeNickname, ladeVerlauf, lokaleBestenliste } from '../services/speicher';

// Daten für den Bestenliste-Screen (Paket S7). Das Aussehen baut Tanushree in T5 – sie benutzt nur diesen Hook.
//
// modus:  'online' (Top 20 aus Firestore) oder 'lokal' (eigene Resultate auf dem Handy)
// status: 'laden' | 'fehler' (kein Netz) | 'leer' (noch keine Einträge) | 'ok'
// eintraege: [{ id, nickname, punkte, kategorie, datum, istDu }]
export default function useBestenliste({ kategorieId = null } = {}) {
  const onlineMoeglich = istKonfiguriert(); // Plan B: ohne Firebase gibt es nur «lokal»
  const [modus, setModus] = useState(onlineMoeglich ? 'online' : 'lokal');
  const [status, setStatus] = useState('laden');
  const [eintraege, setEintraege] = useState([]);
  const [versuch, setVersuch] = useState(0);

  // Bei jedem Öffnen neu laden; online vorher die Warteschlange senden (Konzept Kap. 5)
  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      setStatus('laden');
      (async () => {
        const nickname = await ladeNickname();
        try {
          let liste;
          if (modus === 'online') {
            await sendeWarteschlange();
            liste = await ladeTopScores(kategorieId);
          } else {
            liste = lokaleBestenliste(await ladeVerlauf(), kategorieId);
          }
          if (!aktiv) return;
          setEintraege(liste.map((e) => ({ ...e, istDu: !!nickname && e.nickname === nickname })));
          setStatus(liste.length === 0 ? 'leer' : 'ok');
        } catch {
          if (aktiv) setStatus('fehler'); // kein Netz oder Firestore nicht erreichbar
        }
      })();
      return () => {
        aktiv = false;
      };
    }, [modus, kategorieId, versuch])
  );

  const neuLaden = useCallback(() => setVersuch((v) => v + 1), []);

  return { modus, setModus, onlineMoeglich, status, eintraege, neuLaden };
}
