import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, sizes } from '../theme';

// Gerüst für alle Platzhalter-Screens: Titel, kurze Beschreibung, darunter die Buttons.
// children = alles, was zwischen <Platzhalter> und </Platzhalter> steht (hier die Buttons)
export default function Platzhalter({ titel, text, children }) {
  return (
    <SafeAreaView style={styles.safe} edges={['left', 'right', 'bottom']}>
      <View style={styles.mitte}>
        <Text style={styles.titel}>{titel}</Text>
        {text ? <Text style={styles.text}>{text}</Text> : null}
      </View>
      <View style={styles.buttons}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  mitte: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: sizes.gap },
  titel: { fontSize: 28, fontFamily: fonts.black, color: colors.text },
  text: { fontSize: 15, fontFamily: fonts.regular, color: colors.textMuted, textAlign: 'center' },
  buttons: { padding: sizes.screenPadding, gap: sizes.gap }, // Abstand zwischen Buttons mindestens 8 dp
});
