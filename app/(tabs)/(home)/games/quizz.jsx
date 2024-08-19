import React, { useState, useEffect } from "react";
import { Pressable, Text, SafeAreaView, View, Dimensions, StyleSheet,ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HeaderAuth } from "../../../../components";
import { useSocket } from "../../../../hooks/useSocket";
import { useLocalSearchParams } from "expo-router";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {AnimatedImage} from '../../../../components';
import { images } from "../../../../constants";

const questions = [
  {
    question: 'In what contintent is Indonesia?',
    options: [
      { id: '0', options: 'A', answer: 'South America' },
      { id: '1', options: 'B', answer: 'Europe' },
      { id: '2', options: 'C', answer: 'Asia' },
    ],
    correctAnswerIndex: 2,
  },
  {
    question: 'Which continent has the highest population density? ',
    options: [
      { id: '0', options: 'A', answer: 'Asia' },
      { id: '1', options: 'B', answer: 'South Africa' },
      { id: '2', options: 'C', answer: 'Australia' },
      { id: '3', options: 'D', answer: 'Antarctica' },
    ],
    correctAnswerIndex: 0,
  },
  {
    question: 'what is 5X5',
    options: [
      { id: '0', options: 'A', answer: '20' },
      { id: '1', options: 'B', answer: '25' },
      { id: '2', options: 'C', answer: '10' },
      { id: '3', options: 'D', answer: '30' },
    ],
    correctAnswerIndex: 1,
  },
  {
    question: 'what is the square root of 169',
    options: [
      { id: '0', options: 'A', answer: '20' },
      { id: '1', options: 'B', answer: '23' },
      { id: '2', options: 'C', answer: '13' },
      { id: '3', options: 'D', answer: '23' },
    ],
    correctAnswerIndex: 2,
  },
  {
    question: 'What is the Smallest Ocean?',
    options: [
      { id: '0', options: 'A', answer: 'Atlantic Ocean' },
      { id: '1', options: 'B', answer: 'Pacific Ocean' },
      { id: '2', options: 'C', answer: 'Arctic Ocean' },
      { id: '3', options: 'D', answer: 'Indian Ocean' },
    ],
    correctAnswerIndex: 2,
  },
];


const QuizScreen = () => {
  const navigation = useNavigation();
  const { room, username } = useLocalSearchParams();
  const { sendData, question, result } = useSocket(room, username);

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [timeStartQuestion, setTimeStartQuestion] = useState(null);

  useEffect(() => {
    if (question) {
      console.log("Received question:", question);
      setTimeStartQuestion(new Date());
      
      setSelectedAnswerIndex(null);
    }

    if (result) {
      console.log("Received result:", result);
      navigation.navigate("leaderboard", { result });
    }
  }, [question, result, navigation]);

  const handleAnswerSelection = (index) => {
    if (selectedAnswerIndex === null) {
      setSelectedAnswerIndex(index);

      const correctAnswerIndex = currentQuestion.correctAnswerIndex;
      const isCorrect = index === correctAnswerIndex;
      const timer = timeStartQuestion ? 15000 - (new Date() - timeStartQuestion) : 0;
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

  const TimerComponent = () => (
    <View style={styles.timerContainer}>
      <CountdownCircleTimer
        isPlaying
        duration={15}
        colors={['#004777', '#F7B801', '#A30000', '#A30000']}
        colorsTime={[15, 10, 5, 0]}
        onComplete={() => handleAnswerSelection(-1)}
      >
        {({ remainingTime }) => (
          <Text style={styles.timerText}>
            {remainingTime}
          </Text>
        )}
      </CountdownCircleTimer>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderAuth text="Kỷ niệm sinh nhật 10 năm thành lập" />
      
      {/* {!currentQuestion ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Waiting for question...</Text>
        </View>
      ) : (
        <>
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{currentQuestion.question}</Text>
            <TimerComponent />
          </View>

          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => (
              <Pressable
                key={option.id}
                onPress={() => handleAnswerSelection(index)}
                style={[
                  styles.optionButton,
                  selectedAnswerIndex === index && styles.selectedOption,
                ]}
              >
                <Text style={styles.optionText}>{option.options}</Text>
                <Text style={styles.optionValue}>{option.answer}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )} */}

      <View className="bg-bg w-full flex-col space-y-4 px-4"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <AnimatedImage source={images.robot} />
        </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  timerText: {
    fontSize: 40,
    color: '#000',
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
  optionsContainer: {
    marginTop: 30,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#00FFFF",
    marginVertical: 10,
    borderRadius: 20,
    padding: 10,
  },
  selectedOption: {
    backgroundColor: "#00BFFF",
  },
  optionText: {
    borderColor: "#00FFFF",
    textAlign: "center",
    borderWidth: 0.5,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 10,
  },
  optionValue: {
    marginLeft: 10,
  },
});


export default QuizScreen;