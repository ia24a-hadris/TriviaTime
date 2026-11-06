import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Modal «Quiz wirklich abbrechen?» – öffnet sich über die Frage
export default function QuizAbbrechenModal({ navigation }) {
  return (
    <Platzhalter titel="Quiz abbrechen?" text="Wenn du abbrichst, gehen die Punkte dieser Runde verloren.">
      <NavButton titel="Weiterspielen" onPress={() => navigation.goBack()} />
      {/* popToTop: alle Screens über Home schliessen */}
      <NavButton titel="Ja, abbrechen" variante="rand" onPress={() => navigation.popToTop()} />
    </Platzhalter>
  );
}
