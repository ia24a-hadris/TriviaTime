import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { bestesResultat, ladeEinstellungen, ladeNickname, ladeVerlauf, letztesResultat } from '../services/speicher';

// Screen 1 – Home (Startscreen im Tab «Spielen»)
// Stand S6: zeigt Nickname, letztes Quiz und besten Score aus dem Speicher; «Schnellstart» nutzt die letzten Einstellungen.
// Das Design kommt mit T2 (Tanushree).
export default function HomeScreen({ navigation }) {
  const [nickname, setNickname] = useState(null);
  const [einstellungen, setEinstellungen] = useState(null);
  const [verlauf, setVerlauf] = useState([]);
  const [geladen, setGeladen] = useState(false);

  // Bei jedem Öffnen neu laden (z.B. nach einer Runde oder nach «Nickname ändern»)
  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      Promise.all([ladeNickname(), ladeEinstellungen(), ladeVerlauf()]).then(([n, e, v]) => {
        if (!aktiv) return;
        setNickname(n);
        setEinstellungen(e);
        setVerlauf(v);
        setGeladen(true);
      });
      return () => {
        aktiv = false;
      };
    }, [])
  );

  if (!geladen) return null;

  // Sonderzustand «Erster Start»: noch kein Nickname
  if (!nickname) {
    return (
      <Platzhalter
        titel="Willkommen bei Trivia Time!"
        text={'So funktioniert’s:\n1. Nickname wählen\n2. Kategorie, Schwierigkeit und Anzahl Fragen einstellen\n3. Fragen beantworten und in die Bestenliste kommen'}
      >
        <NavButton titel="Nickname wählen" onPress={() => navigation.navigate('NicknameModal')} />
      </Platzhalter>
    );
  }

  const letztes = letztesResultat(verlauf);
  const bestes = bestesResultat(verlauf);
  const zeilen = [
    'Bereit für die nächste Runde?',
    letztes
      ? `Letztes Quiz: ${letztes.kategorie} · ${letztes.schwierigkeit} · ${letztes.richtige} / ${letztes.anzahl} richtig · ${letztes.punkte} Punkte`
      : 'Noch kein Quiz gespielt.',
    bestes ? `Dein bester Score: ${bestes.punkte} Punkte (${bestes.kategorie})` : null,
  ].filter(Boolean);

  return (
    <Platzhalter titel={`Hallo, ${nickname}!`} text={zeilen.join('\n\n')}>
      <NavButton titel="Neues Quiz starten" onPress={() => navigation.navigate('QuizSetup')} />
      <NavButton
        titel={
          einstellungen
            ? `Schnellstart: ${einstellungen.kategorie} · ${einstellungen.schwierigkeit} · ${einstellungen.anzahl}`
            : 'Schnellstart (noch keine Einstellungen)'
        }
        variante="rand"
        // Schnellstart springt mit den zuletzt gespeicherten Einstellungen direkt zur Frage
        onPress={() => (einstellungen ? navigation.navigate('Frage', einstellungen) : navigation.navigate('QuizSetup'))}
      />
      <NavButton titel="Nickname ändern ✎" variante="rand" onPress={() => navigation.navigate('NicknameModal')} />
      <NavButton titel="Zur Bestenliste" variante="rand" onPress={() => navigation.navigate('Bestenliste')} />
    </Platzhalter>
  );
}
