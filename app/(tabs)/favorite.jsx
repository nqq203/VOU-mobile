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
import { SearchInput } from "../../components";
import CardEvent from "../../components/CardEvent";
import NotiButton from "../../components/NotiButton";
import { callApiGetFavoriteVouchers, callAPIGetEvents } from "../../api/events";
import { useQuery } from "react-query";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

const Favorite = () => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isFocusRefetching, setIsFocusRefetching] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Track initial loading state

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

  const { data: posts, isLoading, refetch } = useQuery(
    ["favorite", user?.idUser],
    async () => {
      if (!user?.idUser) return [];
      try {
        const [eventsRes, favoritesRes] = await Promise.all([
          callAPIGetEvents(), // Fetch all events
          callApiGetFavoriteVouchers(user.idUser), // Fetch user favorites
        ]);

        if (eventsRes.success && favoritesRes.success) {
          const events = eventsRes.metadata || [];
          const favorites = favoritesRes.metadata || [];
          const favoriteEvents = events.filter((event) =>
            favorites.some((fav) => fav.idEvent === event.idEvent)
          );
          return favoriteEvents;
        }

        return [];
      } catch (error) {
        console.log("Error fetching favorite events:", error);
        return [];
      }
    },
    {
      enabled: !!user?.idUser,
      onSuccess: () => setIsInitialLoading(false), // Stop initial loading when success
      onError: () => setIsInitialLoading(false), // Stop initial loading when error occurs
    }
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useFocusEffect(
    useCallback(() => {
      fetchUser(); // Fetch the user when the screen is focused
      if (user?.idUser) {
        setIsFocusRefetching(true);
        refetch().finally(() => setIsFocusRefetching(false));
      }
    }, [fetchUser, refetch, user?.idUser])
  );

  const isDataLoading = isLoading || isFocusRefetching || isInitialLoading;

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
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-xl text-black font-bold leading-8">
                SỰ KIỆN YÊU THÍCH
              </Text>
            </View>
            <NotiButton />
          </View>
          <View className="w-full my-3">
            <SearchInput />
          </View>
          <View className="flex-col w-full space-y-4">
            {isDataLoading ? (
              <View className="flex-col items-center self-center">
                <ActivityIndicator size="large" color="#EA661C" />
                <Text className="self-center" style={{ marginTop: 20 }}>
                  Loading...
                </Text>
              </View>
            ) : posts?.length > 0 ? (
              posts.map((item, index) => (
                <CardEvent key={index} item={item} isFav={true} />
              ))
            ) : (
              <Text>No favorite events found.</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Favorite;
