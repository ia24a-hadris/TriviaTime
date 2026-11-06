import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SpielenStack from './SpielenStack';
import BestenlisteScreen from '../screens/BestenlisteScreen';
import { colors, fonts } from '../theme';

const Tab = createBottomTabNavigator();

// Nur zwei Tabs, damit die Navigation einfach bleibt (Konzept Kap. 9)
const ICONS = {
  Spielen: ['play-circle', 'play-circle-outline'],
  Bestenliste: ['trophy', 'trophy-outline'],
};

// In diesen Screens ist die Tab-Bar ausgeblendet: sonst würde man im Quiz aus Versehen den Screen wechseln
const OHNE_TABBAR = ['Frage', 'QuizAbbrechen'];

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const [voll, outline] = ICONS[route.name];
          return <Ionicons name={focused ? voll : outline} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: { backgroundColor: colors.card },
        tabBarLabelStyle: { fontSize: 12, fontFamily: fonts.extrabold },
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontFamily: fonts.black },
      })}
    >
      <Tab.Screen
        name="Spielen"
        component={SpielenStack}
        options={({ route }) => {
          // Welcher Screen ist im Spielen-Stack gerade offen?
          const aktuell = getFocusedRouteNameFromRoute(route) ?? 'Home';
          return {
            headerShown: false, // der Stack hat einen eigenen Header
            tabBarStyle: OHNE_TABBAR.includes(aktuell) ? { display: 'none' } : { backgroundColor: colors.card },
          };
        }}
      />
      <Tab.Screen name="Bestenliste" component={BestenlisteScreen} />
    </Tab.Navigator>
  );
}
