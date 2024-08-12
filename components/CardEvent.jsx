import { TouchableOpacity, View, Image, Text, } from 'react-native';
import { router, usePathname } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from 'react';

const CardEvent = ({
    item,
    customStyle,
    ...props
}) => {
  const pathname = usePathname();
  const [isFavorite, setisFavorite] = useState(item.isFavorite)

  const handleFavoritePress = (id) => {
    const value = !item.isFavorite;
    item.isFavorite = value;
    setisFavorite(value);
  };

  return (
    <TouchableOpacity key={item.id} 
     className={customStyle}
     {...props}
     onPress={() => {
        if (item?.id === "")
        return Alert.alert(
          "Missing Query",
          "Please input something to search results across database"
        );
    
        if (pathname.startsWith("/details")) router.setParams({key});
        else router.push(`/details/${item?.id}`);}}
    >
        <View className="bg-white rounded-lg pb-4">
          <Image
            source={{ uri: item.image }}
            className="w-full h-36 rounded-t-lg"
            resizeMode="cover"
          />
          <View className="flex-row mx-3 mt-2 ml-2 justify-between">
            <Image
              source={{ uri: item.avt }}
              className="w-12 h-12 rounded-lg mt-2"
              resizeMode="cover"
            />
            <View className="flex-col mx-3 w-[70%]">
              <Text className="text-lg font-bold">{item.title}</Text>
              <Text className="text-[15px] text-gray-500">Thời gian: {item.startDate} - {item.endDate}</Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-white"
              onPress={() => handleFavoritePress(item.id)}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={32} color="#EA661C" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default CardEvent