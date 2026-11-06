import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import Platzhalter from '../components/Platzhalter';
import NavButton from '../components/NavButton';
import { ladeNickname, pruefeNickname, speichereNickname } from '../services/speicher';
import { colors, fonts, sizes } from '../theme';

// Modal «Nickname ändern» – öffnet sich über Home (auch beim ersten Start)
// Stand S6: Eingabe mit Validierung (3–15 Zeichen, nur Buchstaben und Zahlen) und Speichern.
// Das Design kommt mit T2 (Tanushree).
export default function NicknameModal({ navigation }) {
  const [text, setText] = useState('');
  const [fehler, setFehler] = useState(null);

  // Vorhandenen Nickname vorausfüllen
  useEffect(() => {
    ladeNickname().then((n) => n && setText(n));
  }, []);

  const speichern = async () => {
    const meldung = pruefeNickname(text);
    setFehler(meldung);
    if (meldung) return; // Fehler steht direkt beim Feld, Modal bleibt offen
    try {
      await speichereNickname(text);
      navigation.goBack();
    } catch {
      setFehler('Konnte nicht gespeichert werden. Bitte nochmals versuchen.');
    }
  };

  return (
    <Platzhalter titel="Nickname" text="3 bis 15 Zeichen, nur Buchstaben und Zahlen.">
      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
          if (fehler) setFehler(pruefeNickname(t)); // Meldung verschwindet, sobald es stimmt
        }}
        placeholder="Dein Nickname"
        maxLength={20}
        autoCapitalize="none"
        autoCorrect={false}
        style={[styles.feld, fehler && styles.feldFehler]}
        accessibilityLabel="Nickname"
      />
      {fehler ? <Text style={styles.fehler}>⚠ {fehler}</Text> : null}
      <Text style={styles.zaehler}>{text.trim().length}/15</Text>
      <NavButton titel="Speichern" onPress={speichern} />
      <NavButton titel="Abbrechen" variante="rand" onPress={() => navigation.goBack()} />
    </Platzhalter>
  );
}

const styles = StyleSheet.create({
  feld: {
    minHeight: sizes.touchMin,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: sizes.radius,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    fontSize: 17,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  feldFehler: { borderColor: colors.wrong },
  fehler: { color: colors.wrong, fontFamily: fonts.extrabold, fontSize: 14 },
  zaehler: { color: colors.textMuted, fontFamily: fonts.regular, fontSize: 13, textAlign: 'right' },
});
