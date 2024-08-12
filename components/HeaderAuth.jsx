import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const HeaderAuth = ({text, otherStyle='', otherStyleIcon = ''}) => {
  const navigation = useNavigation();
  return (
    <View className = {`flex-row items-center justify-center bg-white w-12 h-12 rounded-xl shadow-md border border-gray-100 ${otherStyle}`}>
    <TouchableOpacity className = {`items-center justify-center w-full h-full absolute left-0 ${otherStyleIcon}`} 
      onPress={() => {
        navigation.goBack()
      }}>
      <Ionicons name="chevron-back" size={24} color="#000"  />
    </TouchableOpacity>
    <Text className = 'text-black text-lg font-semibold'>{text}</Text>
  </View>
  )};

 export default HeaderAuth;