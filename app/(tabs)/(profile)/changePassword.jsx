import { SafeAreaView, View, Text, ScrollView,TouchableOpacity } from 'react-native'
import { FormField, HeaderAuth } from '../../../components'
import CustomButton from "../../../components/CustomButton";
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import Notification from '../../../components/Notification';
import * as SecureStore from 'expo-secure-store';
import { callApiChangePassword } from '../../../api/user';
import { useRoute } from '@react-navigation/native';
import { useState,useEffect } from 'react';

const ChangePassword = () => {
    const [form, setForm] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("success");
    const [dialogMessage, setDialogMessage] = useState('Đổi thông tin thành công');

    const [user, setUser] = useState();

    const route = useRoute();
    const { userId,email} = route.params; 

    const validate = () => {
        if(form.password === "" || form.rePassword === ""){
            setDialogTitle("");
            setDialogMessage("Vui lòng điền đầy đủ các ô nhập liệu");
            setDialogVisible(true);
            return false;
        }
    
        const accountRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    
        if (!accountRegex.test(form.password)) {
            setDialogTitle("");
            setDialogMessage("Mật khẩu bao gồm 8 ký tự trở lên bao gồm chữ hoa, chữ thường, số, ký hiệu (ví dụ: !@#$)");
            setDialogVisible(true);
            return false;
        }
        if (form.password.length < 8) {
            setDialogTitle("");
            setDialogMessage("Mật khẩu phải lớn hơn 8 kí tự");
            setDialogVisible(true);
            return false;
        }
    
        if(form.password !== form.rePassword){
            setDialogTitle("");
            setDialogMessage("Mật khẩu nhập lại chưa đúng");
            setDialogVisible(true);
            return false;
        }
        return true;
    }

    const handleSave = async () => {
        
        if(!validate()) return;
        const data = {
            ...form,
            email: email,
        }
        try {
            const result = await callApiChangePassword(data);
            console.log("Ss: ",result);
            if(result.success === true){
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
        <ScrollView>
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
                    Đổi mật khẩu
                </Text>
                </View>
                
                <View>
                    <FormField
                    value={form?.password || ""}
                    handleChangeText={(e) => setForm({ ...form, password: e })}
                    placeholder={"Password"}
                    icon="lock-closed-outline"
                    />  
                    <FormField
                    value={form?.rePassword || ""}
                    handleChangeText={(e) => setForm({ ...form, rePassword: e })}
                    placeholder={"Nhập lại password"}
                    icon="lock-closed-outline"
                    />           

                

                
                </View>
                
                <View>
                <CustomButton title={"Lưu thông tin"} handlePress={handleSave} />
                </View> 

            </View>
            </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ChangePassword