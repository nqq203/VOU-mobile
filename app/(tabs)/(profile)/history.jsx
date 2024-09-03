import { View, Text,SafeAreaView,ScrollView, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GiftHistory from '../../../components/GiftHistory';
import { HeaderAuth } from '../../../components';
import { callApiGetGiftLog } from '../../../api/gift';
import { useRoute } from '@react-navigation/native';
import { useState,useEffect } from 'react';
import { convertDataToOutputString } from '../../../utils/date';


const History = () => {
    const [giftlog, setGiftlog] = useState([])
  const route = useRoute();
  const { userId} = route.params; 


    const fetchUserGiftLog = async (id) => {
        console.log("Gift log")
        console.log("userId: ", id)
        if(id === undefined) return;
        try {
          let itemData = await callApiGetGiftLog(id);
        
          console.log("Sus giftlog: ",itemData);
          if(itemData.success === true){
            setGiftlog(itemData.metadata)
            
            } else{
                console.log("Failed giftlog: ",itemData.message);   
            }
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
        fetchUserGiftLog(userId);
    },[])


  return (
    <SafeAreaView className="bg-bg h-full">
    <ScrollView>
            <View
                className="bg-bg w-full h-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
                <View className="flex-col justify-center my-4 gap-4">
                    <HeaderAuth otherStyle="absolute top-5 left-4 z-10"></HeaderAuth>
                    <View className=''>
                        <Text className="text-xl w-full text-center text-black font-pbold leading-8 
                        mt-3 ml-3">
                        Lịch sử giao dịch
                        </Text>
                    </View>
                </View>

                <View className="flex bg-white rounded-md shadow-lg my-4 p-2">
                    <View className="flex">
                    {giftlog?.sendHistory?.map((history,index) => (
                            <View key={index} className="mt-2 pr-3">
                                <GiftHistory username={history.receiverName} isReceived={false} 
                                    give_time={convertDataToOutputString(history.giveTime)} itemName={history.item.itemName}/>
                            </View>
                        ))}
                        {giftlog?.receiveHistory?.map((history,index) => (
                            <View key={index} className="mt-2 pr-3">
                                <GiftHistory username={history.senderName} isReceived={true} 
                                    give_time={convertDataToOutputString(history.giveTime)} itemName={history.item.itemName}/>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
  )
}

export default History