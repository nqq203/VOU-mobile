import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { router, usePathname } from "expo-router";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useState } from 'react';
import moment from 'moment';
import { Alert } from 'react-native';
import { callAPIFav } from '../api/events';

const CardEvent = ({
    item,
    isFav=false,
    customStyle,
    ...props
}) => {
  const pathname = usePathname();
  const [isFavorite, setisFavorite] = useState(isFav)

  const handleFavoritePress = (id) => {
    const value = !item.isFavorite;
    item.isFavorite = value;
    setisFavorite(value);
    // await callAPIFav(id, );
  };

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
    <TouchableOpacity key={item.idEvent} 
     className={customStyle}
     
     {...props}
     onPress={() => {
        if (item?.idEvent === "")
        return Alert.alert(
          "Missing Query",
          "Please input something to search results across database"
        );
    
        if (pathname.startsWith("/details")) router.setParams({ id: item?.idEvent });
        else router.push(`/details/${item?.idEvent}`);}}
    >
        <View className="bg-white rounded-lg pb-4" style={[styles.customShadow]}>
          <Image
            source={{uri: item.imageUrl}}
            className="w-full h-36 rounded-t-lg"
            resizeMode="cover"
          />
          <View className="flex-row mx-3 mt-2 ml-2 justify-between">
            <Image
              source={{uri: item.logoBrand || "https://via.placeholder.com/12"}}
              className="w-12 h-12 rounded-lg mt-2"
              resizeMode="cover"
            />
            <View className="flex-col mx-3 w-[70%]">
              <Text className="text-lg font-bold">{item.eventName}</Text>
              <Text className="text-[15px] text-gray-500">Thời gian: {moment(item.startDate).format('DD/MM/YYYY')} - {moment(item.endDate).format('DD/MM/YYYY')}</Text>
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-center bg-white"
              onPress={() => handleFavoritePress(item.idEvent)}
            >
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={32} color="#EA661C" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
  )
}

export default CardEvent