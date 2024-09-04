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
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { callApiUpdateAccountImage } from "../../../api/user";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const Profile = () => {
    const router = useRouter();
    const navigation = useNavigation();
    const [form, setForm] = useState();
    const [image, setImage] = useState();
    const [gender, setGender] = useState("")

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState('Số điện thoại không hợp lệ');
    const [user, setUser] = useState();
    const [isChosingImage, setIsChosingImage] = useState(false);


    useFocusEffect(
        useCallback(() => {
          // Your refresh logic here
          console.log('Screen is focused and refreshed');
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
            console.log("user: ",user1);
            setForm(user1);
            if(user1.gender !== null){
                setGender(user1?.gender === "MALE" ? "Nam" : "Nữ")
            }
            setImage(user1?.avatarUrl || 'https://via.placeholder.com/200');
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
      fetchUser();
    }, []);

    const updateAvatar = async () => {
        if(user?.idUser === null) return;
        try {
            const result = await callApiUpdateAccountImage(user?.idUser,image);
            console.log("Result: ", result);
            if (result.success === true){
                setDialogTitle("success");
                setDialogMessage("Cập nhật avatar thành công");
                setDialogVisible(true);

                const newUser = {
                    ...user,
                    avatarUrl: result.metadata,
                }
                console.log("New: ",user);

                setUser(newUser);
                await SecureStore.setItemAsync('user', JSON.stringify(newUser));
                
            } else{
                setDialogTitle("");
                setDialogMessage(result.message || result.error || "Lỗi cập nhật");
                setDialogVisible(true);
            }
        } catch (error) {
            console.log("Err: ", error);
        }
        setIsChosingImage(false);
    }


    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library 
        
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        setIsChosingImage(true);
        if (permissionResult.granted === false) {
          alert("You've refused to allow this appp to access your photos!");
          setIsChosingImage(false);
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        console.log(result.assets)
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          console.log("Image: ", result.assets[0].uri);
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

        <ScrollView>
            <View
                className="bg-bg w-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
                <View className="justify-center items-center flex-1 mb-2">
                    <View className="h-[200px] justify-center align-middle" >
                        <TouchableOpacity className="w-[170px] h-[170px] rounded-full  border border-gray-300 shadow-sm overflow-hidden"
                            onPress={showImagePicker}
                        >
                            <Image source={{uri: image}} className="w-full h-full" />
                        </TouchableOpacity>
                        {isChosingImage ? (
                            <TouchableOpacity className="w-10 h-10 absolute items-center justify-center rounded-full bottom-4 right-2 bg-white border border-gray-100"
                                onPress={(e) => {e.persist(); updateAvatar()}}
                            >
                                <MaterialIcons size={28} color="#EA661C" name="done"/>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity className="w-10 h-10 absolute items-center justify-center rounded-full bottom-4 right-2 bg-white border border-gray-100"
                                onPress={showImagePicker}
                            >
                                <Ionicons size={28} color="#EA661C" name="camera-outline"/>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text className={`text-[28px] text-black font-pbold leading-8`}>
                        {user?.fullName}
                    </Text>
                </View>


                <View>
                    <View className="flex-row align-items justify-between">
                        <Text className={`text-lg text-black font-pbold leading-8`}>
                            Thông tin tài khoản
                        </Text>

                        <TouchableOpacity onPress={() => {router.push('/editProfile')}}>
                            <Text className={`text-base text-primary font-psemibold leading-8 underline`}>
                                Chỉnh sửa
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <FormField
                    value={user?.fullName || ""}
                    handleChangeText={(e) => setForm({ ...form, fullName: e })}
                    placeholder={"Họ và tên"}
                    keyboardType=""
                    icon="user-o"
                    editable={false}
                    />

                    <FormField
                    value={gender}
                    handleChangeText={(e) => setForm({ ...form, gender: e })}
                    placeholder={"Giới tính"}
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
                    placeholder={"Số điện thoại"}
                    keyboardType="phone-pad"
                    icon="phone"
                    editable={false}
                    />

                    <FormField
                    value={user?.address}
                    handleChangeText={(e) => setForm({ ...form, address: e })}
                    placeholder={"Địa chỉ"}
                    icon="card-outline"
                    editable={false}
                    />

                    <FormField
                    value={user?.facebookUrl || ""}
                    handleChangeText={(e) => setForm({ ...form, facebookUrl: e })}
                    placeholder={"Link facebook"}
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
                        Lịch sử trao đổi
                    </Text>
                    <View>
                        <CustomButton title={"Gift history"} containerStyles={'border border-brown-900 bg-white'}
                            textStyles={'text-brown-900 font-psemibold'} handlePress={() => {navigation.navigate('history',{ userId: user.idUser});}}/>
                    </View>
                </View>

                <View className="flex gap-2 mt-6">
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        Khác
                    </Text>
                    <View>
                        <CustomButton title={"Đổi mật khẩu"} containerStyles={'border border-brown-900 bg-white mb-2'}
                                textStyles={'text-brown-900 font-psemibold'} handlePress={() => {navigation.navigate('changePassword',{ userId: user.idUser, email: user.email});}}/>
                        <CustomButton title={"Đăng xuất"} containerStyles={'bg-red'}
                                textStyles={'text-white font-psemibold'} handlePress={() => {router.replace('/');}}/>
                    </View>
                </View>               

            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;