import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="quizz"  options={{ headerShown: false }}/>
      <Stack.Screen name="waiting-room"  options={{ headerShown: false }}/>
      <Stack.Screen name="leaderboard"  options={{ headerShown: false }}/>
      <Stack.Screen name="shakeGame"  options={{ headerShown: false }}/>
    </Stack>
  );
}
