import React from 'react'
import { SafeAreaView, View, Text, Dimensions} from 'react-native'
import { HeaderAuth } from '../../../components'
import Voucher from '../../../components/Voucher'

const OfflineVouchers = () => {

  return (
    <SafeAreaView className="bg-bg h-full"> 
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
          <Voucher isOnline={false} name={"Giảm 10% khi gọi BE"} expirationDay={"1/7/2024"}></Voucher>
          <Voucher isOnline={false} name={"Giảm 20% "} expirationDay={"31/7/2024"}></Voucher>
        </View>
        

      </View>
    </SafeAreaView>
  )
}

export default OfflineVouchers