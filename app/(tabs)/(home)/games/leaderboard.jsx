import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, 
  SafeAreaView, Dimensions, Modal, ImageBackground, TouchableOpacity } from 'react-native';
import { HeaderAuth, CustomButton, Voucher } from '../../../../components';
import { useLocalSearchParams, useRouter } from "expo-router";
import moment from "moment";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { images } from "../../../../constants";
import * as SecureStore from 'expo-secure-store';
const { callApiGetVouchers, callApiUseVoucher } = require('../../../../api/voucher');


// Leaderboard item component
const LeaderboardItem = ({ rank, name, points, avatar }) => (
  <View className='pl-6 flex-row items-center m-[8px] bg-white rounded-2xl px-2 py-2 font-medium text-10 space-x-2'>
    <Text className='font-bold text-xl pl-2 text-black'>{rank}</Text>
    <Image source={images.mouse_Ava} className='w-14 h-14 rounded-full' />
    <View>
      <Text className='text-base font-semibold'>{name}</Text>
      <Text className='text-md text-grey-500'>{points} điểm</Text>
    </View>
  </View>
);

// Podium component for top 3 users
const Podium = ({ users }) => (
  <View className="items-center mb-5">
    <View className="flex-row justify-center items-end">
      {users.length > 1 && (
        <View className="flex-col space-y-2">
          <View className="items-center mx-[10px]">
            <Image source={images.snakeAva} className="w-[60px] h-[60px] rounded-full border-4 border-brown-700" />
            <Text className="text-xl text-white font-bold text-center mt-2">{users[1].name}</Text>
            <Text className="text-2xl text-primary font-bold">{users[1].points} QP</Text>
          </View>
          <View className="w-28 justify-center items-center h-20 bg-active">
            <Text className="text-5xl font-bold text-center text-white">2</Text>
          </View>
        </View>
      )}
      <View className="flex-col space-y-2">
        <View className="items-center mx-[10px]">
          <View className="absolute -top-5 z-10">
            <Text className="text-4xl">👑</Text>
          </View>
          <Image source={ images.dragonAva} className="w-20 h-20 rounded-full border-4 border-brown-500" />
          <Text className="text-xl text-white font-bold text-center mt-2">{users[0].name}</Text>
          <Text className="text-2xl text-primary font-bold">{users[0].points} QP</Text>
        </View>
        <View className="w-28 justify-center items-center bg-red h-28">
          <Text className="text-6xl font-bold text-center text-white">1</Text>
        </View>
      </View>
      {users.length > 2 && (
        <View className="flex-col space-y-2">
          <View className="items-center mx-[10px]">
            <Image source={images.rabbitAva} className="w-[60px] h-[60px] rounded-full border-4 border-brown-900" />
            <Text className="text-xl text-white font-bold text-center mt-2">{users[2].name}</Text>
            <Text className="text-2xl text-primary font-bold">{users[2].points} QP</Text>
          </View>
          <View className="w-28 justify-center items-center bg-infoBlue h-16">
            <Text className="text-4xl font-bold text-center text-white">3</Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

const Leaderboard = () => {
  const router = useRouter()
  const { username, eventId } = useLocalSearchParams();
  const [isTop3, setIsTop3] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [podiumUsers, setPodiumUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [userRank, setUserRank] = useState({});
  const { result } = useLocalSearchParams();
  const [user, setUser] = useState();
  const [voucher, setVoucher] = useState({})

  useEffect(() => {
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
    fetchUser();
  }, []);

  useEffect(() => {
    const processResult = async () => {
      if (result) {
        const users = JSON.parse(result).sort((a, b) => b.score - a.score);
        // console.log("Users: ", users)
        const topUsers = users.slice(0, 3).map((user, index) => ({
          name: user.userId,
          points: user.score,
          avatar: user.avatar,
        }));
        setPodiumUsers(topUsers);


        const others = users.slice(3).map((user, index) => ({
          rank: index + 4,
          name: user.userId,
          points: user.score,
          avatar: user.avatar,
        }));
        setOtherUsers(others);
        
        const currentUser = users.find(item => item.userId === user?.username);
        if (currentUser) {
          setUserRank({
            rank: users.indexOf(currentUser) + 1,
            points: currentUser.score,
            avatar: currentUser.avatar || "https://via.placeholder.com/50",
            name: user?.userId || "Anonymous",
            userId: user?.userId
          });

          if (topUsers.find(item => user?.username === item?.name)) {
            setIsTop3(true);
            try {
              const voucherResult = await callApiGetVouchers(eventId);
              setVoucher(voucherResult);
              console.log(voucherResult);
              if (voucherResult) {
                await callApiUseVoucher(voucherResult.voucher_code, user?.idUser);
              }
            } catch (error) {
              console.log("Error fetching or using voucher:", error);
            }
            
          } else {
            setIsTop3(false);
          }
          setShowModal(true);
        }
      }
    };

    processResult();
  }, [eventId, result, user]);

  return (
    <ImageBackground source={images.quizBg} className='w-screen h-full' >
    <SafeAreaView>
      <ScrollView>
        <View
          className=" w-full flex-col relative"
          style={{
            minHeight: Dimensions.get("window").height - 50,
            padding: 20,
          }}
        >
          <View className = {`flex-row items-center justify-center w-full h-12 my-6 `}>
            <TouchableOpacity className = {`bg-white w-12 h-12 items-center justify-center absolute left-0 rounded-xl shadow-md border border-gray-100`} 
              onPress={() => {
                router.push(`/details/${eventId}`)
              }}>
              <Ionicons name="chevron-back" size={24} color={'gray'}  />
            </TouchableOpacity>

            <Text className = {`text-white text-lg font-semibold`}>Leaderboard</Text>
          </View>
          {podiumUsers.length > 0 && <Podium users={podiumUsers} />}
          {otherUsers.length > 0 && (
            <ScrollView className='bg-brown-100 rounded-xl h-[200px]'>
              {otherUsers.map((user) => (
                <LeaderboardItem key={user?.rank} {...user} />
              ))}
            </ScrollView>
          )}
        </View>
        <Modal 
          visible={showModal} 
          transparent={true}
          onRequestClose={() => {console.log("Close")}}
        >
          <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
            <View className='flex bg-white space-y-4 px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
            <TouchableOpacity className='flex-row-reverse w-full pr-2' 
                onPress={() => {
                    setShowModal(false)}}
            >
                <Ionicons name='close' size={28} color={'gray'} />
            </TouchableOpacity>
              {isTop3 ? (
                <View className='w-full my-2 items-center'>
                  <Text className="text-xl font-pbold text-center text-primary">CHÚC MỪNG</Text>
                  <Text className="text-xl font-pbold text-center text-primary">BẠN ĐÃ NHẬN ĐƯỢC</Text>
                  <Voucher 
                    isOnline={voucher?.voucher_type  === "online" ? true : false}
                    voucherName={ voucher?.voucher_name}
                    voucherImg={ voucher?.imageUrl}
                    voucherExpire={voucher.expiration_date}
                    containerStyle={'my-6'}
                  />

                </View>
              ) : (
                <View className='items-center my-2'>
                  <Text className='text-black font-pbold text-[28px] text-center'>SỐ ĐIỂM CỦA BẠN LÀ</Text>
                  <View className='mt-4'>
                    <Text className='text-primary font-pbold text-[28px] text-center'>{userRank.points}</Text>
                  </View>
                </View>
              )}
              <CustomButton title="Về trang chủ" containerStyles={'w-full mt-4'} handlePress={() => router.push('/home')}/>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
    </ImageBackground>
  );
};

export default Leaderboard;