import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, fonts, sizes } from '../theme';

// Einfacher Button für die Platzhalter-Screens (wird später durch Tanushrees UI-Bausteine ersetzt).
// variante 'voll' = Hauptaktion, 'rand' = Nebenaktion
export default function NavButton({ titel, onPress, variante = 'voll' }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        variante === 'rand' && styles.rand,
        pressed && styles.gedrueckt,
      ]}
    >
      <Text style={[styles.text, variante === 'rand' && styles.textRand]}>{titel}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: sizes.touchMin, // Touch-Target mindestens 48 dp
    alignSelf: 'stretch',
    borderRadius: sizes.radius,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  rand: { backgroundColor: colors.card, borderWidth: 2, borderColor: colors.primary },
  gedrueckt: { opacity: 0.7 },
  text: { color: '#FFFFFF', fontSize: 16, fontFamily: fonts.extrabold },
  textRand: { color: colors.primary },
});
