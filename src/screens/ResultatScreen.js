import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 4 – Resultat
export default function ResultatScreen({ navigation, route }) {
  const { kategorie, kategorieId, schwierigkeit, anzahl, richtige } = route.params;

  return (
    <Platzhalter titel="Resultat" text={`${richtige} / ${anzahl} richtig · ${kategorie} · ${schwierigkeit}`}>
      <NavButton
        titel="Nochmals spielen"
        // replace: neue Runde mit denselben Einstellungen
        onPress={() => navigation.replace('Frage', { kategorie, kategorieId, schwierigkeit, anzahl })}
      />
      <NavButton titel="Bestenliste" variante="rand" onPress={() => navigation.navigate('Bestenliste')} />
      <NavButton titel="Startseite" variante="rand" onPress={() => navigation.popToTop()} />
    </Platzhalter>
  );
}
