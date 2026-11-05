// Farben und Schriften aus dem Farbkonzept (Konzept Kap. 8.1).
// Alle Screens holen ihre Farben und Schriften von hier, damit die App überall gleich aussieht.

export const colors = {
  // Menü (ruhig)
  primary: '#5B3FD9',
  background: '#F6F5FB',
  card: '#FFFFFF',
  text: '#1C1B2E',
  textMuted: '#5E5C74',
  border: '#E2E0EE',

  // Spiel (bunt)
  gameBackground: '#24175E',
  accent: '#FFC83D', // Punkte, Fortschritt, «Weiter»
  answerA: '#7C3AED', // Stern
  answerB: '#1D6FD8', // Blitz
  answerC: '#D9480F', // Herz
  answerD: '#DB2777', // Mond

  // Feedback (nur mit ✓/✗ und Text verwenden)
  correct: '#1E8E3E',
  wrong: '#C5221F',
};

// Jede Schriftstärke ist eine eigene Schrift (nicht fontWeight verwenden, sonst zeigt Android oft die normale Schrift).
export const fonts = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
  black: 'Nunito_900Black',
};

// Mindestgrössen aus dem Konzept: Touch-Targets mind. 48 dp, Hauptbuttons 56 dp, Abstand mind. 8 dp.
export const sizes = {
  touchMin: 48,
  buttonMain: 56,
  gap: 8,
  screenPadding: 16,
  radius: 14,
};
