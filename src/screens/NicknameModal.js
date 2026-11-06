import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Modal «Nickname ändern» – öffnet sich über Home
export default function NicknameModal({ navigation }) {
  return (
    <Platzhalter titel="Nickname ändern" text="Eingabefeld mit Validierung (3–15 Zeichen)">
      <NavButton titel="Speichern" onPress={() => navigation.goBack()} />
      <NavButton titel="Abbrechen" variante="rand" onPress={() => navigation.goBack()} />
    </Platzhalter>
  );
}
