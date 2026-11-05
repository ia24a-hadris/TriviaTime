import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import { colors, fonts, sizes } from './src/theme';

// Startpunkt der App. Die Navigation (Tab-Bar + Stack) kommt im Paket S3 dazu.
export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  // Erst rendern, wenn die Schrift geladen ist (sonst kurz falsche Schrift oder Fehler).
  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Trivia Time</Text>
          <Text style={styles.text}>Setup erfolgreich – die App läuft in Expo Go.</Text>
        </View>
        <StatusBar style="dark" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: sizes.screenPadding,
  },
  card: {
    backgroundColor: colors.gameBackground,
    borderRadius: 20,
    padding: 24,
    gap: sizes.gap,
  },
  title: {
    fontFamily: fonts.black,
    fontSize: 32,
    color: colors.accent,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
