import React from 'react';
import { View, Text ,StyleSheet,Image,Modal} from 'react-native';
import CustomButton from './CustomButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {icons} from '../constants';

const Notification = ({ isSuccess, message,visible,onClose }) => {
  const iconName = isSuccess ? "success" : "error";
  const color = isSuccess ? "green" : "red";
  const backgroundColor = isSuccess ? "bg-active" : "bg-red";
  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.05)', 
      borderBlockColor: color,
    },
    dialog: {
      width: 300,
      padding: 20,
      backgroundColor: 'white',
      borderRadius: 10,
    },
  });

  return (
    <Modal
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
    >
      <View style={styles.overlay}>
      
      <View style={[styles.dialog, {  borderColor: color, borderWidth: 1 }]}>
        <View className ='flex-row'>
        <Image source={icons[iconName]} style={{ height:24,width:24,justifyContent: 'center', alignItems: 'center'}}
                  className= 'w-full opacity-50' resizeMode="contain" />
        <Text className="pl-4 text-base font-semibold mr-1">{message}</Text>
        </View>
        <CustomButton title="OK" handlePress={onClose} containerStyles={`mt-4 w-full h-8  ${backgroundColor}`}  textStyles='text-base'/>
      </View>
      </View>
    </Modal>
  );

}

export default Notification;