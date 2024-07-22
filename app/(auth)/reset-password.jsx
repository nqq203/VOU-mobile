import { useState } from "react";
import { Link, router,Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FooterAuth, FormField ,HeaderAuth,Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiCall } from "../../lib/callAPI";

const ResetPassword = () => {
  const navigation = useNavigation();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ password1: '', password2: '' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const validateEmail = (email) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const showDialog = (title, message, onConfirmCallback) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOnConfirm(() => onConfirmCallback);
    setDialogVisible(true);
  };
  const submit = async () => {
    // if (form.email === "") {
    //   showDialog(false, 'Please fill in all fields', () => {});
    // }
    // if (!validateEmail(form.email)) {
    //   showDialog(false, 'Invalid email format', () => {});
    //   return; 
    // }
    setSubmitting(true);

    try {
      // await apiCall('auth/signin', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     email: form.email,
      //     password: form.password,
      //   }),
      // });
      // const result = await apiCall('user/me');
      // setUser(result);
      setIsLogged(true);

      // navigation.navigate('verify');
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  
  return (
    <SafeAreaView className="bg-bg h-full">
      <ScrollView >
        <View 
          className="bg-bg w-full flex px-4 mt-8"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >

          <HeaderAuth />
          <View className='mt-20 mx-6'>

            <Text className={`text-lg text-black font-pbold leading-8`}>
            Reset password
            </Text>
            <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
            Enter your new password
            </Text>
            <View className = 'mt-6'>
            <FormField
                value={form.password1}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                placeholder={"Password"}
                icon="lock-closed-outline"
              />

              <FormField
                value={form.password2}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                placeholder={"Confirm password"}
                icon="lock-closed-outline"
              />
            </View>
            <TouchableOpacity className = 'flex-col items-center justify-center text-white w-16 rounded-full h-16 bg-primary self-end mt-8' onPress={submit}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
          <FooterAuth url="/sign-up" />
        </View>
      </ScrollView>
      <Notification
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        isSuccess={dialogTitle}
        message={dialogMessage}
        
    />
    </SafeAreaView>
  );
};




export default ResetPassword;
