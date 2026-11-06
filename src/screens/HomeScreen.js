import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 1 – Home (Startscreen im Tab «Spielen»)
export default function HomeScreen({ navigation }) {
  return (
    <Platzhalter titel="Home" text="Begrüssung, letztes Quiz und bester Score">
      <NavButton titel="Neues Quiz starten" onPress={() => navigation.navigate('QuizSetup')} />
      <NavButton
        titel="Schnellstart: letzte Einstellungen"
        variante="rand"
        // Schnellstart springt direkt zur Frage – mit den letzten Einstellungen als Parameter
        onPress={() =>
          navigation.navigate('Frage', {
            kategorie: 'Science & Nature',
            schwierigkeit: 'Mittel',
            anzahl: 10,
          })
        }
      />
      <NavButton titel="Nickname ändern ✎" variante="rand" onPress={() => navigation.navigate('NicknameModal')} />
      {/* Wechsel in den anderen Tab */}
      <NavButton titel="Zur Bestenliste" variante="rand" onPress={() => navigation.navigate('Bestenliste')} />
    </Platzhalter>
  );
}
