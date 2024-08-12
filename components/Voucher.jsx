import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, View, Text,Image, Dimensions} from 'react-native'


const Voucher = ({
    isOnline,
    name,
    expirationDay,
    ...props
}) => {
  return (
    <View className="flex flex-row align-middle justify-center my-1 p-2
         bg-white rounded-md shadow-xl border border-gray-100" 
        {...props}

        style={{minWidth: "500px"}}
    >
        <View className="w-[80px] h-[80px] rounded-xl bg-gray-100 mx-2 mt-1 overflow-hidden">
            <Image source={{uri: 'https://placehold.co/80x80'}}
            className="w-full h-full " />
        </View>

        <View className="flex flex-col justify-center"
            style={{width: Dimensions.get("window").width - 128}}
        >
            <Text className="text-lg font-psemibold">{name}</Text>
            <View className="flex flex-row justify-between p-1">
                <Text className="text-base font-pregular">HSD: {expirationDay}</Text>
                {isOnline ? (
                    <Link href={'/'}>
                        <Text className="text-primary text-md font-psemibold underline">Áp dụng</Text>
                    </Link>
                ) : null}
            </View>
        </View>
    </View>
  )
}

export default Voucher;