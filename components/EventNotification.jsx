import { Link } from 'expo-router'
import React from 'react'
import { SafeAreaView, View, Text,Image, Dimensions, StyleSheet} from 'react-native'

const EventNotification = ({
    title,
    description,
    time,
    isSeen = true,
    ...props
}) => {
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

  return (
    <View className={`flex flex-row align-middle justify-center my-1 p-2
         bg-gray-100 rounded-lg border border-gray-100  ${isSeen ? '' : 'bg-white'}`}
        {...props}

        style={[{minWidth: "500px"}, styles.customShadow]}
    >
        {isSeen ? null : (
            <View className='absolute top-2 left-2 w-2 h-2 rounded-full bg-red ' />
        )}
        <View className="w-[80px] h-[80px] rounded-full bg-active mx-2 mt-1 overflow-hidden">
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