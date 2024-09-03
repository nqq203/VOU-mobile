import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const AuthLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="sign-in"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="verify-otp"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="forgot-password"
          options={{
            headerShown: false,
          }}
        />
         <Stack.Screen
          name="reset-password"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

  );
};

export default AuthLayout;
