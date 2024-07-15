import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import {  icons } from "../../constants";
const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
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
          className="bg-bg w-full flex justify-center h-full px-10 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View style = {{marginTop: 10}} className='mt-10 '>

          <Text className={`text-xl leading-7 text-black font-pbold ${styles.customLineHeight}`}>
            Sign in
          </Text>
          <Text className="text-base border-spacing-1 font-pregular text-gray-500 mt-1 ">
          Welcome back
          </Text>

          <FormField
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder={"Email"}
            keyboardType="email-address"
            icon = {icons.email}
          />

          <FormField
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            placeholder={"Password"}
            icon = {icons.lock}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-sm underline font-pmedium text-grey-">
              Forgot Password?
            </Text>
            <Link
              href="/forgot-password"
              className="text-lg  font-psemibold text-secondary " ></Link>
          </View>

          </View>
          <View className="flex justify-center pt-5 flex-column absolute bottom-20 px-20 ">
          <Image source={images.logoBig} 
          style={{ width: '100%', justifyContent: 'center', alignItems: 'center'}} resizeMode="contain" />
          <View className="flex justify-center pt-5 flex-row">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  customLineHeight: {
    lineWidth: 100, // Line height = 1000
    lineHeight: 100, // Line height = 1000
    margin:1000
  },

});


export default SignIn;
