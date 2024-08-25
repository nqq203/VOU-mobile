import { ScrollView, Easing, Text, View, Dimensions, FlatList, ActivityIndicator, Animated } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderAuth } from "../../../../components";
import { images } from "../../../../constants";
import {AnimatedImage} from '../../../../components';
const WaitingRoom = () => {
  const { room, username } = useLocalSearchParams();
  const { isConnected, gameStarted, sendData, allUsers } = useSocket(room, username);
  const [countdown, setCountdown] = useState(60);
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const router = useRouter()

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown(countdown - 1), 1000);
    } else {
      if (!gameStarted) {
      setShowWaitingScreen(true);
    }
    }
    
    return () => clearInterval(timer);
  }, [countdown, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      console.log("Action question")
      router.push(
        {
          pathname: "/games/quizz",
          params: { room, username },
        }
      ); 
    }
  }, [gameStarted, router]);

  const formatTime = (seconds) => {
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  if (showWaitingScreen) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#EA661C" />
        <Text style={{ marginTop: 20 }}>Waiting for the game to start...</Text>
      </SafeAreaView>
    );
  }
  
  if (!isConnected){
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#EA661C" />
        <Text style={{ marginTop: 20 }}>Connect to the game...</Text>
      </SafeAreaView>
    );
  }

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
          <HeaderAuth />
          <AnimatedImage source={images.robot} containerStyle = 'absolute top-[144px] left-[52px]' />
          <View className="self-center items-center" style={{ position: "absolute", top: 377 }}>
            <Text className="text-primary text-[48px] font-pbold self-center items-center pb-[17px]">
              {formatTime(countdown)}
            </Text>
            <Text className="text-black text-[20px] font-pmedium self-center items-center pb-[72px]">
              Có {allUsers} người đang cùng theo dõi
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitingRoom;
