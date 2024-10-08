import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FooterAuth, FormField ,HeaderAuth, Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callApiLogin } from "../../api/user";
import moment from "moment";


const SignIn = () => {
  const navigation = useNavigation();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  
  const showDialog = (title, message, onConfirmCallback) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOnConfirm(() => onConfirmCallback);
    setDialogVisible(true);
  };
  const submit = async () => {
    if (form.username === "" || form.password === "") {
      setDialogVisible(true);
      showDialog(false, 'Please fill in all fields', () => {});
      return;
    }
    
    
    setSubmitting(true);
    try {
      const data = {
        username: form.username,
        password: form.password
      }
      const result = await callApiLogin(data);

      setIsLogged(true);
      if (result.success === false && result.code === 401 && result.message === 'Tài khoản chưa được xác thực. Hãy xác thực OTP để đăng nhập!') {
        setForm({ username: '', password: '' });
        navigation.navigate('verify-otp',{ username: form.username });
      }
      
      console.log("Result: ",result);
     if (result.code === 200)
      {
        await SecureStore.setItemAsync('user', JSON.stringify(result.metadata.account));
        await SecureStore.setItemAsync('token_expires_at', moment().add(10,'hours').toISOString());
        await SecureStore.setItemAsync('token', result.metadata.token);
        
        const result12 = await SecureStore.getItemAsync('user');
        console.log("Result123: ",result12);
        setUser(result12.metadata);
        setIsLogged(true);
        router.push('/home');
      }
      else{
        setDialogVisible(true);
        showDialog(false, result.message, () => {});
      }
    } catch (error) {
      setDialogVisible(true);
      console.log("Err: ", error);
      showDialog(false, error.message, () => {});     
      
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
          <View className='mt-32 mx-6'>

            <Text className={`text-lg text-black font-pbold leading-8`}>
            Đăng nhập
            </Text>
            <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
            Chào mừng bạn trở lại
            </Text>
            <View className = 'mt-3'>
              <FormField
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                placeholder={"Username"}
                keyboardType="username-address"
                icon="user-o"
              />

              <FormField
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                placeholder={"Password"}
                icon="lock-closed-outline"
              />
            </View>

            <View className="flex pt-5 flex-column  ">
            <Link
                href="/forgot-password"
                className="text-lg font-psemibold text-secondary" >
              <Text className="text-sm underline font-pmedium text-grey-900 text-center" style = {{  alignItems: 'center',justifyContent: 'center', }}>
                Quên mật khẩu?
              </Text>
              </Link>

              <TouchableOpacity className = 'flex-col items-center justify-center text-white w-16 rounded-full h-16 bg-primary self-end' onPress={submit}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <FooterAuth text="Bạn là thành viên mới?" textLink="Đăng ký" url="/sign-up" />
        </View>
      </ScrollView>
      {dialogVisible && <Notification
      visible={dialogVisible}
      onClose={() => setDialogVisible(false)}
      isSuccess={dialogTitle}
      message={dialogMessage}
    ></Notification>}
    </SafeAreaView>
  );
};




export default SignIn;
