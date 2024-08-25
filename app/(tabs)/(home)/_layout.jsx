import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="home"  options={{ headerShown: false }}/>
      <Stack.Screen name="details/[id]"  options={{ headerShown: false }}/>
      <Stack.Screen name="games"  options={{ headerShown: false }}/>
    </Stack>
  );
}
