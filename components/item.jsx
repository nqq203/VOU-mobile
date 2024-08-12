import React from 'react'
import { Text, View, Image } from 'react-native'

const Item = ({
    imageUrl,
    amount
}) => {
  return (
    <View className='flex-col items-center'>
        <View className="w-[76px] h-[76px] rounded-xl bg-gray-100 overflow-hidden">
            <Image source={{uri: imageUrl}}
            className="w-full h-full " />
        </View>
        <View>
            <Text>{amount}</Text>
        </View>
    </View>
  )
}

export default Item