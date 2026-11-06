import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';

// Screen 4 – Resultat
export default function ResultatScreen({ navigation, route }) {
  const { kategorie, kategorieId, schwierigkeit, anzahl, richtige, punkte, rechenzeile } = route.params;

  // Rechenzeile «So zählt es» erklärt das Punktesystem (Lernförderlichkeit, Konzept Kap. 6.4)
  const text = `${richtige} / ${anzahl} richtig · ${punkte ?? 0} Punkte\n${kategorie} · ${schwierigkeit}${
    rechenzeile ? `\n\nSo zählt es: ${rechenzeile}` : ''
  }`;

  return (
    <Platzhalter titel="Resultat" text={text}>
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
