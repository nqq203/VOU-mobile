import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const HeaderAuth = ({text, otherStyle='', otherStyleIcon = '', textStyle='', goBackPage=null}) => {
  const navigation = useNavigation();
  return (
  <View className = {`flex-row items-center justify-center  w-full h-12 ${otherStyle}`}>
    <TouchableOpacity className = {`bg-white w-12 h-12 items-center justify-center absolute left-0 rounded-xl shadow-md border border-gray-100 ${otherStyleIcon}`} 
      onPress={() => {
        navigation.goBack()
      }}>
      <Ionicons name="chevron-back" size={24} color="#000"  />
    </TouchableOpacity>

    <Text className = {`text-black text-lg font-semibold ${textStyle}`}>{text}</Text>
  </View>
  )};

 export default HeaderAuth;