
import React, { useState, useEffect,useRef ,useCallback} from "react";
import { Pressable, Text, SafeAreaView, View, Dimensions, StyleSheet,Image ,ActivityIndicator} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CustomButton, HeaderAuth } from "../../../../components";
import { useSocket } from "../../../../hooks/useSocket";
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import {AnimatedImage} from '../../../../components';
import { images } from "../../../../constants";
import { Modalize } from 'react-native-modalize';

const QuizScreen = () => {
  const router = useRouter()
  const { room, username } = useLocalSearchParams();
  const modalizeRef = React.useRef(null); 
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [timeStartQuestion, setTimeStartQuestion] = useState(null);
  const [timer, setTimer] = useState(15);
  const [isLoading, setIsLoading] = useState(false);
  const [showModalize, setShowModalize] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState(null); 
  const { sendData, question, result, score } = useSocket(room, username);
  const [checkAnswer, setCheckAnswer] = useState(false);

  const openSheet = useCallback(() => {
    modalizeRef.current?.open(); 
    setTimeout(() => {
      modalizeRef.current?.close(); 
      setShowModalize(false)
      setTimeStartQuestion(new Date());
    }, 5000);
  }, []);


  useEffect(() => {
    console.log("Hello")

    if (question) {
      console.log("Received question effect:", question);
      // setTimer(15);
      setTimeStartQuestion(new Date());
      setCurrentQuestion(question);
      setSelectedAnswerIndex(null);
      setHighlightedOption(null); 
      setCheckAnswer(null)
    }

    if (result) {
      router.push(
        {
          pathname: "/games/leaderboard",
          params: { result, room, username },
        }
      ); 
    }
    
    if (score) {
      openSheet();
      setIsLoading(false);
      setShowModalize(true);
      console.log("Score:", score);
    }
  }, [question, router, result, room, username, score, openSheet]);


 
  const handleAnswerSelection = (index) => {
    if (index === -1 || selectedAnswerIndex !== null) return;

    setSelectedAnswerIndex(index);
    setIsLoading(true);

    const correctAnswerIndex = currentQuestion.correctAnswerIndex;
    const isCorrect = index === correctAnswerIndex;
    const timer = timeStartQuestion ? Math.round((15000 - (new Date() - timeStartQuestion)) / 100) : 0;

    setHighlightedOption(correctAnswerIndex); // Highlight the correct option

    if (!isCorrect) {
      setCheckAnswer(false)
      setTimeout(() => {
        setSelectedAnswerIndex(null);
        setCheckAnswer(null)
      }, 5000); 
    }
    else setCheckAnswer(true)

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
                key={currentQuestion?.id}
                isPlaying
                duration={timer}
                colors={['#81380F', '#D55D19', '#EE8549', '#F5B997']}
                colorsTime={[15, 10, 5, 0]}
                onComplete={() => {
                  // do your stuff here
                  return { shouldRepeat: true, delay: 5 } // repeat animation in 1.5 seconds
                }}
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
                  onPress={() => !showModalize && handleAnswerSelection(option.key)}
                  style={[
                    styles.optionButton,
                    selectedAnswerIndex === option.key && styles.selectedOption,
                    highlightedOption === option.key && (selectedAnswerIndex === option.key ? styles.wrongAnswer : styles.correctAnswer),
                    checkAnswer && (checkAnswer ? styles.correctAnswer : styles.wrongAnswer),
                  ]}
                >
                  <View className = "flex justify-center items-center w-10 h-10 rounded-full bg-grey-100"
                        style={[styles.optionText, selectedAnswerIndex === option.key && styles.selectedOptionText]} >
                    <Text className = "" style={[styles.optionText, selectedAnswerIndex === option.key && styles.selectedOptionText]}>
                      {String.fromCharCode(65 + Number(option.key) - 1)}
                    </Text>
                  </View>
                  <Text className="font-medium text-base">{option.value}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Modalize ref={modalizeRef} snapPoint={300}>
            <View className='pl-6 flex-col items-center justify-center m-[10px] bg-white rounded-2xl px-2 py-2 font-medium text-10 space-x-2'>
              <Image 
                className="w-20 h-20 rounded-full border-4 border-primary shadow-[0_0_10px_2px_rgba(0,0,255,0.7)]"
                source={images.logoBig} 
                resizeMode="contain" 
              />
              <View className = "justify-center items-center">
                <Text className='text-md text-grey-400'>{score}</Text>
                <Text className='text-base font-bold'>{username}</Text>
                
              </View>
            </View>
          </Modalize>
          {isLoading && (
            <View style={styles.loadingLayer}>
              <ActivityIndicator size="large" color="#EA661C" />
            </View>
          )}
          
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
  correctOption: {
    backgroundColor: "#D4EDDA", 
  },
  incorrectOption: {
    backgroundColor: "#F8D7DA", 
  },
  optionText: {
    textAlign: "center",
    fontWeight: 600
  },
  optionValue: {
    marginLeft: 10,
  },
  selectedOptionText:{
    // backgroundColor: '#ffff'
  },
  loadingLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  disabledOption: {
    opacity: 0.5,
  },
});


export default QuizScreen;