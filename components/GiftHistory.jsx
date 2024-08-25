import React from 'react'
import { View, Image, Text, Dimensions} from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GiftHistory = ({
    username,
    isReceived,
    give_time,
    itemName
}) => {
  return (
    <View className='flex-row '>
        <View className='p-1'>
            {isReceived ? (
                <MaterialCommunityIcons name="call-made" size={24} color={"#EA661C"} />
            ) : (
                <MaterialCommunityIcons name="call-received" size={24} color={"#56CC56"} />
            )}
        </View>

        <View className="flex flex-col pl-2 pr-6 justify-center">
            {isReceived ? (
                <Text className="text-base font-pmedium">Bạn đã nhận từ {username} một mảnh ghép {itemName}</Text>
            ) : (
                <Text className="text-base font-pmedium">Bạn đã tặng cho {username} một mảnh ghép {itemName}</Text>
            )}
            <Text className="text-base font-pregular text-gray-500">{give_time}</Text>
        </View>
    </View>
  )
}

export default GiftHistory