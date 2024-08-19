import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Image,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { CustomButton, HeaderAuth } from "../../../../components";
import { icons } from "../../../../constants";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";

const Details = () => {
  const {id} = useLocalSearchParams();
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  // const user = await AsyncStorage.getItem('user');
  const post = {
    id: 1,
    title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 1",
    brand: 'Brand',
    image: "https://via.placeholder.com/150",
    avt: "https://via.placeholder.com/150",
    startDate: "2021/10/10",
    endDate: "2021/10/10",
    isFavorite: false,
    turns:1
  };


  return (
    <SafeAreaView>
        <ScrollView>
          <View
            className="bg-bg w-full flex-col relative"
            style={{
              minHeight: Dimensions.get("window").height - 50,
            }}
          >
            <HeaderAuth text="" otherStyle="absolute h-20 left-4 z-10" otherStyleIcon="rounded-full" />
            
            <Image source={{ uri: post.image }} className="w-full h-52 rounded-lg px-0" />
       
            <View className="flex flex-col px-4 ">
              <View className = 'flex-col space-y-1 my-2 mb-2'>
                <Text className = 'text-black text-xl font-semibold'>{post.title}</Text>
                  <View className = 'flex-row items-center pl-2'>
                    <Ionicons name = 'calendar-clear-outline' size ={16} color = '#515151'/>
                    <Text className = 'text-grey-700 font-pregular text-xs'>  Thời gian: {post.startDate} - {post.endDate}</Text>
                  </View>
                  <View className = 'flex-row items-center justify-between  pl-2'>
                    <View className = 'flex-row items-center'>
                      <Ionicons name = 'play-circle-sharp' size ={16 } color = '#515151'/>
                      <Text className = 'text-grey-700 font-pregular text-xs'>  Lượt chơi: {post.turns}</Text>
                    </View>
                    <Text className = 'text-primary font-bold text-xs underline '>Thêm lượt</Text>
                  </View>
              </View>

              <View className = 'border-grey-200' style={{borderWidth:0.3, borderStyle:'dashed', borderRadius:1}}></View>
              <View className='flex-row space-y-1 my-2 justify-between'>
                <View className='flex-row items-center space-x-2'>
                  <Image source={{ uri: post.avt }} className="w-10 h-10 rounded-lg" />
                  <Text className='text-black font-pmedium text-base'>{post.brand}</Text>
                </View>
                <CustomButton 
                  title="Chơi ngay" 
                  containerStyles="h-10 w-28 p-2 justify-center" 
                  textStyles='text-sm' 
                  handlePress={() => router.push({
                      pathname: "/games/waiting-room",
                      params: { room: post.id, username: "ahihi" },
                    })}
                />
              </View>

              <View 
                className='border-grey-200' 
                style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1 }}
              ></View>

              <View className='flex-col space-y-1 my-2'>
                <Text className='font-semibold text-base leading-6 text-grey-800 tracking-wide'>
                  Trò chơi Quizz
                </Text>
                <Text className='text-grey-700 font-regular text-xs leading-5 tracking-wide'>
                  {expanded 
                    ? 'Lorem ipsum dolor sit amet consectetur. Massa nulla ipsum adipiscing orci donec et augue. Praesent dictum vivamus mauris tempus egestas nisi. Pretium integer non ut ornare mi vel sociis. Nec arcu quis risus quis arcu dapibus. Lacus diam quisque aliquam. Praesent dictum.'
                    : 'Lorem ipsum dolor sit amet consectetur. Massa nulla ipsum adipiscing orci donec et augue. Praesent dictum vivamus mauris tempus egestas nisi. Pretium integer non ut ornare mi vel sociis...'}
                </Text>
                <TouchableOpacity onPress={handleToggle}>
                  <Text className='text-grey-700 font-regular text-xs leading-6 underline tracking-wide'>
                    {expanded ? 'Thu gọn' : 'Xem thêm'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className='flex-col space-y-1 my-2'>
                <Text className='text-black font-semibold text-base leading-6 tracking-wide'>
                  Phần thưởng
                </Text>
                <View className ='flex-row space-x-2 items-center'>
                  <Image source={icons.voucher} resizeMode="contain" className ='h-8 w-8' />
                  <Text className ='text-black font-pmedium text-xs leading-4 tracking-wide '>Voucher trị giá 200.000 đồng</Text>
                </View> 
                <Text className ='text-black font-regular text-xs leading-4 tracking-wide '>Chỗ này thông tin voucher: mô tả, ngày hết hạn, trạng thái. </Text>
                <Text className='text-black font-regular text-xs leading-4 tracking-wide'>
                  Bạn cần đạt được <Text className='font-bold'>100 Xu hoặc các mảnh ghép sau</Text> để đủ điều kiện đổi thưởng.
                </Text>
                <CustomButton 
                  title="Đổi thưởng" 
                  containerStyles="h-10 w-28 justify-center rounded-lg" 
                  textStyles='text-sm leading-4 tracking-wide' 
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}


export default Details;
