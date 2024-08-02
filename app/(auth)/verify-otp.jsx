import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { CustomButton, FooterAuth, FormField ,HeaderAuth,Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OtpInput } from "react-native-otp-entry";
const Verify = () => {
  const navigation = useNavigation();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState(''); 
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [isSuccess, setIsSuccess] = useState(false);

const showDialog = (title, message, onConfirmCallback) => {
  setDialogTitle(title);
  setDialogMessage(message);
  setOnConfirm(() => onConfirmCallback);
  setDialogVisible(true);
};
const submit = async () => {
  if (otp === "") {
    showDialog(false, 'Please fill in all fields', () => {});
  }
  setSubmitting(true);

  try {
    await apiCall('auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        otp,
      }),
    });
    setIsSuccess(true);
    showDialog(true, 'Account verified successfully', () => {
      // navigation.navigate('home');
    });
  } catch (error) {
    showDialog(false, error.message, () => {});
  } finally {
    setSubmitting(false);
  }
}
  return(
    <SafeAreaView className="bg-bg h-full">
      <ScrollView>
      <View 
          className="bg-bg w-full flex px-4 mt-8"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
        <HeaderAuth />
        <View className='mt-24 mx-6'>
        <Text className={`text-lg text-black font-pbold leading-8`}>
        Verification
        </Text>
        <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
        Enter the OTP code we sent you
        </Text>
        <View className ='mt-16 w-60 self-center'>
          <OtpInput numberOfDigits={4} focusColor="#EA661C" 
          theme ={{
            pinCodeContainerStyle:{
              width: 48,
              height: 61,
              alignContent: 'center',
              
            }
          }} />
          <Text className="text-gray-500 text-sm mt-4 self-center">Haven't received the code? <Link href="/resend-otp" className="text-primary">Resend</Link></Text>
          <CustomButton title={isSubmitting ? 'Verifying...' : 'Verify'} onPress={submit} containerStyles = 'h-10 mt-7 w-32 self-center' />
        </View>
        
        </View>
        <FooterAuth  url="/sign-up" />
        </View>
      </ScrollView>
      <Notification
        isSuccess={isSuccess}
        message={dialogMessage}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
      />
      
    </SafeAreaView>
  
  )
};



export default Verify;