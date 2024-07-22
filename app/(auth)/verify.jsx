import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet,TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { FooterAuth, FormField ,HeaderAuth,Notification} from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { apiCall } from "../../lib/callAPI";

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
    <SafeAreaView>
      <ScrollView>
        <HeaderAuth title="Verify your account" />
        <View style={styles.container}>
          <FormField
            label="OTP"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={submit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>
        <FooterAuth
          text="Already have an account?"
          linkText="Sign in"
          href="/sign-in"
        />
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

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    backgroundColor: '#1E429F',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Verify;