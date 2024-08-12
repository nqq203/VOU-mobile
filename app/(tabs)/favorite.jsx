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
import { SearchInput } from "../../components";
import { useNavigation } from '@react-navigation/native';
import { router, usePathname } from "expo-router";
import CardEvent from "../../components/CardEvent";
import NotiButton from "../../components/NotiButton";

const Favorite = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 1",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: true,
    },
    {
      id: 2,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 2",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: true,
    },
    {
      id: 3,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 3",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: true,
    },
    {
      id: 4,
      title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 4",
      image: "https://via.placeholder.com/150",
      avt: "https://via.placeholder.com/150",
      startDate: "2021/10/10",
      endDate: "2021/10/10",
      isFavorite: true,
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

  return (
    <SafeAreaView className="bg-bg w-full">
      <ScrollView>
        <View
          className="bg-bg w-full flex-col space-y-2 px-4 my-3"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
            <View className="flex-row justify-between items-center">
                <View className="">
                    <Text className={`text-xl text-black font-bold leading-8`}>
                        SỰ KIỆN YÊU THÍCH
                    </Text>
                </View>

                <NotiButton />
            </View>

          <View className={`w-full my-3`}>
            <SearchInput />
          </View>
          <View className="flex-col w-full space-y-4">
            {posts.length > 0 && posts.map((item,index) => (
              <CardEvent key={index} item={item} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Favorite;
