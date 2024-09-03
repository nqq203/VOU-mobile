import React, { useEffect } from 'react'
import { SafeAreaView, View, Text, ScrollView,TouchableOpacity } from 'react-native'
import { FormField, HeaderAuth } from '../../../components'
import { useState } from 'react'
import CustomButton from "../../../components/CustomButton";
import { Dimensions } from 'react-native';
import { router } from 'expo-router';
import Notification from '../../../components/Notification';
import { useGlobalContext } from '../../../context/GlobalProvider';
import { callApiUpdateAccount,callApiUpdateAccountImage } from '../../../api/user';
import * as SecureStore from 'expo-secure-store';
import Dropdown from '../../../components/Dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native';


const EditProfile = () => {
  // const { user,setUser } = useGlobalContext();
  const [form, setForm] = useState(null);
  const listOptions = ['Nam','Nữ'];
  const [option, setOption] = useState(listOptions[0]);
  const [isOpen, setIsOpen] = useState(false)

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("success");
  const [dialogMessage, setDialogMessage] = useState('Đổi thông tin thành công');

  const handleClickItem = (item) => {
    setOption(item);
    setIsOpen(!isOpen);
}

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
            const gender = user1.gender === "MALE" ? "Nam" : "Nữ"
            setOption(gender)
          }
        } catch (error) {
          console.log(error);
        }
      };

      fetchUser();
      
    }, []);

  const handleSave = async () => {
    const gender = option === "Nam"  ? "MALE" : "FEMALE";
    const updatedData = {
      fullName: form?.fullName,
      gender: gender,
      email: form?.email,
      phoneNumber: form?.phoneNumber,
      address: form?.address,
      facebookUrl: form?.facebookUrl
    }
    // console.log(updatedData);
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
  const styles = StyleSheet.create({
    line: {
    width: 1.5,             
    height: 24,          
    backgroundColor: '#BCBCBC', 
  },
  customShadow: {
    shadowColor: '#AA7373', // The color of the shadow
    shadowOffset: {
      width: 0, // x: 0
      height: 6, // y: 6
    },
    shadowOpacity: 0.1, // 10% opacity
    shadowRadius: 47.38, // blur 47.38
    elevation: 6, // This is for Android, approximate value to match shadowOffset
  },  
  })

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

              {/* <FormField
              value={form?.gender || ""}
              handleChangeText={(e) => setForm({ ...form, gender: e })}
              placeholder={"Gender"}
              keyboardType=""
              icon='transgender'
              /> */}

            

              <View className='relative w-full z-50 mt-4 border-b mr-1 border-grey-100' style={[styles.customShadow]}>
                <TouchableOpacity className={`bg-white relative flex-row items-center w-full h-14 px-1 bg-black-100 rounded-lg `} 
                    onPress={() =>  setIsOpen(!isOpen)} >
                    <View className='p-2'>
                        <Ionicons name='transgender' size={24} color={"#622B0C"}></Ionicons>
                    </View>
                    <View style={styles.line}></View>
                    <Text className='text-base font-pregular text-black ml-2'>{option}</Text>

                    {isOpen ? (
                        <View className={`bg-white border w-full top-[60px] border-gray-200 rounded-md absolute`}>
                            {listOptions.map(item  => {
                                return (
                                    <TouchableOpacity key={item} className='bg-white p-2 border border-gray-200' 
                                        onPress={() => handleClickItem(item)}>
                                        <Text className='text-base font-pregular text-gray-800'>{item}</Text>
                                    </TouchableOpacity>
                                )
                            })}                            
                        </View>
                    ) : null}
                </TouchableOpacity>
              </View>


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
        </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile