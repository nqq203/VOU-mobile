import React, { useEffect } from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { FormField, HeaderAuth } from '../../../components'
import { useState } from 'react'
import CustomButton from "../../../components/CustomButton";
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import Notification from '../../../components/Notification';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { callApiUpdateAccount,callApiUpdateAccountImage } from '../../../api/user';
import * as SecureStore from 'expo-secure-store';

const EditProfile = () => {
  // const { user,setUser } = useGlobalContext();
  const [form, setForm] = useState(null);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("success");
  const [dialogMessage, setDialogMessage] = useState('Đổi thông tin thành công');

  const [user, setUser] = useState();

    useEffect(() => {
      const fetchUser = async () => {
        try {
          let user1 = await SecureStore.getItemAsync('user');
        
          if (user1) {
            user1 = JSON.parse(user1);
            setUser(user1);
            console.log(user1);
            setForm(user1);
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchUser();
      
    }, []);

  const handleSave = async () => {
    const updatedData = {
      fullName: form?.fullName,
      gender: form?.gender,
      email: form?.email,
      phoneNumber: form?.phoneNumber,
      address: form?.address,
      facebookUrl: form?.facebookUrl
    }
    
    // router.push('/profile')

    try {
      const result = await callApiUpdateAccount(user?.idUser, updatedData);
      if(result.success === true){
        console.log("Sus: ",result);
        await SecureStore.setItemAsync('user', JSON.stringify(result.metadata));
        setUser(result.metadata);
        setDialogTitle("success");
        setDialogMessage("Cập nhật thông tin thành công");
        setDialogVisible(true);
      } else{
        setDialogTitle("");
        setDialogMessage(result.message);
        setDialogVisible(true);
      }

    } catch (error) {
      console.log("Result: ",error);
    }
  }

  return (
    <SafeAreaView className="bg-bg h-full"> 
        <Notification
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            isSuccess={dialogTitle}
            message={dialogMessage}
        />
        <View
          className="bg-bg w-full flex-col py-8 px-4"
          style={{
            minHeight: Dimensions.get("window").height - 50,
          }}
        >
          <View className="flex-col justify-center my-4 gap-4">
            <HeaderAuth otherStyle="absolute top-5 left-4 z-10"></HeaderAuth>
            <View className=''>
              <Text className="text-[28px] w-full text-center text-black font-pbold leading-8 
                mt-3 ml-3">
                Edit Profile
              </Text>
            </View>
            
            <View>
              <FormField
              value={form?.fullName || ""}
              handleChangeText={(e) => setForm({ ...form, fullName: e })}
              placeholder={"FulName"}
              keyboardType=""
              icon="user-o"
              />

              <FormField
              value={form?.gender || ""}
              handleChangeText={(e) => setForm({ ...form, gender: e })}
              placeholder={"Gender"}
              keyboardType=""
              icon='transgender'
              />


              <FormField
              value={form?.email || ""}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder={"Email"}
              keyboardType="email-address"
              icon="mail-outline"
              />

              <FormField
              value={form?.phoneNumber || ""}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              placeholder={"Phone Number"}
              keyboardType="phone-pad"
              icon="phone"
              />
              <FormField
              value={form?.address|| ""}
              handleChangeText={(e) => setForm({ ...form, address: e })}
              placeholder={"Address"}
              icon="card-outline"
              />

              <FormField
              value={form?.facebookUrl || ""}
              handleChangeText={(e) => setForm({ ...form, facebookUrl: e })}
              placeholder={"Facebook"}
              icon="logo-facebook"
              />
            </View>
            
            <View>
              <CustomButton title={"Save"} handlePress={handleSave} />
            </View> 

          </View>
        </View>
    </SafeAreaView>
  )
}

export default EditProfile