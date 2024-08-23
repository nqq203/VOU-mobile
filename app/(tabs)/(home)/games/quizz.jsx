import React, { useState, useEffect } from "react";
import { Pressable, Text, SafeAreaView, View, Dimensions, StyleSheet,ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HeaderAuth } from "../../../../components";
import { useSocket } from "../../../../hooks/useSocket";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import {AnimatedImage,QuizComponent} from '../../../../components';
import { images } from "../../../../constants";

const QuizScreen = () => {
  const router = useRouter()
  const { room, username } = useLocalSearchParams();
  const { sendData, question, result } = useSocket(room, username);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [timeStartQuestion, setTimeStartQuestion] = useState(null);
  const [timer, setTimer] = useState(15);

  useEffect(() => {
    if (question) {
      console.log("Received question:", question);
      setTimer(15)
      setTimeStartQuestion(new Date());
      setCurrentQuestion(question); 
      setSelectedAnswerIndex(null);
    }

    if (result) {
      console.log("Received result:", result);
      router.push(
        {
          pathname: "/games/leaderboard",
          params: { result,room, username },
        }
      ); 
    }
  }, [question, result]);

  const handleAnswerSelection = (index) => {
    if (index === -1) return;

    if (selectedAnswerIndex === null) {
      setSelectedAnswerIndex(index);

      const correctAnswerIndex = currentQuestion.correctAnswerIndex;
      const isCorrect = index === correctAnswerIndex;
      const timer = timeStartQuestion ? Math.round((15000 - (new Date() - timeStartQuestion)) / 100) : 0;
      const data = {
        isCorrect,
        timer
      };
      
      sendData({
        room,
        username,
        content: JSON.stringify(data),
        messageType: "ANSWER_QUIZ",
      });
    }
  };
  const optionsArray = currentQuestion
  ? Object.entries(currentQuestion.options).map(([key, value]) => ({ key, value }))
  : [];

  return (
    !currentQuestion ? (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Waiting for question...</Text>
      </View>
    ) : (
      <SafeAreaView style={styles.container}>
        <HeaderAuth text="Kỷ niệm sinh nhật 10 năm thành lập" />
        <View
          className="bg-bg w-full flex-col space-y-4 px-4"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <View className="flex mt-10 mx-2">
            <AnimatedImage source={images.robot} />
            <View className="relative bg-white p-4 bottom-8 rounded-xl">
              <Text className="text-xl font-bold">
                {currentQuestion.question}
              </Text>
              <View className="self-end">
                <CountdownCircleTimer
                  className="self-end"
                  size={45}
                  strokeWidth={6}
                  isPlaying
                  duration={timer}
                  colors={['#81380F', '#D55D19', '#EE8549', '#F5B997']}
                  colorsTime={[15, 10, 5, 0]}
                >
                  {({ remainingTime }) => <Text>{remainingTime}</Text>}
                </CountdownCircleTimer>
              </View>
            </View>
            <View className="">
              {optionsArray.map((option) => (
                <Pressable
                  key={option.key}
                  className='flex-row space-x-2 bg-white'
                  onPress={() => handleAnswerSelection(option.key)}
                  style={[
                    styles.optionButton,
                    selectedAnswerIndex === option.key && styles.selectedOption,
                  ]}
                >
                  <Text style={[styles.optionText, selectedAnswerIndex === option.key && styles.selectedOptionText]}>
                    {option.key}
                  </Text>
                  <Text className="font-medium text-base">{option.value}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#000',
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  questionContainer: {
    backgroundColor: '#F0F8FF',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#FFFF",
    marginVertical: 10,
    borderRadius: 20,
    padding: 10,
  },
  selectedOption: {
    backgroundColor: "#F8D0B9",
  },
  optionText: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#DEDEDE',
    textAlign: "center",
    borderWidth: 0.5,
    width: 40,
    height: 40,
    fontWeight: 600
  },
  optionValue: {
    marginLeft: 10,
  },
  selectedOptionText:{
    backgroundColor: '#ffff'
  }
});


export default QuizScreen;