import { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert,TouchableOpacity } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { FooterAuth, FormField ,HeaderAuth,Notification} from "../../components";
import { callApiCreateAccount } from "../../api/user";
// import Notification from "../../components/Notification";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const navigation = useNavigation();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
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
    setDialogVisible(true);
  };
  const validateEmail = (email) => {
    // Simple regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const submit = async () => {
    if (form.fullName === "" || form.email === "" || form.password === ""|| form.phoneNumber === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    if (!validateEmail(form.email)) {
      showDialog(false, 'Invalid email format', () => {});
      return; 
    }

    setSubmitting(true);
    try {
      const user ={
        email: form.email,
        password: form.password,
        fullName: form.fullName,
        phoneNumber: form.phoneNumber
      }
      const result = await callApiCreateAccount(user);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
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
        <View className='mt-14 mx-6'>

          <Text className={`text-lg text-black font-pbold leading-8`}>
          Sign up
          </Text>
          <Text className="text-md border-spacing-1 font-pregular text-gray-500 mt-1 ">
          Welcome to VOU
          </Text>
          <View className = ''>
            <FormField
              value={form.fullName}
              handleChangeText={(e) => setForm({ ...form, fullName: e })}
              placeholder={"FulName"}
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
