import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { HeaderAuth } from '../../../../components';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSocket } from "../../../../hooks/useSocket";

// Leaderboard item component
const LeaderboardItem = ({ rank, name, points, avatar }) => (
  <View className='pl-6 flex-row items-center m-[10px] bg-white rounded-2xl px-2 py-2 font-medium text-10 space-x-2'>
    <Text className='font-medium text-xl pl-2 text-grey-300'>{rank}</Text>
    <Image source={{ uri: avatar }} className='w-14 h-14 rounded-full' />
    <View>
      <Text className='text-base font-bold'>{name}</Text>
      <Text className='text-md text-grey-400'>{points} points</Text>
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
            <Image source={{ uri: users[1].avatar }} className="w-[60px] h-[60px] rounded-full border-4 border-brown-700" />
            <Text className="text-base font-bold text-center">{users[1].name}</Text>
            <Text className="text-md text-primary font-bold">{users[1].points} QP</Text>
          </View>
          <View className="w-28 justify-center items-center h-20 bg-brown-700">
            <Text className="text-5xl font-bold text-center text-white">2</Text>
          </View>
        </View>
      )}
      <View className="flex-col space-y-2">
        <View className="items-center mx-[10px]">
          <View className="absolute -top-5 z-10">
            <Text className="text-4xl">👑</Text>
          </View>
          <Image source={{ uri: users[0].avatar }} className="w-20 h-20 rounded-full border-4 border-brown-500" />
          <Text className="text-base font-bold text-center">{users[0].name}</Text>
          <Text className="text-md text-primary font-bold">{users[0].points} QP</Text>
        </View>
        <View className="w-28 justify-center items-center bg-brown-500 h-28">
          <Text className="text-6xl font-bold text-center text-white">1</Text>
        </View>
      </View>
      {users.length > 2 && (
        <View className="flex-col space-y-2">
          <View className="items-center mx-[10px]">
            <Image source={{ uri: users[2].avatar }} className="w-[60px] h-[60px] rounded-full border-4 border-brown-900" />
            <Text className="text-base font-bold text-center">{users[2].name}</Text>
            <Text className="text-md text-primary font-bold">{users[2].points} QP</Text>
          </View>
          <View className="w-28 justify-center items-center bg-brown-900 h-16">
            <Text className="text-4xl font-bold text-center text-white">3</Text>
          </View>
        </View>
      )}
    </View>
  </View>
);

const Leaderboard = () => {
  const router = useRouter()
  const { result, username, room } = useLocalSearchParams();
  const [podiumUsers, setPodiumUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

  const { question } = useSocket(room, username);
  useEffect(() => {
    if (result) {
      // Parse and sort the result JSON data
      const users = JSON.parse(result).sort((a, b) => b.score - a.score);

      // Get the top users for the podium (maximum 3)
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
    }
  }, [result]);

  useEffect(() => {
    if (question) {
      router.push(
        {
          pathname: "/games/quizz",
          params: {room, username },
        }
      ); 
    }
  }, [question]);
  return (
    <SafeAreaView>
      <ScrollView>
        <View
          className="bg-bg w-full flex-col relative"
          style={{
            minHeight: Dimensions.get("window").height - 50,
            padding: 20,
          }}
        >
          <HeaderAuth text="Leaderboard" otherStyle='mb-6' />
          {podiumUsers.length > 0 && <Podium users={podiumUsers} />}
          {otherUsers.length > 0 && (
            <View className='bg-brown-100 rounded-xl'>
              {otherUsers.map((user) => (
                <LeaderboardItem key={user.rank} {...user} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Leaderboard;