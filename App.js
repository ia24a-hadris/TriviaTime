import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';

import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { sendeWarteschlange } from './src/services/onlineBestenliste';

// Startpunkt der App: Schrift laden, dann die Navigation anzeigen.
export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  // Beim App-Start: Punkte nachsenden, die offline entstanden sind (Konzept Kap. 5). Fehler sind hier egal.
  useEffect(() => {
    sendeWarteschlange().catch(() => {});
  }, []);

  // Erst rendern, wenn die Schrift geladen ist (sonst kurz falsche Schrift oder Fehler).
  if (!fontsLoaded) {
    return null;
  }

  // Genau ein NavigationContainer pro App – er ist die äusserste Hülle.
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
