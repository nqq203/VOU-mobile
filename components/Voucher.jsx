import { Link } from 'expo-router'
import { SafeAreaView, View, Text,Image, Dimensions, TouchableOpacity} from 'react-native'

const Voucher = ({
    isOnline,
    name,
    expirationDay,
    containerStyle,
    handlePres,
    imageUrl,
    ...props
}) => {
  return (
    <TouchableOpacity className={`flex flex-row align-middle justify-center my-1 p-2 w-full
         bg-white rounded-md shadow-xl border border-gray-100 ${containerStyle} `} 
        {...props}
        style={{minWidth: "500px"}}
        onPress={handlePres}        
    >
        <View className="w-[80px] h-[80px] rounded-xl bg-gray-100 mr-3 mt-1 overflow-hidden">
            <Image source={{uri: imageUrl}}
            className="w-full h-full " />
        </View>

        <View className="flex flex-col justify-center flex-grow"
            style={{maxWidth: Dimensions.get("window").width - 128}}
        >
            <Text className="text-base font-psemibold">{name}</Text>
            <View className="flex flex-row justify-between mt-1">
                <Text className="text-base font-pregular">HSD: {expirationDay}</Text>
                {isOnline ? (
                    <Text className="text-primary text-md font-psemibold underline">Áp dụng</Text>
                ) : null}
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default Voucher;