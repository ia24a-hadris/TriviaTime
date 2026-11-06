import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 5 – Bestenliste (eigener Tab)
export default function BestenlisteScreen({ navigation }) {
  return (
    <Platzhalter titel="Bestenliste" text="Online (Top 20) und lokale Resultate">
      <NavButton
        titel="Quiz starten"
        // In den Tab «Spielen» wechseln und dort direkt das Quiz-Setup öffnen
        onPress={() => navigation.navigate('Spielen', { screen: 'QuizSetup' })}
      />
    </Platzhalter>
  );
}
