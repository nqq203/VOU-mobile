import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, View, Text,Image, Dimensions} from 'react-native'

const EventNotification = ({
    title,
    description,
    time,
    isSeen = false,
    ...props
}) => {
  return (
    <View className="flex flex-row align-middle justify-center my-1 p-2
         bg-white rounded-md shadow-xl border border-gray-100" 
        {...props}

        style={{minWidth: "500px"}}
    >
        {isSeen ? (
            <View className='absolute top-2 left-2 w-2 h-2 rounded-full bg-red ' />

        ) : null}
        <View className="w-[80px] h-[80px] rounded-full bg-gray-100 mx-2 mt-1 overflow-hidden">
            <Image source={{uri: 'https://placehold.co/80x80'}}
            className="w-full h-full " />
        </View>

        <View className="flex flex-col justify-center"
            style={{width: Dimensions.get("window").width - 128}}
        >
            <Text className="text-lg font-psemibold">{title}</Text>
            <Text className="text-base font-pregular">{description}</Text>
            <Text className="text-base font-pregular text-gray-500">{time}</Text>
        </View>
    </View>
  )
}

export default EventNotification