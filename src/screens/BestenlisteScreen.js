import { ActivityIndicator } from 'react-native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import useBestenliste from '../hooks/useBestenliste';
import { colors } from '../theme';

// Screen 5 – Bestenliste (eigener Tab)
// Stand S7: Umschalter Online (Top 20) / Lokal mit den Zuständen lädt, kein Netz und leer.
// Das Design (Siegertreppchen, Liste) kommt mit T5 (Tanushree) – sie benutzt dafür useBestenliste().
export default function BestenlisteScreen({ navigation }) {
  const b = useBestenliste();
  const quizStarten = () => navigation.navigate('Spielen', { screen: 'QuizSetup' });

  // Umschalter (nur wenn Firebase eingerichtet ist – sonst Plan B: nur lokal)
  const umschalter = b.onlineMoeglich ? (
    <>
      <NavButton
        titel={b.modus === 'online' ? '● Online (Top 20)' : 'Online (Top 20)'}
        variante={b.modus === 'online' ? 'voll' : 'rand'}
        onPress={() => b.setModus('online')}
      />
      <NavButton
        titel={b.modus === 'lokal' ? '● Lokal' : 'Lokal'}
        variante={b.modus === 'lokal' ? 'voll' : 'rand'}
        onPress={() => b.setModus('lokal')}
      />
    </>
  ) : null;

  const titel = b.modus === 'online' ? 'Bestenliste (online)' : 'Bestenliste (lokal)';

  if (b.status === 'laden') {
    return (
      <Platzhalter titel={titel} text="⟳ Bestenliste wird geladen …">
        <ActivityIndicator size="large" color={colors.primary} />
        {umschalter}
      </Platzhalter>
    );
  }

  if (b.status === 'fehler') {
    return (
      <Platzhalter
        titel="⚠ Kein Netz"
        text="Die Online-Bestenliste ist gerade nicht erreichbar. Deine eigenen Resultate sind auf dem Handy gespeichert."
      >
        <NavButton titel="Erneut versuchen" onPress={b.neuLaden} />
        <NavButton titel="Lokale Resultate anzeigen" variante="rand" onPress={() => b.setModus('lokal')} />
      </Platzhalter>
    );
  }

  if (b.status === 'leer') {
    return (
      <Platzhalter titel="Noch keine Einträge" text="Spiel ein Quiz und hol dir Platz 1!">
        <NavButton titel="Quiz starten" onPress={quizStarten} />
        {umschalter}
      </Platzhalter>
    );
  }

  const text = b.eintraege
    .slice(0, 10)
    .map((e, i) => `${i + 1}.  ${e.nickname}${e.istDu ? ' (Du)' : ''}  ·  ${e.punkte} Punkte  ·  ${e.kategorie}`)
    .join('\n');

  return (
    <Platzhalter titel={titel} text={text}>
      {umschalter}
      <NavButton titel="Aktualisieren" variante="rand" onPress={b.neuLaden} />
    </Platzhalter>
  );
}
