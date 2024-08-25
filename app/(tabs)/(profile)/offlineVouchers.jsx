import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView, View, Text, Dimensions,Modal,ScrollView, TouchableOpacity, Image} from 'react-native'
import { HeaderAuth } from '../../../components'
import Voucher from '../../../components/Voucher'
import { useState } from 'react'


const OfflineVouchers = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [isError, setIsError] = useState(false);

  const handleVoucherClick = () => {
      setModalVisible(true)
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
                <Text className="text-xl font-psemibold text-center">QUÉT MÃ NHẬN THƯỞNG</Text>

                <View className="w-[200px] h-[200px] my-6 overflow-hidden">
                    <Image source={{uri: 'https://via.placeholder.com/200'}}
                      className="w-full h-full" 
                      resizeMode="cover"
                    />
                </View>

                <Text className="text-lg font-pbold text-primary text-center">
                  Giảm giá 10% cho đơn từ 100k
                </Text>
                <Text className="text-base text-center">
                  Mã voucher: <Text className='font-psemibold text-base'>THFUEW232</Text>
                </Text>
                <Text className="text-base text-center">
                  Ngày hết hạn: <Text className='font-psemibold text-base'>22/1/2025</Text>
                </Text>
                <Text className="text-base text-center">
                  Áp dụng: <Text className='font-psemibold text-base'>Các chi nhánh của brand</Text>
                </Text>
                {isError ? (
                    <Text className="text-base text-red text-center mt-3">Bạn chưa đạt điều kiện đổi thưởng</Text>
                ) : null}

                
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
              Offline Vouchers
            </Text>
          </View>
        </View>

        <View className="flex flex-col items-center justify-center">
          <Voucher isOnline={false} name={"Giảm 10% khi gọi BE"} expirationDay={"1/7/2024"} handlePres={handleVoucherClick}></Voucher>
          <Voucher isOnline={false} name={"Giảm 20% "} expirationDay={"31/7/2024"} handlePres={handleVoucherClick}></Voucher>
        </View>
        

      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

export default OfflineVouchers