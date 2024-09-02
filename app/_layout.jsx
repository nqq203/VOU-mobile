import { useEffect } from "react";
import { useFonts } from "expo-font";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import { SplashScreen, Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from 'react-query'
import GlobalProvider from "../context/GlobalProvider";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Inter-Black": require("../assets/fonts/Inter-Black.ttf"),
    "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
    "Inter-ExtraBold": require("../assets/fonts/Inter-ExtraBold.ttf"),
    "Inter-ExtraLight": require("../assets/fonts/Inter-ExtraLight.ttf"),
    "Inter-Light": require("../assets/fonts/Inter-Light.ttf"),
    "Inter-Medium": require("../assets/fonts/Inter-Medium.ttf"),
    "Inter-Regular": require("../assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("../assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Thin": require("../assets/fonts/Inter-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;

    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded) {
    return null;
  }

  if (!fontsLoaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GlobalProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="index" options={{ headerShown: false }} />
            {/* <Stack.Screen name="search/[query]" options={{ headerShown: false }} /> */}
          </Stack>
        </GlobalProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
};

export default RootLayout;
