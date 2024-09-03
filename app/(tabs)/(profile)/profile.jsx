import { Link, } from "expo-router";
import React, { useEffect, useState } from 'react';
import { View, Text,SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { FormField } from "../../../components";
import { Image } from "react-native";
import CustomButton from "../../../components/CustomButton";
import Notification from "../../../components/Notification";
import { useRouter } from "expo-router";
import { useGlobalContext } from "../../../context/GlobalProvider";
import { images } from "../../../constants";
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


const Profile = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [form, setForm] = useState();
    const [image, setImage] = useState();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState('Số điện thoại không hợp lệ');
    const [user, setUser] = useState();

    useFocusEffect(
        useCallback(() => {
          // Your refresh logic here
          console.log('Screen is focused and refreshed');
        //   refetch();
        fetchUser();
    
          return () => {
            // Optional cleanup if needed when screen loses focus
          };
        }, [])
    );

    const fetchUser = async () => {
        try {
          let user1 = await SecureStore.getItemAsync('user');
        
          if (user1) {
            user1 = JSON.parse(user1);
            setUser(user1);
            console.log(user1);
            setForm(user1);
            setImage(user1?.avatarUrl || 'https://via.placeholder.com/200');
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
      fetchUser();
    }, []);
    console.log("user", user);

    const handleChangeImage = () => {

    }

    return (
        <SafeAreaView className="bg-bg h-full">
        <Notification
            visible={dialogVisible}
            onClose={() => setDialogVisible(false)}
            isSuccess={dialogTitle}
            message={dialogMessage}
        />
        <ScrollView>
            <View
                className="bg-bg w-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
                <View className="justify-center items-center flex-1 mb-2">
                    <View className="h-[200px] justify-center align-middle">
                        <TouchableOpacity className="w-[170px] h-[170px] rounded-full  border border-gray-300 shadow-sm overflow-hidden"
                            onPress={handleChangeImage}
                        >
                            <Image source={{uri: image}}
                            className="w-full h-full " />
                        </TouchableOpacity>
                    </View>

                    <Text className={`text-[28px] text-black font-pbold leading-8`}>
                        {user?.fullName}
                    </Text>
                </View>


                <View>
                    <View className="flex-row align-items justify-between">
                        <Text className={`text-lg text-black font-pbold leading-8`}>
                            Account Settings
                        </Text>

                        <TouchableOpacity onPress={() => {router.push('/editProfile')}}>
                            <Text className={`text-base text-primary font-psemibold leading-8 underline`}>
                                Edit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FormField
                    value={user?.fullName || ""}
                    handleChangeText={(e) => setForm({ ...form, fullName: e })}
                    placeholder={"FulName"}
                    keyboardType=""
                    icon="user-o"
                    editable={false}
                    />

                    <FormField
                    value={(user?.gender === "MALE" ? "Nam" : "Nữ") || ""}
                    handleChangeText={(e) => setForm({ ...form, gender: e })}
                    placeholder={"Gender"}
                    keyboardType=""
                    icon='transgender'
                    editable={false}
                    />


                    <FormField
                    value={user?.email}
                    handleChangeText={(e) => setForm({ ...form, email: e })}
                    placeholder={"Email"}
                    keyboardType="email-address"
                    icon="mail-outline"
                    editable={false}
                    />

                    <FormField
                    value={user?.phoneNumber}
                    handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
                    placeholder={"Phone Number"}
                    keyboardType="phone-pad"
                    icon="phone"
                    editable={false}
                    />

                    <FormField
                    value={user?.address}
                    handleChangeText={(e) => setForm({ ...form, address: e })}
                    placeholder={"Address"}
                    icon="card-outline"
                    editable={false}
                    />

                    <FormField
                    value={user?.facebookUrl || ""}
                    handleChangeText={(e) => setForm({ ...form, facebookUrl: e })}
                    placeholder={"Facebook"}
                    icon="logo-facebook"
                    editable={false}
                    />
                </View>

                <View className="flex gap-2">
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        Vouchers
                    </Text>

                    <View>
                        <CustomButton title={"Online Vouchers"} containerStyles={'border border-brown-900 bg-white'}
                            textStyles={'text-brown-900 font-psemibold'} handlePress={() => {router.push('/onlineVouchers');}} />
                    </View>

                    <View>
                        <CustomButton title={"Offline Vouchers"} containerStyles={'border border-brown-900 bg-white'}
                            textStyles={'text-brown-900 font-psemibold'} handlePress={() => {router.push('/offlineVouchers');}} />
                    </View>
                </View>


                <View className='flex gap-2 mt-6'>
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        History
                    </Text>
                    <View>
                        <CustomButton title={"Gift history"} containerStyles={'border border-brown-900 bg-white'}
                            textStyles={'text-brown-900 font-psemibold'} handlePress={() => {navigation.navigate('history',{ userId: user.idUser});}}/>
                    </View>
                </View>

                <View className="flex gap-2 mt-6">
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        Others
                    </Text>
                    <View>
                        <CustomButton title={"Sign out"} containerStyles={'bg-red'}
                            textStyles={'text-white font-psemibold'} handlePress={() => {router.replace('/');}}/>
                    </View>
                </View>               

            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;