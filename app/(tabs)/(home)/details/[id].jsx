import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Image,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal
} from "react-native";
import { CustomButton, HeaderAuth} from "../../../../components";
import { icons } from "../../../../constants";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import Item from "../../../../components/item";
import Voucher from "../../../../components/Voucher";
import {images} from "../../../../constants";
import Dropdown from "../../../../components/Dropdown";
import { callAPIGetPost } from "../../../../api/events";
import moment from "moment";
import * as SecureStore from 'expo-secure-store';
import { useQuery } from "react-query";
import { callApiExchangeVoucher } from "../../../../api/voucher";

const Details = () => {
  // const {user} = useGlobalContext();
  const {id} = useLocalSearchParams();
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigation();
  const handleToggle = () => {
    setExpanded(!expanded);
  };
  console.log("ID",id);

  // Pop up Doi thuong
  const [listItems, setListItems] = useState([])
  const [qrCode, setQrCode] = useState("");
  
  const [canExchangeVoucher, setCanExchangeVoucher] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isExchangeError, setIsExchangeError] = useState(false);

  const [modalTurnVisible, setModalTurnVisible] = useState(false);
  const [modalAskForTurnVisible, setModalAskForTurnVisible] = useState(false);
  const [isTurnError, setIsTurnError] = useState(false);
  const listOptions = ['Mã ID', 'Email', 'Số điện thoại']
  const [option, setOption] = useState('')
  const [form, setForm] = useState({
    typeOfInfo: '',
    info:'',
  })
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await SecureStore.getItemAsync("user");
        if (user) {
          user = JSON.parse(user);
          setUser(user);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
  const [post, setPost] = useState({});

  useEffect(() => {
  const fetchPost = async () => {
    try {
      const res = await callAPIGetPost(id);
      if (res.success){
        console.log("Dtaa",res);
        setPost(res.metadata);
        setListItems(res.metadata.inventoryInfo?.items);
        setQrCode(res.metadata.inventoryInfo.voucher_code);
      }
    } catch (error) {
      console.log("Erpror",error);
    }
  };
  fetchPost();
}, []);

  // Exchange gift form
  const submit = async () => {
      try {
        const result = await callApiExchangeVoucher(post?.inventoryInfo?.voucher_code,user.idUser);
        console.log(result);
        if (result.success === true){
          setCanExchangeVoucher(true);
        }
        else{
          // Alert.alert("Error", result.message);
          setIsExchangeError(true);
          console.log("Error",result.message);
        }
      } catch (error) {
        setIsExchangeError(true);
        console.log("Result: ",error);
      }
  }

  
  const askForTurnFacebook = () => {
    console.log("Facebook")
  }

  const askForTurnFromFriend = () => {
    setModalTurnVisible(false);
    setModalAskForTurnVisible(true);
  }

  const sendRequestTurn = () => {
    if(option === 'Mã ID') {
        form.typeOfInfo = 'id'
    } else if(option === 'Email'){
        form.typeOfInfo = 'email'
    } else if(option === 'Số điện thoại'){
        form.typeOfInfo = 'phone'
    }

    if( form.info === '' || form.typeOfInfo === ''){
        setIsTurnError(true);
        return;
    }

    console.log(form);
    setModalAskForTurnVisible(false);
    setModalTurnVisible(true);
    setForm({
        typeOfInfo: '',
        info:'',
        itemName: '',
        amount: '',
    })    
    setIsTurnError(false);
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
                        {isExchangeError ? (
                            <Text className="text-base text-red text-center mt-3">Bạn chưa đạt điều kiện đổi thưởng</Text>
                        ) : null}

                        <View className="flex flex-row flex-wrap bg-white rounded-md shadow-lg my-6">
                        {listItems.map(item  => {
                                return (
                                    <View key={item?.idItem} className="w-1/4 p-2">
                                        <Item imageUrl={item?.imageUrl} amount={`${item?.itemName}`} />
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

        {/* Modal Turn */}
        <Modal 
            visible={modalTurnVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalTurnVisible(false)}>
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thêm lượt chơi</Text>
                    
                    <View className='flex-row gap-3 my-4 items-center'>
                        <Image className='w-14 h-14 resize' source={images.turn1}/>
                        <Image className='w-16 h-16 resize' source={images.turn2}/>
                        <Image className='w-16 h-16 resize' source={images.turn3}/>
                    </View>

                    <CustomButton title={"Xin lượt từ bạn bè"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={askForTurnFromFriend} icon={"friends"} iconStyle={'w-8 h-6'}/>
                    <CustomButton title={"Chia sẻ Facebook"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={askForTurnFacebook} icon={"facebook"}/>
                    
                </View>
            </View>
        </Modal>

        {/* Modal ask for turn  from friends */}
        <Modal 
            visible={modalAskForTurnVisible} 
            transparent={true}
            onRequestClose={() => {console.log("Close")}}
        >
            <View className="bg-gray-500/[0.5] flex-1 items-center justify-center">
                <View className='flex  bg-white px-3 pb-4 pt-3 w-[360px] items-center rounded-md'>
                    <TouchableOpacity className='flex-row-reverse w-full pr-2' onPress={() => setModalAskForTurnVisible(false)}>
                        <Ionicons name='close' size={28} color={'gray'} />
                    </TouchableOpacity>
                    <Text className="text-2xl font-psemibold">Thông tin bạn bè</Text>
                    <Text className="text-base text-gray-500 text-center">Chọn mã ID/Email/Số điện thoại và điền thông tin tương ứng để gửi đến đúng người nhé</Text>
                    {isTurnError ? (
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

                    <CustomButton title={"GỬI"}  containerStyles={'w-full'} handlePress={sendRequestTurn}/>
                
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
            
            <Image source={{ uri: post.imageUrl }} className="w-full h-52 rounded-lg px-0" />
       
            <View className="flex flex-col px-4 ">
              <View className = 'flex-col space-y-1 my-2'>
                <Text className = 'text-black text-2xl font-psemibold'>{post.eventName}</Text>
                  <View className = 'flex-row items-center pl-2'>
                    <Ionicons name = 'calendar-clear-outline' size ={20} color = '#515151'/>
                    <Text className = 'text-grey-700 font-pregular text-base ml-2'>{moment(post.startDate).format('DD/MM/YYYY')} - {moment(post.endDate).format('DD/MM/YYYY')}</Text>
                  </View>
                  <View className = 'flex-row items-center justify-between  pl-2'>
                    <View className = 'flex-row items-center'>
                      <Ionicons name = 'play-circle-sharp' size ={20 } color = '#515151'/>
                      <Text className = 'text-grey-700 font-pregular text-base ml-2'>Lượt chơi: {post.turns || -1}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {setModalTurnVisible(true)}}>
                      <Text className = 'text-primary font-psemibold text-base underline'>Thêm lượt</Text>
                    </TouchableOpacity>
                  </View>
              </View>

              <View className='my-3'>
                <View className = 'border-grey-200' style={{borderWidth:0.3, borderStyle:'dashed', borderRadius:1}}></View>
                <View className='flex-row space-y-1 my-2 justify-between'>
                  <View className='flex-row items-center space-x-2'>
                    <Image source={{ uri: post.brandLogo }} className="w-10 h-10 rounded-lg" />
                    <Text className='text-black font-psemibold text-lg'>{post.brandId ? post.brandId[0]?.nameBrand : post.brandName}</Text>
                  </View>
                </View>
                <View 
                  className='border-grey-200 ' 
                  style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1 }}
                ></View>
              </View>

              {/* Noi dung game */}
              <View className='flex-col space-y-1'>
              <Text className='font-psemibold text-lg leading-6 tracking-wide text-primary'>
                {post.gameInfoDTO?.gameType === 'shake-game' ? 'Trò chơi lắc xu' : 'Trò chơi Quiz'}
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
                  <Text className ='font-psemibold text-base'>{post?.inventoryInfo?.voucher_name}</Text>
                </View> 

                {post.gameInfoDTO?.gameType === 'shake-game' ? (
                  <View>
                  <View className='flex gap-2'>
                    <Text className='font-pregular text-base'>Chi tiết: {post?.inventoryInfo?.voucher_description}</Text>
                    <Text className='font-pregular text-base'><Text className='font-psemibold'>Số lượng:</Text> {post?.numberOfVouchers} mã giảm giá</Text>
                    <Text className='font-pregular text-base'>
                      Bạn cần đạt được <Text className='font-psemibold'>100 Xu hoặc các mảnh ghép sau</Text> để đủ điều kiện đổi thưởng.
                    </Text>
                    <View className="flex self-center flex-row flex-wrap bg-white rounded-md my-6 mb-2">
                      {listItems.map(item => (
                        <View key={item} className="w-1/4 p-2">
                          <Item imageUrl={item?.imageUrl} amount={`1 ${item?.itemName}`} />
                        </View>
                      ))}
                    </View>
                  </View>
                   <View className='flex-row'>
                   <CustomButton 
                     title="Chơi ngay" 
                     containerStyles="justify-center my-4 flex-grow mr-4"
                     textStyles='' 
                    //  handlePress={() => router.push("/games/shakeGame")}
                     handlePress={() => router.push({
                       pathname: "/games/shakeGame",
                       params: { gameId: post?.gameInfoDTO?.gameId, username: user.username },
                     })}
                   />
                   
                   <CustomButton 
                     title="Đổi thưởng" 
                     containerStyles="justify-center my-4 bg-white border border-primary flex-grow"
                     textStyles='text-primary' 
                     handlePress={() => {setModalVisible(true)}}
                   />
                 </View>
                 </View>
                ) : (
                  <View className='flex gap-2'>
                    <Text className='font-pregular text-base'>Chi tiết: {post?.inventoryInfo?.voucher_description}</Text>
                  <Text className='font-pregular text-base'>
                    Để nhận voucher, hãy chơi game vào lúc {moment(post?.gameInfoDTO?.startedAt).utcOffset(0).format("HH:mm:ss DD/MM/YYYY")} để nhận ngay voucher.
                  </Text>

                  <CustomButton 
                    title="Chơi ngay" 
                    containerStyles="justify-center my-4 flex-grow mr-4"
                    textStyles='' 
                    handlePress={() => {
                      const currentTime = moment().toLocaleString();
                      console.log(post?.gameInfoDTO?.startedAt)
                      const startedAt =moment(post?.gameInfoDTO?.startedAt).utcOffset(420, true).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                      // const newTime = moment(startedAt).subtract(7, 'hours').format('YYYY-MM-DDTHH:mm:ss.SSSZ');

                      const timeDifference = moment(startedAt).diff(moment(currentTime), 'seconds');

                      console.log("startedAt", startedAt, "currentTime", currentTime, "timeDifference", timeDifference);
                      
                      if (timeDifference > 0 && timeDifference <= 60) {
                        router.push({
                          pathname: "/games/waiting-room",
                          params: { 
                            room: post?.idEvent, 
                            username: user.username,
                            remainingTime: timeDifference,
                            eventId: post?.idEvent
                          },
                        });
                      } else if (timeDifference > 60) {
                        alert("Chưa tới giờ chơi. Vui lòng quay lại sau!");
                      } else {
                        alert("Trò chơi đã bắt đầu. Vui lòng tham gia ngay!");
                      }
                    }}
                  />

                  </View>
                  

                )}
           

                
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}


export default Details;
