import { ScrollView, Text, View, Dimensions, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useSocket } from "../../../../hooks/useSocket";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderAuth } from "../../../../components";
import { images } from "../../../../constants";
import { AnimatedImage } from '../../../../components';

const WaitingRoom = () => {
  const { room, username, remainingTime, eventId } = useLocalSearchParams();
  const { isConnected, gameStarted, sendData, allUsers } = useSocket(room, username);
  const [countdown, setCountdown] = useState(Number(remainingTime));
  const [showWaitingScreen, setShowWaitingScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (countdown <= 0 && !gameStarted) {
      setShowWaitingScreen(true);
      return; // Exit early to avoid starting the interval
    }

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer);
          if (!gameStarted) {
            setShowWaitingScreen(true);
          }
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, gameStarted]);

  useEffect(() => {
    if (gameStarted) {
      console.log("Action question");
      router.push({
        pathname: "/games/quizz",
        params: { room, username, eventId },
      });
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

  if (!isConnected) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#EA661C" />
        <Text style={{ marginTop: 20 }}>Connect to the game...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View
          style={{
            backgroundColor: '#f0f0f0', // Use your theme color here
            width: '100%',
            flex: 1,
            position: 'relative',
            padding: 20,
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <HeaderAuth />
          <AnimatedImage source={images.robot} containerStyle={{ position: 'absolute', top: 144, left: 52 }} />
          <View style={{ alignSelf: 'center', position: 'absolute', top: 377 }}>
            <Text style={{ color: '#EA661C', fontSize: 48, fontWeight: 'bold', textAlign: 'center', paddingBottom: 17 }}>
              {formatTime(countdown)}
            </Text>
            <Text style={{ color: '#000', fontSize: 20, fontWeight: '500', textAlign: 'center', paddingBottom: 72 }}>
              Có {allUsers} người đang cùng theo dõi
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WaitingRoom;
