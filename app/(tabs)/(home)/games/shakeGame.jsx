import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView,  
    Dimensions, TouchableOpacity, Modal, TextInput, Vibration,
    ImageBackground, Image, 
    Alert} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { useLocalSearchParams } from "expo-router";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderAuth, CustomButton } from '../../../../components';
import Item from '../../../../components/item';
import { images } from '../../../../constants';
import Dropdown from '../../../../components/Dropdown';
import * as SecureStore from 'expo-secure-store';
import {callApiShakeGame,callApiAskForTurn} from '../../../../api/games';
import {callApiGetUserTurns} from "../../../../api/events";
const ShakeGame = () => {
    const { gameId, username ,idUser} = useLocalSearchParams();
  const [showResult, setShowResult] = useState(false);
  const [modalGameVisible, setModalGameVisible] = useState(8);
  const [turn, setTurn] = useState(0);
  const [hasTurnLeft, setHasTurnLeft] = useState(true);
  const [hasItem, setHasItem] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeData, setShakeData] = useState({});
  const [wonItem, setWonItem] = useState(null);
  
  const [modalTurnVisible, setModalTurnVisible] = useState(false);
  
  const [modalAskForTurnVisible, setModalAskForTurnVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const listOptions = ['Mã ID', 'Email', 'Số điện thoại']
  const [option, setOption] = useState('')
  const [form, setForm] = useState({
    typeOfInfo: '',
    info:'',
  })
  const [user, setUser] = useState()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await SecureStore.getItemAsync("user");
        if (user) {
          user = JSON.parse(user);
          setUser(user);
          const idUser = user?.idUser
        console.log(gameId);

        const response = await callApiGetUserTurns(idUser, gameId);
        if (response.success) {
          if (response?.metadata) {
            setTurn(response.metadata.turns);
            setHasTurnLeft(response.metadata.turns > 0);
          } else {
            setTurn(0);
            setHasTurnLeft(false);
          }
        }
      } 
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();

    

    let subscription;
    const startAccelerometer = async () => {
      Accelerometer.setUpdateInterval(1000);
      subscription = Accelerometer.addListener(accelerometerData => {
        setShakeData(accelerometerData);
      });
    };

    startAccelerometer();

    return () => {
      subscription && subscription.remove();
    };
  }, [user?.idUser]);

  useEffect(() => {
    const { x, y, z } = shakeData;
    const acceleration = Math.sqrt(x * x + y * y + z * z);
    if (acceleration > 1.78) {  
        Vibration.vibrate(); 
      if (!isShaking) {
        setIsShaking(true);
        startShake();
      }
    } else {
      setIsShaking(false);
    }
  }, [shakeData]);

  
  const startShake = async () => {
    if (turn > 0) {
        setShowResult(false);
      setTurn(prevTurn => prevTurn - 1);
      try {
        const response = await callApiShakeGame({idUser: user.idUser, idGame: gameId});
        console.log('Response:', response);
        if (response.success) {
          if (response?.metadata) {
            setWonItem(response.metadata.rewardDTO);
            setHasItem(true);
          } else {
            setHasItem(false);
          }
        }
        else {
            Alert.alert(response.message);
        }
        setShowResult(true); 
      } catch (error) {
        console.log('Error calling ShakeGame API:', error);
      }
    }

    if (turn === 1) {
      setHasTurnLeft(false);
    }

    if (turn === 0) {
      setModalGameVisible(false);
      setModalTurnVisible(true);
    }
  }

  const askForTurnFacebook = () => {
    console.log("Facebook")
  }

  const askForTurnFromFriend = () => {
    setModalTurnVisible(false);
    setModalAskForTurnVisible(true);
  }  

  const sendRequestTurn = async () => {
    if(option === 'Mã ID') {
      form.typeOfInfo = 'id'
    } else if(option === 'Email'){
      form.typeOfInfo = 'email'
    } else if(option === 'Số điện thoại'){
      form.typeOfInfo = 'phone'
    }

    if( form.info === '' || form.typeOfInfo === ''){
      setIsError(true);
      return;
    }
    
    

    console.log(form);
    setModalAskForTurnVisible(false);
    setModalTurnVisible(true);
    setForm({
      typeOfInfo: '',
      info:'',
      itemName: '',
      amount: '',
    })    
  }
  
  return (
    <ImageBackground source={images.shakeGame} className='w-screen h-full'>
      {/* Modal Game */}
      <Modal 
        visible={modalGameVisible} 
        transparent={true}
        onRequestClose={() => {console.log("Close")}}
      >
        <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
          <View className='flex bg-white space-y-4 px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
            <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalGameVisible(false)}>
              <Ionicons name='close' size={28} color={'gray'} />
            </TouchableOpacity>

            
            {showResult ? (
              hasItem ? (
                <View className='items-center my-2'>
                  <Text className='text-primary font-pbold text-[28px] text-center'>CHÚC MỪNG BẠN ĐÃ NHẬN ĐƯỢC</Text>
                  <View className='mt-4'>
                    <Item
                      amount={wonItem.itemName}
                      imageUrl={wonItem.imageUrl}
                    />
                  </View>
                </View>
              ) : (
                <View className='items-center my-2'>
                  <Text className='text-primary font-pbold text-[28px] text-center'>ÔI HỤT MẤT RỒI</Text>
                  <View className='mt-4'>
                    <Image className='w-24 h-24 resize' source={images.noItem} />
                  </View>
                </View>
              )
            ) : null}
            {turn !== 0 ? (
              <Text className="text-base font-pmedium">Bạn còn {turn} lượt lắc</Text>
            ) : (
              <Text className="text-base font-pmedium">Bạn đã hết lượt lắc</Text>
            )}

            <CustomButton title={hasTurnLeft ? "Lắc tiếp" : "Thêm lượt"}  containerStyles={'w-full mt-4'} handlePress={startShake}/>
          </View>
        </View>
      </Modal>

        {/* Modal Turn */}
        <Modal 
            visible={modalTurnVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalTurnVisible(false)}>
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thêm lượt chơi</Text>
                    
                    <View className='flex-row gap-3 my-4 items-center'>
                        <Image className='w-14 h-14 resize' source={images.turn1}/>
                        <Image className='w-16 h-16 resize' source={images.turn2}/>
                        <Image className='w-16 h-16 resize' source={images.turn3}/>
                    </View>

                    <CustomButton title={"Xin lượt từ bạn bè"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={askForTurnFromFriend} icon={"friends"} iconStyle={'w-8 h-6'}/>
                    <CustomButton title={"Chia sẻ Facebook"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={askForTurnFacebook} icon={"facebook"}/>
                    
                </View>
            </View>
        </Modal>

        {/* Modal ask for turn  from friends */}
        <Modal 
            visible={modalAskForTurnVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalAskForTurnVisible(false)}>
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thông tin bạn bè</Text>
                    <Text className="text-base text-gray-500 text-center">Chọn mã ID/Email/Số điện thoại và điền thông tin tương ứng để gửi đến đúng người nhé</Text>
                    {isError ? (
                        <Text className="text-base text-red text-center mt-3">Thông tin chưa hợp lệ. Vui lòng kiểm tra lại</Text>
                    ) : null}

                    <View className='relative w-full h-[72px]'>
                        <View className='absolute z-20 w-full h-full'>
                            <Dropdown listItems={listOptions} setItem={setOption} customStyle={'mt-5'}/>
                        </View>
                    </View>
                    <TextInput
                        placeholder='Nhập nội dung'
                        placeholderTextColor={'#949494'}
                        value={form.info}
                        onChange={(e) => setForm({...form, info: e.nativeEvent.text})}
                        className="h-[48px] mt-2 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pmedium "
                    />

                    <CustomButton title={"GỬI"}  containerStyles={'w-full'} handlePress={sendRequestTurn}/>
                
                </View>
            </View>
        </Modal>

        <SafeAreaView className="h-full">
                <View
                    className="w-full h-full flex-col space-y-2 px-4 my-8"
                    style={{
                        minHeight: Dimensions.get("window").height - 50,
                    }}
                >
                    <View className="flex-col justify-center my-4 gap-4">
                        <HeaderAuth otherStyle="absolute top-5 left-4 z-10"></HeaderAuth>
                        <View className=''>
                            <Text className="text-xl w-full text-center text-white font-pbold leading-8 
                            mt-3 ml-3">
                            
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row  w-full h-full items-end">
                        <View className="justify-center items-center bg-white 
                            w-full rounded-md space-y-2 shadow-lg p-4 mb-[200px]">
                            <View className='items-center'>
                                <Text className='text-orange-900 font-pbold text-[28px]'>Lắc thật hăng</Text>
                                <Text className='text-orange-900 font-pbold text-[28px]'>Văng vật phẩm</Text>
                            </View>
                            <CustomButton title='Chơi ngay' containerStyles={'w-full my-4'} handlePress={() => {setModalGameVisible(true)}}/>
                            <Text className="text-base text-orange-900 font-pmedium">Bạn còn {turn} lượt lắc</Text>
                        </View>
                    </View>
                </View>
        </SafeAreaView>
    </ImageBackground>
  )
}

export default ShakeGame