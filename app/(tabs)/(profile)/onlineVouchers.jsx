import React from 'react'
import { SafeAreaView, View, Text, Dimensions,ScrollView, Modal, TouchableOpacity} from 'react-native'
import { HeaderAuth } from '../../../components'
import Voucher from '../../../components/Voucher'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../../components/CustomButton';
import { useState, useEffect } from 'react';
import { callApiGetUserVouchers } from '../../../api/voucher';
import { useGlobalContext } from '../../../context/GlobalProvider';
import Notification from '../../../components/Notification';
import { useQuery } from 'react-query';
import * as SecureStore from 'expo-secure-store';



const OnlineVouchers = () => {
  // const { user } = useGlobalContext();
  const [user, setUser] = useState("");

  const [listVouchers, setListVouchers] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isError, setIsError] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("success");
  const [dialogMessage, setDialogMessage] = useState('');

  const fetchUserVoucher = async (id) => {
    if(id === undefined) return;
    const request = {
      userId: id,
      voucherType: "online",
    }
    try {
      let result = await callApiGetUserVouchers(request);
    
      if(result.success === true){
        console.log("Sus: ",result);
        setListVouchers(result.metadata);
      } else{
        console.log(result.message);
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
    fetchUserVoucher(user.idUser);
  },[user])


  const handleVoucherClick = () => {
      setModalVisible(true)
  }

  const openApp = () => {
    console.log("Open app")
  }
  return (
    <SafeAreaView className="bg-bg h-full"> 
      <Notification
          visible={dialogVisible}
          onClose={() => setDialogVisible(false)}
          isSuccess={dialogTitle}
          message={dialogMessage}
      />
      <Modal 
        visible={modalVisible} 
        transparent={true}
        onRequestClose={() => {console.log("Close")}}
      >
        <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
            <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>

              <View className='w-full my-2 items-center'>
                <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalVisible(false)}>
                  <Ionicons name='close' size={28} color={'gray'} />
                </TouchableOpacity>
                <Text className="text-2xl font-psemibold text-center">Đi đến ứng dụng</Text>
                <CustomButton title={"Mở App"} containerStyles={'w-3/4 mt-6'}  handlePress={openApp}/>

              </View>
            
            </View>
        </View>
    </Modal>

    <ScrollView>
      <View
        className="bg-bg w-full flex-col py-8 px-4"
        style={{
          minHeight: Dimensions.get("window").height - 50,
        }}
      >
        <View className="flex-col justify-center my-4 gap-4">
          <HeaderAuth otherStyle="absolute top-5 left-4 z-10"></HeaderAuth>
          <View className=''>
            <Text className="text-xl w-full text-center text-black font-pbold leading-8 
              mt-3 ml-3">
              Online Vouchers
            </Text>
          </View>
        </View>

        <View className="flex flex-col items-center justify-center">
          {listVouchers.length !== 0 ? (
            listVouchers.map(voucher => (
              <Voucher isOnline={true} name={"Giảm 20% cho đơn trên 50KKKKKKKvvv"} 
            expirationDay={"31/7/2024"} handlePres={handleVoucherClick}></Voucher>
            ))
          ) : (
            <Text className="text-base w-full text-center text-black font-pregular leading-8 
              mt-3 ml-3">
              Bạn chưa sở hữu vouchers nào
            </Text>
          )}
          
        </View>
        

      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default OnlineVouchers