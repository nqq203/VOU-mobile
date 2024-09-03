import { useState } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert,} from "react-native";
import { CustomButton, FooterAuth ,HeaderAuth,Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import { OtpInput } from "react-native-otp-entry";
import { useRoute } from '@react-navigation/native';
import moment from "moment";
const {callApiVerifyOTP, callApiResendOTP} = require("../../api/user");

const Verify = () => {
  const route = useRoute();
  const { user, setUser, setIsLogged } = useGlobalContext();
  console.log("user: ", user);
  const [isSubmitting, setSubmitting] = useState(false);
  const [otp, setOtp] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});
  const [isSuccess, setIsSuccess] = useState(false);
  const { username ,email} = route.params; 

// const showDialog = (title, message, onConfirmCallback) => {
//   setDialogTitle(title);
//   setDialogMessage(message);
//   setOnConfirm(() => onConfirmCallback);
//   setDialogVisible(true);
// };
const submit = async () => {
  if (otp === "") {
    // showDialog(false, 'Please fill in all fields', () => {});
    Alert.alert("Error", "Please fill in all fields");
    return;
  }
  setSubmitting(true);

  try {
    const username = await AsyncStorage.getItem('username');
    const result = await callApiVerifyOTP({username: username, otp: otp});
    
    if (result.success === true && result.message) {
      Alert.alert("Success", "Account verified successfully");

      await SecureStore.setItemAsync('user', JSON.stringify(result.metadata.user));
      await SecureStore.setItemAsync('token_expires_at', moment().add(10,'hours').toISOString());
      await SecureStore.setItemAsync('token', result.metadata.token);
      setUser(result.data);
      router.push('/home');
    }
    else Alert.alert("Error", result.message);
  } catch (error) {
    // showDialog(false, error.message, () => {});
  } finally {
    setSubmitting(false);
  }
}

const resendOTP = async () => {
  try {
    const result = await callApiResendOTP({username: username});
    if (result.success === true && result.message) {
      Alert.alert("Success", "OTP sent successfully");
    }
    Alert.alert("Error", result.message);
  } catch (error) {
    // showDialog(false, error.message, () => {});
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
        <View className ='mt-16 w-full self-center'>
          <OtpInput numberOfDigits={6} focusColor="#EA661C" 
            onTextChange={setOtp}
            theme ={{
            pinCodeContainerStyle:{
              width: 48,
              height: 61,
              alignContent: 'center',
              
            }
          }} />
          <Text className="text-gray-500 text-sm mt-4 self-center">Haven't received the code? <Link href="/resend-otp" className="text-primary">Resend</Link></Text>
          <CustomButton title={isSubmitting ? 'Verifying...' : 'Verify'} containerStyles = 'h-10 mt-7 w-32 self-center' handlePress={submit}/>
        </View>
        
        </View>
        <FooterAuth  url="/sign-up" />
        </View>
      </ScrollView>
      {/* <Notification
        isSuccess={isSuccess}
        message={dialogMessage}
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
      /> */}
      
    </SafeAreaView>
  
  )
};



export default Verify;