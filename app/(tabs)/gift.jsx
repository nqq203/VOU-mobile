import { View, Text,SafeAreaView,ScrollView, Dimensions, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomButton from '../../components/CustomButton';
import Item from '../../components/item';
import GiftHistory from '../../components/GiftHistory';
import Dropdown from '../../components/Dropdown';
import FormField from '../../components/FormField';
import { Notification } from '../../components';
import NotiButton from '../../components/NotiButton';


import { useState } from 'react';

const Gift = () => {
    const listItems = ['Xu','Gà','Thỏ','Mèo','Vịt','Cá']
    const listOptions = ['Mã ID', 'Email', 'Số điện thoại']
    const [item, setItem] = useState('');
    const [option, setOption] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [form, setForm] = useState({
        typeOfInfo: '',
        info:'',
        itemName: '',
        amount: '',
    })
    const [isError, setIsError] = useState(false);

    const submit = () => {
        form.itemName = item;
        if(option === 'Mã ID') {
            form.typeOfInfo = 'id'
        } else if(option === 'Email'){
            form.typeOfInfo = 'email'
        } else if(option === 'Số điện thoại'){
            form.typeOfInfo = 'phone'
        }

        if(form.amount === '' || form.info === '' || form.itemName === '' || form.typeOfInfo === ''){
            setIsError(true);
            return;
        }

        setIsError(false);
        setModalVisible(false);

        setDialogTitle('success');
        setDialogMessage('Gửi tặng vật phẩm thành công');
        setDialogVisible(true);
        console.log(form);
        setForm({
            typeOfInfo: '',
            info:'',
            itemName: '',
            amount: '',
        })     

    }

    const [dialogVisible, setDialogVisible] = useState(true);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState('Số điện thoại không hợp lệ');

    return (
        <SafeAreaView className="bg-bg h-full">
        <Modal 
            visible={modalVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalVisible(false)}>
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thông tin bạn bè</Text>
                    <Text className="text-base text-gray-500 text-center">Chọn mã ID/Email/Số điện thoại và điền thông tin tương ứng để gửi đến đúng người nhé</Text>
                    {isError ? (
                        <Text className="text-base text-red text-center mt-3">Thông tin chưa hợp lệ. Vui lòng kiểm tra lại</Text>
                    ) : null}

                    <View className='relative w-full h-[72px]'>
                        <View className='absolute z-20 w-full h-full'>
                            <Dropdown listItems={listOptions} setItem={setOption} customStyle={'mt-5'}/>
                        </View>
                    </View>
                    <TextInput
                        placeholder='Nhập nội dung'
                        placeholderTextColor={'#949494'}
                        value={form.info}
                        onChange={(e) => setForm({...form, info: e.nativeEvent.text})}
                        className="h-[48px] mt-2 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pmedium "
                    />

                    <View className='relative w-full h-[76px] '>
                        <View className='absolute z-10 w-full h-full'>
                            <Text className='text-base font-pmedium'>Vật phẩm</Text>
                            <Dropdown listItems={listItems} setItem={setItem} customStyle={'mt-2'}/>
                        </View>
                    </View>
                    <TextInput
                        placeholder='Số lượng'
                        placeholderTextColor={'#949494'}
                        value={form.amount}
                        keyboardType="numeric"
                        onChange={(e) => setForm({...form, amount: e.nativeEvent.text})}
                        className="h-[48px] mt-4 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pmedium "
                    />

                    <CustomButton title={"TẶNG"}  containerStyles={'w-full'} handlePress={submit}/>
                
                </View>
            </View>
        </Modal>
        
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
                <View className="flex-row justify-between items-center">
                    <View className="">
                        <Text className={`text-xl text-black font-bold leading-8`}>
                            VẬT PHẨM CỦA TÔI
                        </Text>
                    </View>

                    <NotiButton />
                </View>

                <View className="flex flex-row flex-wrap bg-white rounded-md shadow-lg mb-4">
                    {listItems.map(item  => {
                        return (
                            <View key={item} className="w-1/4 p-2">
                                <Item imageUrl={"https://placehold.co/76x76"} amount={`1 ${item}`} />
                            </View>
                        )
                    })}
                </View>

                <CustomButton 
                    title="Tặng vật phẩm" 
                    handlePress={() => setModalVisible(true)}
                />

                <View className="flex bg-white rounded-md shadow-lg my-4 p-2">
                    <Text className={`text-lg text-black font-bold leading-8`}>
                        Lịch sử trao đổi
                    </Text>

                    <View className="flex">
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Ngoc Anh"} isReceived={true} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Anh Minh"} isReceived={false} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"ThAnh"} isReceived={true} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                        <View className="mt-2 pr-3">
                            <GiftHistory username={"Nguyen"} isReceived={false} give_time={'20:18 - 21/7/2024'} itemName={"Xu"}/>
                        </View>
                    </View>
                </View>

            </View>
        </ScrollView>
        </SafeAreaView>
    );
}

export default Gift;