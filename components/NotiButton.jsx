import { TouchableOpacity,View} from "react-native"
import { router } from "expo-router"
import Ionicons from 'react-native-vector-icons/Ionicons';


const NotiButton = ({isSeen=true}) => {
  return (
    <TouchableOpacity className="flex-row items-center bg-white justify-center rounded-xl shadow-md border border-gray-100 w-12 h-12"
        onPress={() => {router.push('/notification')}}>
        {isSeen ? (
            <View className='absolute top-2 right-2 w-[6px] h-[6px] rounded-full bg-red ' />
        ) : null}
        <Ionicons name="notifications-outline" size={24} color="#3D3D3D" />
    </TouchableOpacity>
  )
}

export default NotiButton