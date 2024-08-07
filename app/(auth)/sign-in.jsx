import { useState } from "react";
import {AsyncStorage} from 'react-native';
import { Link, router,Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FooterAuth, FormField ,HeaderAuth, Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { callApiLogin } from "../../api/user";

const SignIn = () => {
  const navigation = useNavigation();
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ username: '', password: '' });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  
  // const showDialog = (title, message, onConfirmCallback) => {
  //   setDialogTitle(title);
  //   setDialogMessage(message);
  //   setOnConfirm(() => onConfirmCallback);
  //   setDialogVisible(true);
  // };
  const submit = async () => {
    if (form.username === "" || form.password === "") {
      // showDialog(false, 'Please fill in all fields', () => {});
    }

    setSubmitting(true);
    let result = null;
    try {
      const data = {
        username: form.username,
        password: form.password
      }
      result = await callApiLogin(data);

      setIsLogged(true);
      if (result.message === "Unverified account, please verify OTP") {
        navigation.navigate('verify-otp',{ username: form.username });
      }
      else if (result.success !== true) {
        Alert.alert("Error", result.message);
      }
      else 
      {
        await AsyncStorage.setItem('user', JSON.stringify(result.metadata.user));
        await AsyncStorage.setItem('token', result.metadata.token);
        setUser(result.data);
        setIsLogged(true);
        router.push('/home');
      }
    } catch (error) {
      // showDialog(false, error.message, () => {});
      console.log("Result: ",error.code);
     
      
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
            Sign in
            </Text>
            <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
            Welcome back
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
                Forgot Password?
              </Text>
              </Link>

              <TouchableOpacity className = 'flex-col items-center justify-center text-white w-16 rounded-full h-16 bg-primary self-end' onPress={submit}>
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <FooterAuth text="New member?" textLink="Sign up" url="/sign-up" />
        </View>
      </ScrollView>
      {/* <Notification
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        isSuccess={dialogTitle}
        message={dialogMessage}
        
    /> */}
    </SafeAreaView>
  );
};




export default SignIn;
