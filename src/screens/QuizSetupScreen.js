import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { speichereEinstellungen } from '../services/speicher';

// Screen 2 – Quiz-Setup (Formular)
// Platzhalter: feste Beispielwerte. Das echte Formular mit Validierung kommt mit T3 (Tanushree).
// Wichtig für T3: vor dem Start speichereEinstellungen(...) aufrufen, damit «Schnellstart» funktioniert.
export default function QuizSetupScreen({ navigation }) {
  const starten = async (einstellungen) => {
    try {
      await speichereEinstellungen(einstellungen); // für «Schnellstart» auf Home (S6)
    } catch {
      // Speichern ist nicht kritisch: das Quiz startet trotzdem
    }
    navigation.navigate('Frage', einstellungen);
  };

  return (
    <Platzhalter titel="Quiz-Setup" text="Kategorie, Schwierigkeit und Anzahl Fragen (5–20)">
      <NavButton
        titel="Quiz starten (History · Leicht · 5)"
        onPress={() => starten({ kategorie: 'History', kategorieId: 23, schwierigkeit: 'Leicht', anzahl: 5 })}
      />
      <NavButton
        titel="Quiz starten (Science & Nature · Mittel · 10)"
        variante="rand"
        onPress={() => starten({ kategorie: 'Science & Nature', kategorieId: 17, schwierigkeit: 'Mittel', anzahl: 10 })}
      />
    </Platzhalter>
  );
}
