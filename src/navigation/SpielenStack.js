import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import NicknameModal from '../screens/NicknameModal';
import QuizSetupScreen from '../screens/QuizSetupScreen';
import FrageScreen from '../screens/FrageScreen';
import QuizAbbrechenModal from '../screens/QuizAbbrechenModal';
import ResultatScreen from '../screens/ResultatScreen';
import { colors, fonts } from '../theme';

const Stack = createNativeStackNavigator();

// Stack im Tab «Spielen» (Workflow, Konzept Kap. 7.1):
// Home → Quiz-Setup → Frage → Resultat, dazu zwei Modals
export default function SpielenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.black },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Trivia Time' }} />
      <Stack.Screen name="QuizSetup" component={QuizSetupScreen} options={{ title: 'Quiz einrichten' }} />
      <Stack.Screen
        name="Frage"
        component={FrageScreen}
        options={{
          // Kein Zurück-Pfeil, keine Wisch-Geste: verlassen nur über ✕ mit Rückfrage
          headerBackVisible: false,
          gestureEnabled: false,
          headerStyle: { backgroundColor: colors.gameBackground },
          headerTintColor: '#FFFFFF',
        }}
      />
      <Stack.Screen
        name="Resultat"
        component={ResultatScreen}
        // Wird mit replace geöffnet – darum gibt es kein Zurück ins beendete Quiz
        options={{ headerBackVisible: false, gestureEnabled: false }}
      />

      {/* Modals: gleiche Navigation, nur andere Darstellung */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="NicknameModal" component={NicknameModal} options={{ title: 'Nickname ändern' }} />
        <Stack.Screen name="QuizAbbrechen" component={QuizAbbrechenModal} options={{ title: 'Quiz abbrechen?' }} />
      </Stack.Group>
    </Stack.Navigator>
  );
}
