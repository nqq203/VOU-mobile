import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  FlatList,
  Image,
  RefreshControl,
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
import { useNavigation } from '@react-navigation/native';
import { router, usePathname } from "expo-router";
const Home = () => {
  const navigation = useNavigation();
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
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleFavoritePress = async (id) => {
    // Cập nhật trạng thái local trước khi gửi API
    setPosts((prevPosts) => 
      prevPosts.map((post) => 
        post.id === id ? { ...post, isFavorite: !post.isFavorite } : post
      )
    );

    try {
    //   const postToUpdate = posts.find((post) => post.id === id);
    //   const response = await fetch('YOUR_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ id, favorite: !postToUpdate.isFavorite }),
    //   });
    //   const data = await response.json();
    //   console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
      // Nếu có lỗi, revert lại trạng thái ban đầu
      setPosts((prevPosts) => 
        prevPosts.map((post) => 
          post.id === id ? { ...post, isFavorite: !post.isFavorite } : post
        )
      );
    }
  };

  return (
    <SafeAreaView className="bg-bg w-full">
      <ScrollView>
        <View
          className="bg-bg w-full flex-col space-y-4 px-4"
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

            <TouchableOpacity className="flex-row items-center justify-center bg-white p-3 rounded-2xl w-12 h-12 self-center">
              <Icon name="bell-outline" size={25} color="#3D3D3D" />
            </TouchableOpacity>
          </View>
          <View className={`w-full mt-4 mx-`}>
            <SearchInput />
          </View>
          <View className="flex-col w-full space-y-4">
            <Text className="text-lg font-bold">Sự kiện mới nhất</Text>
            {posts.length > 0 && posts.map((item) => (
              <TouchableOpacity key={item.id} onPress={() => {
                if (item?.id === "")
                return Alert.alert(
                  "Missing Query",
                  "Please input something to search results across database"
                );
            
    
              if (pathname.startsWith("/details")) router.setParams({key  });
              else router.push(`/details/${item?.id}`);}}>
                <View className="bg-white rounded-lg pb-4">
                  <Image
                    source={{ uri: item.image }}
                    className="w-full h-36 rounded-t-lg"
                    resizeMode="cover"
                  />
                  <View className="flex-row mx-3 mt-2 ml-2 justify-between">
                    <Image
                      source={{ uri: item.avt }}
                      className="w-10 h-10 rounded-lg mt-2"
                      resizeMode="cover"
                    />
                    <View className="flex-col mx-3 w-8/12">
                      <Text className="text-base font-bold">{item.title}</Text>
                      <Text className="text-md text-gray-500">Thời gian: {item.startDate} - {item.endDate}</Text>
                    </View>
                    <TouchableOpacity
                      className="flex-row items-center justify-center bg-white"
                      onPress={() => handleFavoritePress(item.id)}
                    >
                      <Ionicons name={item.isFavorite ? "heart" : "heart-outline"} size={32} color="#EA661C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
