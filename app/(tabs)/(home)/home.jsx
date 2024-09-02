import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  Alert,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FormField, SearchInput } from "../../../components";
import { router, usePathname } from "expo-router";
import CardEvent from "../../../components/CardEvent";
import NotiButton from "../../../components/NotiButton";
import { useQuery } from "react-query";
import { callApiGetEvents } from "../../../api/event";
import { useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 1",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 2",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: false,
    },
    {
      id: 3,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 3",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 4",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const pathname = usePathname();


  const {isFetching, refetch} = useQuery(
    "fetch-all-events",
    callApiGetEvents,
    {
      onSuccess: (result) => {
        if(result.success === true){
          console.log("Sus: ",result);
          setPosts(result.metadata);
        } else{
          console.log(result.message);
        }
      },
      onError: (error) => {
        console.log(error)
      }
    }
  )

  useFocusEffect(
    useCallback(() => {
      // Your refresh logic here
      console.log('Screen is focused and refreshed');
      refetch();

      return () => {
        // Optional cleanup if needed when screen loses focus
      };
    }, [])
  );

  return (
    <SafeAreaView className="bg-bg w-full">
      <ScrollView>
        <View
          className="bg-bg w-full flex-col space-y-2 px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <View className="flex-row justify-between">
            <View className="">
              <Text className={`text-xl text-primary font-bold leading-8`}>
                HI, NGUYEN
              </Text>
              <Text className="text-md border-spacing-1 font-normal text-black">
                Let's play the game!
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
