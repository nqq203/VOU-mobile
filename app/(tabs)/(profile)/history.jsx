import { View, Text,SafeAreaView,ScrollView, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import GiftHistory from '../../../components/GiftHistory';
import { HeaderAuth } from '../../../components';

const History = () => {
    
    const listItems = ['Xu','Gà','Thỏ','Mèo','Vịt','Cá']
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
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Ngoc Anh"} isReceived={true} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Anh Minh"} isReceived={false} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"ThAnh"} isReceived={true} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Nguyen"} isReceived={false} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
  )
}

export default History