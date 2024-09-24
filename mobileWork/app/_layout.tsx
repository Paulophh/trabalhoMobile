
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import 'react-native-reanimated';
import { initDatabase } from './database/initDatabase';


export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),});

  return (
    <SQLiteProvider databaseName='tamagotchi.db' onInit={initDatabase}>
      <Stack>
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="tamagotchiRegister" options={{ headerShown: false }} />
        <Stack.Screen name="listTamagotchi" options={{ headerShown: false }} />
        <Stack.Screen name="gameScreen" options={{ headerShown: false }} />
        
      </Stack>
    </SQLiteProvider>
  );
}
