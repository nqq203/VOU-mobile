import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image,StyleSheet } from "react-native";

import { Icons, icons } from "../constants";

import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
  input: {
    fontFamily: 'Inter-Regular', 
    fontSize: 15,
    // marginLeft: 10,
    color: '#3E3E3E',

  },
  frameInput:{
    borderBottomWidth: 8, 
    borderBottomColor: '#DEDEDE',
    backgroundColor: '#F4F4F4',
  },
  line: {
    width: 1.5,             
    height: 24,            
    backgroundColor: '#BCBCBC', 
  },
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
const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  icon,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const useIcon = ['user-o','phone']

  return (
    <View className={` ${otherStyles}`} >
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className={`w-full bg-white h-14 px-4 bg-black-100 rounded-lg border-b mr-1 border-grey-100 flex flex-row items-center `}
        style={[styles.customShadow]} >
        {useIcon.includes(icon) ? (
            <Icon name={icon} size={20} color={'#622B0C'} style={{ marginRight: 10 }} />
        ) : (
            <Ionicons name={icon} size={20} color="#622B0C" style={{ marginRight: 10 }} />
        )}
         <View style={styles.line}></View>
          <TextInput
            className={`flex-1 text-black font-psemibold text-base ml-2 `}
            value={value}
            placeholder={placeholder}
            style={styles.input}
            placeholderTextColor="#BCBCBC"
            placeholderStyle="font-plight"
            onChangeText={handleChangeText}
            secureTextEntry={(placeholder === "Password" ||placeholder === "Confirm password")&& !showPassword}
            {...props}
          />

          {(placeholder 
          === "Password" ||placeholder === "Confirm password") && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={!showPassword ? 'eye-outline' : 'eye-off-outline'} 
                size={20}
                color="#BCBCBC"
              />

            </TouchableOpacity>
          )}
      </View>
    </View>
  );
};

export default FormField;
