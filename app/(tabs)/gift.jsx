
import { useState } from 'react';
import { View, Text,SafeAreaView,ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Gift = () => {
    return (
        <SafeAreaView className="bg-bg h-full">
        <ScrollView>
            <View
                className="bg-bg w-full flex-col space-y-2 px-4 my-8"
                style={{
                    minHeight: Dimensions.get("window").height - 50,
                }}
            >
                <View className="flex-row justify-between items-center">
                    <View className="">
                        <Text className={`text-xl text-black font-bold leading-8`}>
                            VẬT PHẨM CỦA TÔI
                        </Text>
                    </View>

                    <TouchableOpacity className="flex-row items-center justify-center bg-white p-3 rounded-2xl w-12 h-12 self-center">
                        <Icon name="bell-outline" size={25} color="#3D3D3D" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

export default Gift;