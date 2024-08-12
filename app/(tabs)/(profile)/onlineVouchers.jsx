import React from 'react'
import { SafeAreaView, View, Text, Dimensions,ScrollView, Modal, TouchableOpacity} from 'react-native'
import { HeaderAuth } from '../../../components'
import Voucher from '../../../components/Voucher'
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../../components/CustomButton';
import { useState } from 'react';


const OnlineVouchers = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [isError, setIsError] = useState(false);

  const handleVoucherClick = () => {
      setModalVisible(true)
  }

  const openApp = () => {
    console.log("Open app")
  }
  return (
    <SafeAreaView className="bg-bg h-full"> 
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
          <Voucher isOnline={true} name={"Giảm 20% cho đơn trên 50KKKKKKKvvv"} 
            expirationDay={"31/7/2024"} handlePres={handleVoucherClick}></Voucher>
          <Voucher isOnline={true} name={"Giảm 20% cho đơn trên 50KKKKKKKvvv"} 
            expirationDay={"31/7/2024"} handlePres={handleVoucherClick}></Voucher>
        </View>
        

      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default OnlineVouchers