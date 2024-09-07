import {  View, Text,Image, Dimensions, TouchableOpacity} from 'react-native'
import { convertDataToOutputString } from '../utils/date';


const Voucher = ({
    isOnline,
    voucher,
    voucherImg,
    voucherName,
    voucherExpire,
    containerStyle,
    handlePres,
    imageUrl,
    amount=1,
    ...props
}) => {
  return (
    <TouchableOpacity className={`flex flex-row align-middle justify-center my-1 p-2 w-full
         bg-white rounded-md shadow-xl border border-gray-100 overflow-hidden ${containerStyle} `} 
        {...props}
        style={{minWidth: "500px"}}
        onPress={handlePres}        
    >
        <View className="bg-primary p-1 absolute top-0 right-0">
            <Text className="text-white text-sm">
            {"x" + amount}
            </Text>
        </View>
        <View className="w-[80px] h-[80px] rounded-xl bg-gray-100 mr-3 mt-1 overflow-hidden">
            <Image source={{uri: voucherImg || 'https://placehold.co/80x80'}}
            className="w-full h-full " />
        </View>

        <View className="flex flex-col justify-center flex-grow"
            style={{maxWidth: Dimensions.get("window").width - 128}}
        >
            <Text className="text-base font-psemibold">{voucherName}</Text>
            <View className="flex flex-row justify-between mt-1">
                <Text className="text-base font-pregular">HSD: {convertDataToOutputString(voucherExpire)}</Text>
                {isOnline ? (
                    <Text className="text-primary text-md font-psemibold underline">Áp dụng</Text>
                ) : null}
            </View>
        </View>
    </TouchableOpacity>
  )
}

export default Voucher;