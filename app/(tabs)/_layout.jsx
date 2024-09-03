import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";

import { icons } from "../../constants";
import { Loader } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        style={{ width: 24 }}
      />
      {/* <Ionicons name={icon} size={20} resizeMode="contain" col  className="w-6 h-6" /> */}
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#EA661C",
          tabBarInactiveTintColor: "#CECECE",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#FBFBFB",
            height: 78,
            justifyContent: "center",
            borderRadius: 20,
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",

          },
        }}
      >
        <Tabs.Screen
          name="(home)" 
          options={{
            title: "Home",
            headerShown: false,

            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="favorite"
          options={{
            title: "Favorite",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.fav}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="gift"
          options={{
            title: "Gift",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.gift}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(profile)"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default TabLayout;