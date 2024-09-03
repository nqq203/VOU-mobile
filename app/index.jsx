import {useState, useEffect} from "react";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Image, ScrollView, ImageBackground, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from 'expo-secure-store';
import moment from "moment";

import { images } from "../constants";
import { CustomButton } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";
const image = { uri: 'https://legacy.reactjs.org/logo-og.png' };

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();
  const [signIn, setSignIn] = useState(false);

  useEffect(() => {
    const token = SecureStore.getItemAsync('token');
    const  isExpired = moment().isAfter(SecureStore.getItemAsync('token_expires_at'));
    if (token && !isExpired) {
      setSignIn(true);
    }
  }, []);

  if (!loading && isLogged) return <Redirect href="/home" />;

  const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      width: '100%',
      height: '100%',
    },
    safeArea: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    },
    scrollView: {
      flex: 1,
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
    },
    textContainer: {
      marginTop: 20,
      textAlign: 'center',
    },
  });


  return (
    <ImageBackground source={image} style={styles.backgroundImage}>
      <SafeAreaView style={styles.safeArea}>
        {/* <Loader isLoading={loading} /> */}

        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <Image
              source={images.logoBig}
              style={{ width: 130, height: 84, justifyContent: 'center', alignItems: 'center'}}
              resizeMode="contain"
            />

            <CustomButton
              title="Let's go"
              handlePress={() => signIn ? router.push("/home") : router.push("/sign-in")}
              containerStyles="absolute bottom-20 px-20"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#161622" style="light" />
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Welcome;

