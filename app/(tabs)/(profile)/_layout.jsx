import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="profile"  options={{ headerShown: false }}/>
      <Stack.Screen name="editProfile"  options={{ headerShown: false }}/>
      <Stack.Screen name="onlineVouchers"  options={{ headerShown: false }}/>
      <Stack.Screen name="offlineVouchers"  options={{ headerShown: false }}/>
      <Stack.Screen name="history"  options={{ headerShown: false }}/>
      <Stack.Screen name="changePassword"  options={{ headerShown: false }}/>

    </Stack>
  );
}
