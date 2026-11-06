import { useCallback, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 3 – Frage (Special Feature: Fragen aus der API)
export default function FrageScreen({ navigation, route }) {
  // Parameter vom Quiz-Setup oder vom Schnellstart
  const { kategorie, schwierigkeit, anzahl } = route.params;

  // Titel im Header setzen
  useLayoutEffect(() => {
    navigation.setOptions({ title: `Frage 1 / ${anzahl}` });
  }, [navigation, anzahl]);

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

  return (
    <Platzhalter titel="Frage" text={`${kategorie} · ${schwierigkeit} · ${anzahl} Fragen`}>
      <NavButton
        titel="Letzte Frage beantwortet → Resultat"
        // replace: Frage wird durch Resultat ersetzt → kein Zurück ins beendete Quiz
        onPress={() => navigation.replace('Resultat', { kategorie, schwierigkeit, anzahl, richtige: 4 })}
      />
      <NavButton titel="✕ Quiz abbrechen" variante="rand" onPress={() => navigation.navigate('QuizAbbrechen')} />
    </Platzhalter>
  );
}
