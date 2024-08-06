import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, View, Text,Image, Dimensions} from 'react-native'


const OnlineVoucher = ({
    ...props
}) => {
  return (
    <View className=" flex-row align-middle justify-center overflow-hidden gap-4 border border-gray-500" 
        {...props}
    >
        <View className="h-[80px] justify-center align-middle ">
            <View className="w-[80px] h-[80px] rounded-xl bg-primary border border-orange-900 overflow-hidden">
                <Image source={{uri: 'https://reactjs.org/logo-og.png'}}
                className="w-full h-full" />
            </View>
        </View>

        <View className="flex">
            <Text className="text-lg font-psemibold" >Giảm 20% cho đơn trên 50KKKKKKK</Text>
            <Text className="text-base font-pregular">HSD: 31/7/2024</Text>

            <View className="flex flex-row-reverse ">
                <Link href={'#'}>
                    <Text className="text-primary text-lg font-psemibold underline">Áp dụng</Text>
                </Link>
            </View>
        </View>
    </View>
  )
}

export default OnlineVoucher;