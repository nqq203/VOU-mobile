import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image,StyleSheet } from "react-native";

import { Icons, icons } from "../constants";


const styles = StyleSheet.create({
  
  input: {
    fontFamily: 'Inter-Regular', 
    fontSize: 15,
    // marginLeft: 10,
    color: '#BCBCBC',

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
    margin: 12,        
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

  return (
    <View className={`space-y-1 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className={`w-full bg-white h-14  px-4 bg-black-100 rounded-lg border-b mr-1 border-grey-100 flex flex-row items-center `}>
        <Image source={icon} className="w-6 h-6 " resizeMode="contain" />
        <View style={styles.line}></View>
        <TextInput
          className={`flex-1 text-gray-300 font-psemibold text-base  `}
          value={value}
          placeholder={placeholder}
          style={styles.input}
          placeholderTextColor="#BCBCBC"
          placeholderStyle="font-plight"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          {...props}
        />

        {placeholder === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6 "
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
