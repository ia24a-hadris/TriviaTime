import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import useScoreSenden from '../hooks/useScoreSenden';

// Screen 4 – Resultat
// Stand S7: Score wird nach der Runde an die Online-Bestenliste gesendet; der Status-Kasten zeigt, wo die Punkte sind.
// Das Design kommt mit T5 (Tanushree) – sie benutzt dafür useScoreSenden().
export default function ResultatScreen({ navigation, route }) {
  const { kategorie, kategorieId, schwierigkeit, anzahl, richtige, punkte, rechenzeile, gespeichert, id } =
    route.params;
  const senden = useScoreSenden({ id, kategorieId });

  // Status-Kasten: sagt immer klar, wo die Punkte gerade sind (Selbstbeschreibungsfähigkeit, Konzept Kap. 6.4)
  let status;
  if (!gespeichert) status = '⚠ Konnte nicht gespeichert werden';
  else if (senden.status === 'senden') status = '⟳ Score wird gesendet … Deine Punkte sind bereits lokal gesichert.';
  else if (senden.status === 'online')
    status = senden.rang
      ? `✓ Gespeichert. Du bist auf Rang #${senden.rang} in ${kategorie}.`
      : `✓ Gespeichert. Noch nicht in den Top 20 von ${kategorie}.`;
  else if (senden.status === 'offline')
    status = '⚠ Keine Verbindung. Deine Punkte sind lokal gespeichert und werden automatisch gesendet, sobald du wieder online bist.';
  else status = '✓ Auf dem Handy gespeichert';

  // Rechenzeile «So zählt es» erklärt das Punktesystem (Lernförderlichkeit, Konzept Kap. 6.4)
  const text = `${richtige} / ${anzahl} richtig · ${punkte ?? 0} Punkte\n${kategorie} · ${schwierigkeit}${
    rechenzeile ? `\n\nSo zählt es: ${rechenzeile}` : ''
  }\n\n${status}`;

  return (
    <Platzhalter titel="Resultat" text={text}>
      {senden.status === 'offline' ? (
        <NavButton titel="Jetzt erneut senden" variante="rand" onPress={senden.erneutSenden} />
      ) : null}
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
