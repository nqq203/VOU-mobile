import { View, Text,SafeAreaView,ScrollView, Dimensions, TouchableOpacity, 
    Modal, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import Item from '../../components/item';
import GiftHistory from '../../components/GiftHistory';
import Dropdown from '../../components/Dropdown';
import FormField from '../../components/FormField';
import { Notification,Loader } from '../../components';
import NotiButton from '../../components/NotiButton';
import { useGlobalContext } from '../../context/GlobalProvider';
import { useQuery } from 'react-query';
import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { convertDataToOutputString } from '../../utils/date';
import { callApiGetItems } from '../../api/item';
import { callApiSendItem,callApiGetGiftLog } from '../../api/gift';

const Gift = () => {
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);

    const [listItems, setListItems] = useState([])
    const [listItemsText, setListItemsText] = useState([])
    const [giftlog, setGiftlog] = useState([])
    const listOptions = ['Mã ID', 'Email', 'Tên tài khoản']
    const [item, setItem] = useState('');
    const [option, setOption] = useState(listOptions[0])
    const [modalVisible, setModalVisible] = useState(false)
    const [form, setForm] = useState({
        typeOfInfo: 'Mã ID',
        receiverInfo:'',
        itemId: 'Chó',
        amount: '',
    })
    const [isError, setIsError] = useState(false);

    useFocusEffect(
        useCallback(() => {
          // Your refresh logic here
          console.log('Screen is focused and refreshed');
            setLoading(true)
            console.log(user);
            fetchUser();
          
            
          return () => {
            // Optional cleanup if needed when screen loses focus
          };
        }, [])
    );

    const fetchUserItems = async (id) => {
        if(id === undefined) return;
        try {
          let itemData = await callApiGetItems(id);
        
          console.log("listItems: ",itemData);
          if(itemData.success === true){
            const sortedItems = itemData.metadata.sort((a, b) => a.idItem - b.idItem);
            setListItems(sortedItems);
            const itemNames = itemData.metadata.map(item => item.itemName);
            setListItemsText(itemNames)
            
            } else{
                console.log("Failed: ",itemData);   
            }
        } catch (error) {
          console.log(error);
        }
    };

    const fetchUserGiftLog = async (id) => {
        if(id === undefined) return;
        try {
          let itemData = await callApiGetGiftLog(id);
        
        //   console.log("Sus giftlog: ",itemData);
          if(itemData.success === true){
            setGiftlog(itemData.metadata)
            
            } else{
                console.log("Failed giftlog: ",itemData.message);   
            }
        } catch (error) {
          console.log(error);
        }
    };

    

    const sendItemToFriend = async (data) => {
        try {
          let result = await callApiSendItem(data);
          console.log("Send:",result);

          if(result.success === true){
            console.log("Sus: ",result);
            setModalVisible(false);
            setDialogTitle('success');
            setDialogMessage('Gửi tặng vật phẩm thành công');
            setDialogVisible(true);
            fetchUserItems(user.idUser);
            setIsError(false);
            setForm({
                typeOfInfo: '',
                receiverInfo:'',
                itemId: '',
                amount: '',
            })
            } else{
                console.log("Failed: ",result);
                setDialogTitle('');
                setDialogMessage(result.message);
                setDialogVisible(true);
            }
        } catch (error) {
          console.log(error);
        }
    };

    const fetchUser = async () => {
        try {
          let user1 = await SecureStore.getItemAsync('user');
        
          if (user1) {
            user1 = JSON.parse(user1);
            setUser(user1);
          }
        } catch (error) {
          console.log(error);
        }
    };

    useEffect(() => {
      fetchUser();
    }, []);

    useEffect(()=>{
        fetchUserItems(user.idUser);
        fetchUserGiftLog(user.idUser);
        const timer = setTimeout(() => {
            setLoading(false)
        }, 3000);
        return () => clearTimeout(timer);
    },[user])

    

    const submit = async () => {
        let itemId = 1;
        console.log(item)
        listItems.map(it => { 
            if(it.itemName === item){
                itemId = it.idItem;
            }
        });
        if(option === 'Mã ID') {
            form.typeOfInfo = 'id'
        } else if(option === 'Email'){
            form.typeOfInfo = 'email'
        } else if(option === 'Tên tài khoản'){
            form.typeOfInfo = 'username'
        }
        form.itemId = itemId;

        if(form.amount === '' || form.receiverInfo === '' || form.itemId === '' || form.typeOfInfo === ''){
            setIsError(true);
            return;
        }

        const data = {
            senderUsername: option === "Tên tài khoản" ? user.username : null,
            receiverUsername: option === "Tên tài khoản" ? form.receiverInfo : null,
            senderEmail: option === "Email" ? user.email : null,
            receiverEmail: option === "Email" ? form.receiverInfo : null,
            senderId: option === "Mã ID" ? user.idUser : null,
            receiverId: option === "Mã ID" ? parseInt(form.receiverInfo) : null,
            itemId: form.itemId,
            amount: parseInt(form.amount),
        }
        const result = await sendItemToFriend(data)
        
        // setIsError(false);
        // setModalVisible(false);

        // setDialogTitle('success');
        // setDialogMessage('Gửi tặng vật phẩm thành công');
        // setDialogVisible(true);
        // console.log(form);
        // setForm({
        //     typeOfInfo: '',
        //     receiverInfo:'',
        //     itemName: '',
        //     amount: '',
        // });
    }

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState('');

    return (
        <SafeAreaView className="bg-bg h-full">
        <Modal 
            visible={modalVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' 
                        onPress={() => {
                            setModalVisible(false); setIsError(false);
                            setForm({
                                typeOfInfo: '',
                                receiverInfo:'',
                                itemId: '',
                                amount: '',
                            })}}
                    >
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thông tin bạn bè</Text>
                    <Text className="text-base text-gray-500 text-center">Chọn mã ID/Email/Tên tài khoản và điền thông tin tương ứng để gửi đến đúng người nhé</Text>
                    {isError ? (
                        <Text className="text-base text-red text-center mt-3">Thông tin chưa hợp lệ. Vui lòng kiểm tra lại</Text>
                    ) : null}

                    <View className='z-50 relative w-full h-[72px]'>
                        <View className='absolute z-20 w-full h-full'>
                            <Dropdown listItems={listOptions} setItem={setOption} customStyle={'mt-5'}/>
                        </View>
                    </View>
                    <TextInput
                        placeholder='Nhập nội dung'
                        placeholderTextColor={'#949494'}
                        value={form.receiverInfo}
                        onChange={(e) => setForm({...form, receiverInfo: e.nativeEvent.text})}
                        className="h-[48px] mt-2 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pregular "
                    />

                    <View className='z-10 relative w-full h-[76px] '>
                        <View className='absolute z-10 w-full h-full'>
                            <Text className='text-base font-pregular'>Vật phẩm</Text>
                            <Dropdown listItems={listItemsText} setItem={setItem} customStyle={'mt-2'}/>
                        </View>
                    </View>
                    <TextInput
                        placeholder='Số lượng'
                        placeholderTextColor={'#949494'}
                        value={form.amount}
                        keyboardType="numeric"
                        onChange={(e) => setForm({...form, amount: e.nativeEvent.text})}
                        className="h-[48px] mt-4 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pregular "
                    />

                    <CustomButton title={"TẶNG"}  containerStyles={'w-full'} handlePress={submit}/>
                
                </View>
            </View>
        </Modal>
        
        <Notification
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            isSuccess={dialogTitle}
            message={dialogMessage}
        />            

        <ScrollView>
            <View
                className="bg-bg w-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
            {loading ? (
                <Loader isLoading={loading} />
            ) : (
                <>
                <View className="flex-row justify-between items-center mt-3">
                    <View className="">
                        <Text className={`text-xl text-black font-bold leading-8`}>
                            VẬT PHẨM CỦA TÔI
                        </Text>
                    </View>

                    <NotiButton />
                </View>

                <View className="flex flex-row flex-wrap bg-white rounded-md shadow-lg mb-4" 
                    style={[styles.customShadow]} >
                    {listItems?.map(item  => {
                        return (
                            <View key={item.idItem} className="w-1/4 p-2">
                                <Item imageUrl={item.imageUrl} amount={`${item.amount}`} />
                            </View>
                        )
                    })}
                </View>

                <CustomButton 
                    title="Tặng vật phẩm" 
                    handlePress={() => setModalVisible(true)}
                />

                <View className="flex bg-white rounded-md shadow-lg my-4 p-2" style={[styles.customShadow]}>
                    <Text className={`text-lg text-black font-bold leading-8`}>
                        Lịch sử trao đổi
                    </Text>

                    <View className="flex">
                        {giftlog?.sendHistory?.length === 0 && giftlog?.receiveHistory?.length === 0 ? (
                            <Text className="text-base w-full text-center text-black font-pregular leading-8 mt-3 ml-3">Chưa có lịch sử trao đổi</Text>
                        ) : (
                            <>
                            {giftlog?.sendHistory?.map((history,index) => (
                                <View key={index} className="mt-2 pr-3">
                                    <GiftHistory username={history.receiverName} isReceived={false} amount={history.amount} 
                                        give_time={convertDataToOutputString(history.giveTime)} itemName={history.item.itemName}/>
                                </View>
                            ))}
                            {giftlog?.receiveHistory?.map((history,index) => (
                                <View key={index} className="mt-2 pr-3">
                                    <GiftHistory username={history.senderName} isReceived={true} amount={history.amount} 
                                        give_time={convertDataToOutputString(history.giveTime)} itemName={history.item.itemName}/>
                                </View>
                            ))}
                            </>
                        )}
                    </View>
                </View>
                </>
            )}

            </View>
        </ScrollView>
        </SafeAreaView>
    );

    
}

const styles = StyleSheet.create({
    customShadow: {
      shadowColor: '#AA7373', // The color of the shadow
      shadowOffset: {
        width: 0, // x: 0
        height: 6, // y: 6
      },
      shadowOpacity: 0.1, // 10% opacity
      shadowRadius: 47.38, // blur 47.38
      elevation: 6, // This is for Android, approximate value to match shadowOffset
    },
});

export default Gift;