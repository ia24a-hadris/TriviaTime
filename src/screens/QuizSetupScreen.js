import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 2 – Quiz-Setup (Formular)
export default function QuizSetupScreen({ navigation }) {
  return (
    <Platzhalter titel="Quiz-Setup" text="Kategorie, Schwierigkeit und Anzahl Fragen (5–20)">
      <NavButton
        titel="Quiz starten"
        // Parameter-Übergabe: die Einstellungen gehen an den Frage-Screen
        onPress={() =>
          navigation.navigate('Frage', {
            kategorie: 'History',
            schwierigkeit: 'Leicht',
            anzahl: 5,
          })
        }
      />
    </Platzhalter>
  );
}
