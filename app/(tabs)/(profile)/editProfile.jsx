import React from 'react'
import { SafeAreaView, View, Text } from 'react-native'
import { FormField, HeaderAuth } from '../../../components'
import { useState } from 'react'
import CustomButton from "../../../components/CustomButton";
import { Dimensions } from 'react-native';
import { router } from 'expo-router';

const EditProfile = () => {
  const [form, setForm] = useState({
    fullName: "Nguyễn Thị Mĩ Diệu",
    email: "email@gmail.com",
    gender: "Female",
    phoneNumber: "0933322323",
    facebook: "link",
  });

  return (
    <SafeAreaView className="bg-bg h-full"> 
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
              value={form.fullName}
              handleChangeText={(e) => setForm({ ...form, fullName: e })}
              placeholder={"FulName"}
              keyboardType=""
              icon="user-o"
              autoFocus={true}
              />

              <FormField
              value={form.gender}
              handleChangeText={(e) => setForm({ ...form, gender: e })}
              placeholder={"Gender"}
              keyboardType=""
              icon='transgender'
              />


              <FormField
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder={"Email"}
              keyboardType="email-address"
              icon="mail-outline"
              />

              <FormField
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              placeholder={"Phone Number"}
              keyboardType="email-address"
              icon="phone"
              />

              <FormField
              value={form.facebook}
              handleChangeText={(e) => setForm({ ...form, facebook: e })}
              placeholder={"Facebook"}
              icon="logo-facebook"
              />
            </View>
            
            <View>
              <CustomButton title={"Save"} handlePress={() => {router.push('/profile')}} />
            </View> 

          </View>
        </View>
    </SafeAreaView>
  )
}

export default EditProfile