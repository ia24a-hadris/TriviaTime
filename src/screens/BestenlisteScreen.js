import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { ladeVerlauf, lokaleBestenliste } from '../services/speicher';

// Screen 5 – Bestenliste (eigener Tab)
// Stand S6: zeigt die lokale Bestenliste aus dem Speicher (Plan B). Online-Top-20 kommt mit S7, das Design mit T5.
export default function BestenlisteScreen({ navigation }) {
  const [liste, setListe] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let aktiv = true;
      ladeVerlauf().then((v) => aktiv && setListe(lokaleBestenliste(v)));
      return () => {
        aktiv = false;
      };
    }, [])
  );

  if (liste == null) return null;

  const text =
    liste.length === 0
      ? 'Noch keine Einträge. Spiel ein Quiz und hol dir Platz 1!'
      : liste
          .slice(0, 8)
          .map((e, i) => `${i + 1}.  ${e.nickname}  ·  ${e.punkte} Punkte  ·  ${e.kategorie}`)
          .join('\n');

  return (
    <Platzhalter titel="Bestenliste (lokal)" text={text}>
      <NavButton
        titel="Quiz starten"
        // In den Tab «Spielen» wechseln und dort direkt das Quiz-Setup öffnen
        onPress={() => navigation.navigate('Spielen', { screen: 'QuizSetup' })}
      />
    </Platzhalter>
  );
}
