import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert,TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { FooterAuth, FormField ,HeaderAuth,Notification} from "../../components";
import { callApiCreateAccount } from "../../api/user";
import { useMutation } from "react-query";
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import Notification from "../../components/Notification";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username : "",
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMessage, setDialogMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(() => () => {});

  const showDialog = (title, message, onConfirmCallback) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setOnConfirm(() => onConfirmCallback);
    // setDialogVisible(true);
  };

  const signUpMutation = useMutation(
    (account) => callApiCreateAccount(account),
    {
      onSuccess: (data) => {
        console.log("My data: ",data);
        // setUser(result);
        setIsLogged(true);
        router.replace("/verify-otp", { username: form.username });
        setSubmitting(false);
      },
      onError: (error) =>{
          console.log("Fetch err: ", error);            
      } 
    }
)


  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const submit = async () => {
    console.log("Form: ",form);
    if ( form.email === "" || form.password === ""|| form.phoneNumber === "" || form.username === "") {
      setDialogVisible(true);
      showDialog(false, 'Please fill in all fields', () => {});
      // Alert.alert("Error", "Please fill in all fields");
    }
    if (!validateEmail(form.email)) {
      setDialogVisible(true);
      showDialog(false, 'Invalid email format', () => {});
      
      // Alert.alert("Error", "Invalid email format");
      return; 
    }

    setSubmitting(true);


    try {
      const user ={
        email: form.email,
        password: form.password,
        fullName: form.username,
        phoneNumber: form.phoneNumber,
        username: form.username,
        role: 'PLAYER'
      }
      
      const result = await callApiCreateAccount(user);
      console.log("Ho: ",result);

      if (result?.success && result.success === true && result?.code === 201){
        setUser(result);
        setIsLogged(true);
        router.replace("/verify-otp", { username: form.username });
      }
      else{
        setDialogVisible(true);
        showDialog(false, result?.message, () => {});
        // Alert.alert("Error", result.message);
        return;
      }
    } catch (error) {
      setDialogVisible(true);
      showDialog(false, error.message, () => {});    
      console.log(error);
      // Alert.alert("Error", error.message);
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
        <View className='mt-14 mx-6'>

          <Text className={`text-lg text-black font-pbold leading-8`}>
          Sign up
          </Text>
          <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
          Welcome to VOU
          </Text>
          <View className = ''>
            <FormField
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              placeholder={"username"}
              keyboardType=""
              icon="user-o"
            />
            <FormField
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              placeholder={"Phone Number"}
              keyboardType="email-address"
              icon="phone"
            />
            <FormField
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder={"Email"}
              keyboardType="email-address"
              icon="mail-outline"
            />

            <FormField
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder={"Password"}
              icon="lock-closed-outline"
            />
          </View>

          <View className="flex pt-5 flex-column  ">
            <Text className="text-sm font-normal text-grey-900 text-center" style = {{  alignItems: 'center',justifyContent: 'center', }}>
            By signing up you agree with our Terms of Use
            </Text>
           
            <TouchableOpacity className = 'flex-col items-center justify-center text-white w-16 rounded-full h-16 bg-primary self-end mt-4' onPress={submit}>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
       <FooterAuth text="Already a member?" textLink="Sign in" url="/sign-in" />
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

export default SignUp;
