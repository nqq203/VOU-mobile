import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
const HeaderAuth = ({text}) => {
  return (
    <View className = 'flex-row items-center justify-center'>
    <TouchableOpacity className = 'items-center justify-center bg-white w-12 h-12 rounded-xl absolute left-0' onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={24} color="#000"  />
    </TouchableOpacity>
    <Text className = 'text-black text-lg font-semibold'>{text}</Text>
  </View>
  )};

 export default HeaderAuth;