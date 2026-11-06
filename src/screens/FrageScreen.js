import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { ladeFragen } from '../services/triviaApi';
import { colors } from '../theme';

// Screen 3 – Frage (Special Feature: Fragen aus der API)
// Stand S4: lädt die Fragen wirklich aus der Open Trivia DB und zeigt «lädt», «Fehler» oder die erste Frage.
// Die eigentliche Quiz-Logik (Antworten prüfen, Punkte) kommt in S5, das Design in T4.
export default function FrageScreen({ navigation, route }) {
  // Parameter vom Quiz-Setup oder vom Schnellstart
  const { kategorie, kategorieId, schwierigkeit, anzahl } = route.params;

  const [fragen, setFragen] = useState(null);
  const [fehler, setFehler] = useState(null);
  const [laden, setLaden] = useState(true);
  const [versuch, setVersuch] = useState(0); // «Erneut versuchen» erhöht den Zähler → lädt neu

  // Titel im Header setzen
  useLayoutEffect(() => {
    navigation.setOptions({ title: laden ? 'Quiz wird vorbereitet' : `Frage 1 / ${anzahl}` });
  }, [navigation, anzahl, laden]);

  // Alle Fragen der Runde mit EINER Anfrage laden – danach braucht die Runde kein Netz mehr
  useEffect(() => {
    let aktiv = true; // verhindert setState, wenn der Screen inzwischen geschlossen wurde
    setLaden(true);
    setFehler(null);
    ladeFragen({ anzahl, kategorieId, schwierigkeit })
      .then((geladen) => aktiv && setFragen(geladen))
      .catch((e) => aktiv && setFehler(e.meldung ?? 'Etwas ist schiefgelaufen.'))
      .finally(() => aktiv && setLaden(false));
    return () => {
      aktiv = false;
    };
  }, [anzahl, kategorieId, schwierigkeit, versuch]);

  // Android-Zurück öffnet dasselbe Modal wie ✕ (Konzept Kap. 6.3), statt das Quiz direkt zu verlassen
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('QuizAbbrechen');
        return true; // true = Zurück-Taste ist erledigt, nichts weiter tun
      });
      return () => sub.remove();
    }, [navigation])
  );

  // Zustand «lädt»
  if (laden) {
    return (
      <Platzhalter titel="Fragen werden geladen …" text={`${anzahl} Fragen · ${kategorie} · ${schwierigkeit}`}>
        <ActivityIndicator size="large" color={colors.primary} />
        <NavButton titel="✕ Quiz abbrechen" variante="rand" onPress={() => navigation.navigate('QuizAbbrechen')} />
      </Platzhalter>
    );
  }

  // Zustand «Fehler» (kein Netz, Timeout, zu wenig Fragen …)
  if (fehler) {
    return (
      <Platzhalter titel="⚠ Keine Fragen" text={fehler}>
        <NavButton titel="Erneut versuchen" onPress={() => setVersuch((v) => v + 1)} />
        <NavButton titel="Zurück zum Setup" variante="rand" onPress={() => navigation.navigate('QuizSetup')} />
      </Platzhalter>
    );
  }

  // Erfolg: vorerst nur die erste Frage als Text anzeigen (Kontrolle, dass die API-Daten ankommen)
  const erste = fragen[0];
  const antworten = erste.antworten.map((a, i) => `${'ABCD'[i]}  ${a}`).join('\n');
  return (
    <Platzhalter
      titel={`${fragen.length} Fragen geladen`}
      text={`${kategorie} · ${schwierigkeit}\n\nFrage 1: ${erste.frage}\n\n${antworten}`}
    >
      <NavButton
        titel="Letzte Frage beantwortet → Resultat"
        // replace: Frage wird durch Resultat ersetzt → kein Zurück ins beendete Quiz
        onPress={() => navigation.replace('Resultat', { kategorie, kategorieId, schwierigkeit, anzahl, richtige: 4 })}
      />
      <NavButton titel="✕ Quiz abbrechen" variante="rand" onPress={() => navigation.navigate('QuizAbbrechen')} />
    </Platzhalter>
  );
}
