import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { FormField, SearchInput, Loader } from "../../../components";
import { router, usePathname } from "expo-router";
import CardEvent from "../../../components/CardEvent";
import NotiButton from "../../../components/NotiButton";
import { useQuery } from "react-query";
import { callAPIGetEvents } from "../../../api/events";
import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const pathname = usePathname();
  
  const [user, setUser] = useState(null);
  const navigate = useNavigation();

  useFocusEffect(
    useCallback(() => {
      // Your refresh logic here
      console.log('Screen is focused and refreshed');
      setLoading(true);
      fetchPosts();

        
      return () => {
        // Optional cleanup if needed when screen loses focus
      };
    }, [])
  );

  const fetchUser = async () => {
    try {
      let user = await SecureStore.getItemAsync("user");
      if (user) {
        user = JSON.parse(user);
        setUser(user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await callAPIGetEvents();
      if (res.success){
        // console.log(res);
        setPosts(res.metadata);
      }
      if (res.code === 401) {
        await SecureStore.deleteItemAsync("user");  
        await SecureStore.deleteItemAsync("token");  
        navigate("/login");
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, [navigate]);


  return (
    <SafeAreaView className="bg-bg w-full">
      <ScrollView>
        <View
          className="bg-bg w-full flex-col space-y-2 px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
        {loading ? (
          <Loader isLoading={loading} />
        ) : (
          <>
          <View className="flex-row justify-between">
            <View className="">
              <Text className={`text-lg text-primary font-pbold leading-8`}>
                HI, {user?.fullName}
              </Text>
              <Text className="text-md border-spacing-1 font-pregular text-black">
                Cùng tham gia sự kiện ngay thôi!
              </Text>
            </View>

            <NotiButton />
          </View>
          <View className={`w-full mt-4`}>
            <SearchInput />
          </View>
          <View className="flex-col w-full space-y-4">
            <Text className="text-xl font-bold">Sự kiện mới nhất</Text>
            {posts.length > 0 && posts.map((item,index) => (
              <CardEvent key={index} item={item}/>
            ))}
          </View>
          </>
        )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
