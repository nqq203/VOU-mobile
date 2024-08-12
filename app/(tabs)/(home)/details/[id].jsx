import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  View,
  Dimensions,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { CustomButton, HeaderAuth} from "../../../../components";
import { icons } from "../../../../constants";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import Item from "../../../../components/item";
import Voucher from "../../../../components/Voucher";



const Details = () => {
  const {id} = useLocalSearchParams();
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  // const { data: posts, refetch } = {

  //   data:  {
  //     id: 1,
  //     title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 1",
  //     image: "https://via.placeholder.com/150",
  //     avt: "https://via.placeholder.com/150",
  //     startDate: "2021/10/10",
  //     endDate: "2021/10/10",
  //     isFavorite: false,
  //   },
  // }
  const post = {
    id: 1,
    title: "Kỷ niệm sinh nhật thành lập 10 10 năm thành lập 1",
    brand: 'Brand',
    image: "https://via.placeholder.com/150",
    avt: "https://via.placeholder.com/150",
    startDate: "2021/10/10",
    endDate: "2021/10/10",
    isFavorite: false,
    turns:1
  };

  // Pop up Doi thuong
  const listItems = ['Xu','Gà','Thỏ','Mèo','Vịt','Cá']
  const [canExchangeVoucher, setCanExchangeVoucher] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isError, setIsError] = useState(false);

  const submit = () => {
      // setIsError(true);
      setCanExchangeVoucher(true);
  }


  return (
    <SafeAreaView>
        {/* Pop up Doi thuong */}
        <Modal 
            visible={modalVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    {canExchangeVoucher ? (
                      <View className='w-full my-2 items-center'>
                        <Text className="text-xl font-pbold text-center text-primary">CHÚC MỪNG</Text>
                        <Text className="text-xl font-pbold text-center text-primary">BẠN ĐÃ NHẬN ĐƯỢC</Text>
                        <Voucher isOnline={false} name={"Giảm 10% khi gọi BE"} expirationDay={"1/7/2024"} 
                          containerStyle={'my-6'} />
                        <CustomButton title={"Nhận ngay"} containerStyles={'w-3/4'} 
                          handlePress={() => {setCanExchangeVoucher(false); setModalVisible(false)}} />
                      </View>
                    ) : (
                      <View className='w-full my-2 items-center'>
                        <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalVisible(false)}>
                          <Ionicons name='close' size={28} color={'gray'} />
                        </TouchableOpacity>
                        <Text className="text-2xl font-psemibold text-center">Đổi thưởng lấy quà</Text>
                        <Text className="text-base text-gray-500 text-center">Cần đạt đủ các vật phẩm sau để đổi thưởng</Text>
                        {isError ? (
                            <Text className="text-base text-red text-center mt-3">Bạn chưa đạt điều kiện đổi thưởng</Text>
                        ) : null}

                        <View className="flex flex-row flex-wrap bg-white rounded-md shadow-lg my-6">
                        {listItems.map(item  => {
                                return (
                                    <View key={item} className="w-1/4 p-2">
                                        <Item imageUrl={"https://placehold.co/76x76"} amount={`1 ${item}`} />
                                    </View>
                                )
                            })}
                        </View>

                        <CustomButton title={"ĐỔI NGAY"} containerStyles={'w-3/4'}  handlePress={submit}/>
                      </View>
                    )}


                
                </View>

            </View>
        </Modal>
        <ScrollView>
          <View
            className="bg-white w-full flex-col relative"
            style={{
              minHeight: Dimensions.get("window").height - 50,
            }}
          >
            <HeaderAuth text="" otherStyle="absolute top-4 left-4 z-10" otherStyleIcon="rounded-full" />
            
            <Image source={{ uri: post.image }} className="w-full h-52 rounded-lg px-0" />
       
            <View className="flex flex-col px-4 ">
              <View className = 'flex-col space-y-1 my-2'>
                <Text className = 'text-black text-2xl font-psemibold'>{post.title}</Text>
                  <View className = 'flex-row items-center pl-2'>
                    <Ionicons name = 'calendar-clear-outline' size ={20} color = '#515151'/>
                    <Text className = 'text-grey-700 font-pregular text-base ml-2'>{post.startDate} - {post.endDate}</Text>
                  </View>
                  <View className = 'flex-row items-center justify-between  pl-2'>
                    <View className = 'flex-row items-center'>
                      <Ionicons name = 'play-circle-sharp' size ={20 } color = '#515151'/>
                      <Text className = 'text-grey-700 font-pregular text-base ml-2'>Lượt chơi: {post.turns}</Text>
                    </View>
                    <TouchableOpacity>
                      <Text className = 'text-primary font-psemibold text-base underline'>Thêm lượt</Text>
                    </TouchableOpacity>
                  </View>
              </View>

              <View className='my-3'>
                <View className = 'border-grey-200' style={{borderWidth:0.3, borderStyle:'dashed', borderRadius:1}}></View>
                <View className='flex-row space-y-1 my-2 justify-between'>
                  <View className='flex-row items-center space-x-2'>
                    <Image source={{ uri: post.avt }} className="w-10 h-10 rounded-lg" />
                    <Text className='text-black font-psemibold text-lg'>{post.brand}</Text>
                  </View>
                </View>
                <View 
                  className='border-grey-200 ' 
                  style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1 }}
                ></View>
              </View>

              {/* Noi dung game */}
              <View className='flex-col space-y-1'>
                <Text className='font-psemibold text-lg leading-6  tracking-wide text-primary'>
                  Trò chơi Quizz
                </Text>
                <TouchableOpacity onPress={handleToggle}>
                <Text className=' font-pegular text-base leading-5 tracking-wide'>
                  {expanded 
                    ? 'Lorem ipsum dolor sit amet consectetur. Massa nulla ipsum adipiscing orci donec et augue. Praesent dictum vivamus mauris tempus egestas nisi. Pretium integer non ut ornare mi vel sociis. Nec arcu quis risus quis arcu dapibus. Lacus diam quisque aliquam. Praesent dictum.'
                    : 'Lorem ipsum dolor sit amet consectetur. Massa nulla ipsum adipiscing orci donec et augue. Praesent dictum vivamus mauris tempus egestas nisi. Pretium integer non ut ornare mi vel sociis...'}
                </Text>
                  <Text className='text-grey-500 text-right font-pregular text-sm leading-6 underline tracking-wide'>
                    {expanded ? 'Thu gọn' : 'Xem thêm'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className='flex-col space-y-1 my-2'>
                <Text className='font-psemibold text-lg leading-6 tracking-wide text-primary'>
                  Phần thưởng
                </Text>
                <View className ='flex-row space-x-2 items-center'>
                  <Image source={icons.voucher} resizeMode="contain" className ='h-8 w-8 mt-1' />
                  <Text className ='font-psemibold text-base'>Trị giá 200.000 đồng</Text>
                </View> 

                <View className='flex gap-2'>
                  <Text className='font-pregular text-base'>Voucher được dùng khi mua hàng tại các chi nhánh của Brand trên khắp TP HCM</Text>
                  <Text className='font-pregular text-base'><Text className='font-psemibold'>Số lượng:</Text> 1000 vouchers</Text>
                  <Text className='font-pregular text-base'>
                    Bạn cần đạt được <Text className='font-psemibold'>100 Xu hoặc các mảnh ghép sau</Text> để đủ điều kiện đổi thưởng.
                  </Text>
                </View>

                <View className='flex-row'>
                  <CustomButton 
                    title="Chơi ngay" 
                    containerStyles="justify-center my-4 flex-grow mr-4"
                    textStyles='' 
                    handlePress={() => router.push("/games/shakeGame")}
                  />

                  <CustomButton 
                    title="Đổi thưởng" 
                    containerStyles="justify-center my-4 bg-white border border-primary flex-grow"
                    textStyles='text-primary' 
                    handlePress={() => {setModalVisible(true)}}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}


export default Details;
