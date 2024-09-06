import React from 'react'
import { View,TouchableOpacity,Image } from 'react-native'


const Avatar = (image, setImage) => {

    const handleChangeImage = () => {

    }

    const onButtonPress = () => {

    }

    return (
        <View className="h-[200px] justify-center align-middle">
            <TouchableOpacity className="w-[170px] h-[170px] rounded-full  border border-gray-300 shadow-sm overflow-hidden"
                onPress={handleChangeImage}
            >
                <Image source={{uri: image}} className="w-full h-full " />
                <TouchableOpacity onPress={onButtonPress}>

                </TouchableOpacity>
            </TouchableOpacity>
        </View>
    )
}

export default Avatar