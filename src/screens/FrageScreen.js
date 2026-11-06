import { useCallback, useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import useQuiz from '../hooks/useQuiz';
import { colors } from '../theme';

// Screen 3 – Frage (Special Feature: Fragen aus der API)
// Stand S5: die Runde ist komplett spielbar. Das Aussehen ist noch ein Platzhalter – das Design kommt mit T4 (Tanushree).
// Alles, was die Runde steuert, liegt im Hook useQuiz (src/hooks/useQuiz.js).
export default function FrageScreen({ navigation, route }) {
  const { kategorie, kategorieId, schwierigkeit, anzahl } = route.params;
  const quiz = useQuiz({ anzahl, kategorieId, schwierigkeit });

  // Header: «Frage 3 / 10 · 40 Punkte»
  useLayoutEffect(() => {
    const titel =
      quiz.status === 'laden' || quiz.status === 'fehler'
        ? 'Quiz wird vorbereitet'
        : `Frage ${quiz.nr} / ${quiz.anzahl} · ${quiz.punkte} Punkte`;
    navigation.setOptions({ title: titel });
  }, [navigation, quiz.status, quiz.nr, quiz.anzahl, quiz.punkte]);

  // Nach der letzten Frage: Resultat ersetzt die Frage (replace) → kein Zurück ins beendete Quiz
  useEffect(() => {
    if (quiz.status === 'fertig') {
      navigation.replace('Resultat', {
        kategorie,
        kategorieId,
        schwierigkeit,
        anzahl: quiz.anzahl,
        richtige: quiz.richtige,
        punkte: quiz.punkte,
        rechenzeile: quiz.rechenzeile,
      });
    }
  }, [quiz.status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Android-Zurück öffnet dasselbe Modal wie ✕ (Konzept Kap. 6.3), statt das Quiz direkt zu verlassen
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.navigate('QuizAbbrechen');
        return true;
      });
      return () => sub.remove();
    }, [navigation])
  );

  const abbrechen = () => navigation.navigate('QuizAbbrechen');

  if (quiz.status === 'laden') {
    return (
      <Platzhalter titel="Fragen werden geladen …" text={`${anzahl} Fragen · ${kategorie} · ${schwierigkeit}`}>
        <ActivityIndicator size="large" color={colors.primary} />
        <NavButton titel="✕ Quiz abbrechen" variante="rand" onPress={abbrechen} />
      </Platzhalter>
    );
  }

  if (quiz.status === 'fehler') {
    return (
      <Platzhalter titel="⚠ Keine Fragen" text={quiz.fehler}>
        <NavButton titel="Erneut versuchen" onPress={quiz.erneutLaden} />
        <NavButton titel="Zurück zum Setup" variante="rand" onPress={() => navigation.navigate('QuizSetup')} />
      </Platzhalter>
    );
  }

  if (!quiz.frage) return null; // kurz beim Wechsel zum Resultat

  // Feedback nach der Antwort: ✓/✗ immer mit Text, nicht nur Farbe (Konzept Kap. 8.3)
  if (quiz.status === 'feedback') {
    const { richtig, punkte } = quiz.letztesErgebnis;
    const kopf = richtig
      ? `✓ Richtig! +${punkte} Punkte`
      : `✗ Leider falsch. Richtig ist: ${quiz.frage.richtig}`;
    const liste = quiz.frage.antworten
      .map((a, i) => {
        const markierung = a === quiz.frage.richtig ? '✓ richtig' : a === quiz.gewaehlt ? '✗ deine Antwort' : '';
        return `${'ABCD'[i]}  ${a}  ${markierung}`;
      })
      .join('\n');
    const istLetzte = quiz.nr === quiz.anzahl;
    return (
      <Platzhalter titel={kopf} text={`${quiz.frage.frage}\n\n${liste}`}>
        <NavButton titel={istLetzte ? 'Zum Resultat ›' : 'Weiter ›'} onPress={quiz.weiter} />
      </Platzhalter>
    );
  }

  // Frage offen: jede Antwort ist ein Button, nur die erste Antwort zählt
  return (
    <Platzhalter titel={`Frage ${quiz.nr}`} text={quiz.frage.frage}>
      {quiz.frage.antworten.map((a, i) => (
        <NavButton key={a} titel={`${'ABCD'[i]}  ${a}`} variante="rand" onPress={() => quiz.antworten(a)} />
      ))}
      <NavButton titel="✕ Quiz abbrechen" variante="rand" onPress={abbrechen} />
    </Platzhalter>
  );
}
