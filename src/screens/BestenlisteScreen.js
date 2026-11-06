import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { ladeVerlauf, lokaleBestenliste } from '../services/speicher';
import { machbarkeitstest } from '../services/onlineBestenliste';

// Screen 5 – Bestenliste (eigener Tab)
// Stand S6: zeigt die lokale Bestenliste aus dem Speicher (Plan B). Online-Top-20 kommt mit S7, das Design mit T5.
export default function BestenlisteScreen({ navigation }) {
  const [liste, setListe] = useState(null);
  const [testText, setTestText] = useState(null); // Ergebnis des Machbarkeitstests (S2)

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

  const testen = async () => {
    setTestText('Online-Verbindung wird getestet …');
    setTestText(await machbarkeitstest());
  };

  return (
    <Platzhalter titel="Bestenliste (lokal)" text={testText ? `${text}\n\n${testText}` : text}>
      {/* Vorübergehend für den Machbarkeitstest S2 – wird mit S7 / T5 wieder entfernt */}
      <NavButton titel="Online-Verbindung testen (S2)" variante="rand" onPress={testen} />
      <NavButton
        titel="Quiz starten"
        // In den Tab «Spielen» wechseln und dort direkt das Quiz-Setup öffnen
        onPress={() => navigation.navigate('Spielen', { screen: 'QuizSetup' })}
      />
    </Platzhalter>
  );
}
