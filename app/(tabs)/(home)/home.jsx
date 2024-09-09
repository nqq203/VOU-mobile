import React, { useState, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  Dimensions,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { SearchInput } from "../../../components";
import CardEvent from "../../../components/CardEvent";
import NotiButton from "../../../components/NotiButton";
import { useQuery } from "react-query";
import { callAPIGetEvents, callApiGetFavoriteVouchers } from "../../../api/events";
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusRefetching, setIsFocusRefetching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Add this to track the initial loading state
  

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

  // UseQuery with logging to see the state of loading
  const { data: posts, isLoading, refetch } = useQuery(
    ["home", user?.idUser],
    async () => {
      if (!user?.idUser) return [];
      try {
        const [eventsRes, favoritesRes] = await Promise.all([
          callAPIGetEvents(),
          callApiGetFavoriteVouchers(user.idUser),
        ]);
        if (eventsRes.success && favoritesRes.success) {
          const events = eventsRes.metadata || [];
          const favorites = favoritesRes.metadata || [];
          const mergedEvents = events.map((event) => ({
            ...event,
            isFav: favorites.some((fav) => fav.idEvent === event.idEvent),
          }));
          return mergedEvents;
        }
        return [];
      } catch (error) {
        console.log("Error during API calls:", error);
        return [];
      }
    },
    {
      enabled: !!user?.idUser, // Ensure the query only runs if user.idUser is available
      onSuccess: () => setIsInitialLoading(false), // Stop the initial loading state when success
      onError: () => setIsInitialLoading(false), // Stop the initial loading state when error occurs
    }
  );

  // Refresh function
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      fetchUser();
      if (user?.idUser) {
        setIsFocusRefetching(true);
        refetch().finally(() => setIsFocusRefetching(false));
      }
    }, [fetchUser, refetch, user?.idUser])
  );

  const isDataLoading = isLoading || isFocusRefetching || isInitialLoading; // Track both isLoading and initial loading

  return (
    <SafeAreaView className="bg-bg w-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          className="bg-bg w-full flex-col space-y-2 px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <View className="flex-row justify-between">
            <View className="">
              <Text className={`text-xl text-primary font-bold leading-8`}>
                Chào, {user?.fullName}
              </Text>
              <Text className="text-md border-spacing-1 font-normal text-black">
                Cùng tham gia sự kiện nào
              </Text>
            </View>
            <NotiButton />
          </View>
          <View className={`w-full mt-4`}>
            <SearchInput />
          </View>
          <View className="flex-col w-full space-y-4">
            <Text className="text-xl font-bold">Sự kiện mới nhất</Text>
            {isDataLoading ? (
              <View className="flex-col items-center self-center">
                <ActivityIndicator size="large" color="#EA661C" />
                <Text className="self-center" style={{ marginTop: 20 }}>
                  Loading...
                </Text>
              </View>
            ) : posts?.length > 0 ? (
              posts.map((item, index) => (
                <CardEvent key={index} item={item} isFav={item.isFav} />
              ))
            ) : (
              <Text className="text-base font-pregular">Chưa có sự kiện mới</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
