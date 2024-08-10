import { Link, router,Redirect } from "expo-router";
import { useState } from 'react';
import { View, Text,SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { FormField } from "../../../components";
import { Image } from "react-native";
import CustomButton from "../../../components/CustomButton";

const Profile = () => {
    const [form, setForm] = useState({
        fullName: "Nguyễn Thị Mĩ Diệu",
        email: "email@gmail.com",
        gender: "Female",
        phoneNumber: "0933322323",
        facebook: "link",
    });

    const defaultImage = "https://reactjs.org/logo-og.png"

    return (
        <SafeAreaView className="bg-bg h-full">
        <ScrollView>
            <View
                className="bg-bg w-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
                <View className="justify-center items-center flex-1 mb-2">
                    <View className="h-[200px] justify-center align-middle">
                        <View className="w-[170px] h-[170px] rounded-full bg-primary border border-orange-900 overflow-hidden">
                            <Image source={{uri: defaultImage}}
                            className="w-full h-full " />
                        </View>
                    </View>

                    <Text className={`text-[28px] text-black font-pbold leading-8`}>
                        Nguyễn Thị Mĩ Diệu
                    </Text>
                </View>


                <View >
                    <View className="flex-row align-items justify-between">
                        <Text className={`text-lg text-black font-pbold leading-8`}>
                            Account Settings
                        </Text>

                        <Link href={'/editProfile'}>
                            <Text className={`text-md text-primary font-psemibold leading-8 underline`}>
                                Edit
                            </Text>
                        </Link>
                    </View>

                    <FormField
                    value={form.fullName}
                    handleChangeText={(e) => setForm({ ...form, fullName: e })}
                    placeholder={"FulName"}
                    keyboardType=""
                    icon="user-o"
                    editable={false}
                    />

                    <FormField
                    value={form.gender}
                    handleChangeText={(e) => setForm({ ...form, gender: e })}
                    placeholder={"Gender"}
                    keyboardType=""
                    icon='transgender'
                    editable={false}
                    />


                    <FormField
                    value={form.email}
                    handleChangeText={(e) => setForm({ ...form, email: e })}
                    placeholder={"Email"}
                    keyboardType="email-address"
                    icon="mail-outline"
                    editable={false}
                    />

                    <FormField
                    value={form.phoneNumber}
                    handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
                    placeholder={"Phone Number"}
                    keyboardType="email-address"
                    icon="phone"
                    editable={false}
                    />

                    <FormField
                    value={form.facebook}
                    handleChangeText={(e) => setForm({ ...form, facebook: e })}
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


                <View>
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        History
                    </Text>
                    <View>
                        <CustomButton title={"Gift history"} containerStyles={'border border-brown-900 bg-white'}
                            textStyles={'text-brown-900 font-psemibold'} />
                    </View>
                </View>

                <View className="flex gap-2 mt-6">
                    <Text className={`text-lg text-black font-pbold leading-8`}>
                        Others
                    </Text>
                    <View>
                        <CustomButton title={"Sign out"} containerStyles={'bg-red'}
                            textStyles={'text-white font-psemibold'} />
                    </View>

                    <View>
                        <CustomButton title={"Lock account"} containerStyles={'border border-red bg-white'}
                            textStyles={'text-red font-psemibold'} />
                    </View>
                </View>               

            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;