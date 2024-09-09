import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Text, View } from "react-native";
import { useSocket } from "../../hooks/useSocket";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import React, { useEffect,useState,useCallback } from "react";

import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: 'pink' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '400'
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
    />
  ),
  tomatoToast: ({ text1, props }) => (
    <View className={`flex flex-row align-middle justify-center my-1 p-2
      bg-gray-100 rounded-lg border border-gray-100   'bg-white'}`}

    style={[{minWidth: "200px"}]}
    >
    
    <View className=" h-[80px] rounded-full bg-active mx-2 mt-1 overflow-hidden">
        <Image source={{uri: props?.imageUrl || 'https://placehold.co/80x80'}}
        className="w-full h-full " />
    </View>

    <View className="flex flex-col justify-center"
    >
        <Text className="text-lg font-psemibold">{text1}</Text>
        <Text className="text-base font-pregular text-gray-500">{props?.date !== undefined ? ( props?.date === 0 ? 'Hôm nay' : `${props?.date} ngày nữa`) :''}
        </Text>
    </View>
    </View>
  )};

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
  const [user, setUser] = useState(null);
  const [event, setEvents] = useState([]);
  const [turn, setTurn] = useState({});
  const fetchUser = useCallback(async () => {
    try {
      const userString = await SecureStore.getItemAsync("user");
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchUser();
      
      
    }, [fetchUser])
  );
  console.log("User: ", user?.username);
  const { event: socketEvents, turn: socketTurn  } = useSocket("", user?.username);

  useEffect(() => {
    if (user?.username && socketEvents) {
      console.log("Events: ", socketEvents);
      // const e = JSON.parse(socketEvents);
      console.log({ text1: socketEvents?.message,imageUrl: socketEvents?.imageUrl, date: socketEvents?.date });
      Toast.show({
        type: 'tomatoToast',
        text1: socketEvents?.message,
        props: { imageUrl: socketEvents?.imageUrl, date: socketEvents?.date },
      });
      setEvents(socketEvents); 
    }
    
  }, [user, socketEvents]);
  
  useEffect(() => { 
    if (user?.username && socketTurn) {
      console.log("Turn: ", socketTurn);
      Toast.show({
        type: 'tomatoToast',
        text1: socketTurn,
      });
      setTurn(socketTurn);
    }

      setEvents(socketTurn); 
  }, [user, socketTurn]);

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
            borderBottomEndRadius: 0,
            borderBottomStartRadius: 0,
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
      <Toast config={toastConfig} />
    </>
  );
};

export default TabLayout;