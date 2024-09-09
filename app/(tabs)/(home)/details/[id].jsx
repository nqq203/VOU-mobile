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
  TextInput,Alert,
  AppState,
  Modal, ActivityIndicator
} from "react-native";
import { CustomButton, HeaderAuth, Loader} from "../../../../components";
import { icons } from "../../../../constants";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import Item from "../../../../components/item";
import Voucher from "../../../../components/Voucher";
import {images} from "../../../../constants";
import Dropdown from "../../../../components/Dropdown";
import Notification from "../../../../components/Notification";
import { callAPIGetPost,callApiGetUserTurns } from "../../../../api/events";
import moment from "moment";
import * as SecureStore from 'expo-secure-store';
import { callApiExchangeVoucher } from "../../../../api/voucher";
import { Share,Platform } from "react-native";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { callApiAddTurn, callApiGiveTurn } from "../../../../api/turn";
import {callApiAskForTurn} from "../../../../api/games";

const Details = () => {
  const {id} = useLocalSearchParams();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // Pop up Doi thuong
  const [listItems, setListItems] = useState([])
  const [qrCode, setQrCode] = useState("");
  
  const [canExchangeVoucher, setCanExchangeVoucher] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isExchangeError, setIsExchangeError] = useState(false);

  // Xin luot
  const [modalTurnVisible, setModalTurnVisible] = useState(false);
  const [modalAskForTurnVisible, setModalAskForTurnVisible] = useState(false);
  const [isTurnError, setIsTurnError] = useState(false);
  const [turns, setTurns] = useState(10);
  const [turnResult, setTurnResult] = useState("")

  const listOptions = ['Mã ID', 'Email', 'Tên tài khoản']
  const [option, setOption] = useState(listOptions[0])
  const [form, setForm] = useState({
    typeOfInfo: '',
    info:'',
  })
  const [isAskingForTurn, setIsAskingForTurn] = useState(false);

  const [turnInfo, setTurnInfo] = useState("")
  const [user, setUser] = useState();
  const shakeGameDescription = "Lắc Xu là game tương tác, trong đó người dùng lắc điện thoại để nhận các vật phẩm ngẫu nhiên như xu, quà, hoặc điểm thưởng. Các vật phẩm thu thập được có thể dùng để đổi lấy phần thưởng hấp dẫn, tạo cảm giác hứng thú và hồi hộp khi chơi."
  const quizGameDescription = "Quiz là game tương tác, nơi người dùng cùng xem livestream và trả lời các câu hỏi trong thời gian thực. Người chơi tham gia qua thiết bị cá nhân, cạnh tranh với nhau bằng cách chọn câu trả lời đúng nhanh nhất, tạo nên trải nghiệm học hỏi và giải trí trực tiếp."

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState('');

  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('active')
        if(turnResult != "") {
          setDialogTitle("success");
          setDialogMessage(turnResult);          
          setDialogVisible(true);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove(); // Cleanup the event listener
    };
  }, []);

  const [post, setPost] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [userTurns, setUserTurns] = useState(0); 
  const [isFetchingTurns, setIsFetchingTurns] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let user = await SecureStore.getItemAsync("user");
        // console.log(user);
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

  useEffect(() => {
    const fetchPostAndTurns = async () => {
      setIsLoading(true); 
      setIsFetchingTurns(true); 
      try {
        const res = await callAPIGetPost(id);
        if (res.success) {
          setPost(res.metadata);
          console.log(post)
          // setModalVisible(res.metadata?.gameInfoDTO?.isVoucherCode);  
          setListItems(res.metadata.inventoryInfo?.items);
          setQrCode(res.metadata.inventoryInfo.voucher_code);

          if (user?.idUser !== null) {
            console.log("post:", res.metadata?.gameInfoDTO)
            
            const turnRes = await callApiGetUserTurns(user.idUser, res.metadata?.gameInfoDTO?.gameId);
            console.log("turnRes:", turnRes) 
            if (turnRes.success) {
              
                setUserTurns(turnRes.metadata.turns); 
              
            }
            else {
              if (turnRes?.message ==='Không tìm thấy lượt chơi')
                {
                  setUserTurns(10)
                }
                else{
              setUserTurns(0)}
              console.log(turnRes.message)
            }
          }
        } 

        
      } catch (error) {
        console.log("Error fetching post or turns:", error);
      } finally {
        setIsLoading(false); 
        setIsFetchingTurns(false);
      }
    };
    fetchPostAndTurns();
  }, [id, user]);


  // Exchange gift form
  const submit = async () => {
    console.log(user);
      try {
        const result = await callApiExchangeVoucher(post?.inventoryInfo?.voucher_code,user.idUser);
        console.log(result);
        if (result.success === true){
          setCanExchangeVoucher(true)
        }
        else{
          setIsExchangeError(true);
          console.log("Error",result.message);
        }
      } catch (error) {
        setIsExchangeError(true);
        console.log("Result: ",error);
      }
  }
  if (isLoading || isFetchingTurns) {
    return (
      <SafeAreaView className="bg-white flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#EA661C" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  
  const askForTurnFacebook = async () => {
    // title, message, url, image
    const title = post.eventName;
    const message = "Tham gia ngay sự kiện " + title + " trên ứng dụng VOU \n" +
      "Cơ hội nhận được \"" + post.inventoryInfo?.voucher_name + "\" trị giá " + post.inventoryInfo?.voucher_price + "VND";
    const url = post.imageUrl || "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_square.jpg";

    // Download the image
    const messageAndUrl = message.concat("\n\n").concat(url);
    try {
      const uri = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + "tmp.png");
      console.log( "URI:",uri.uri); // Prints the local image file URI
  
      // Share the content
      let result;
      if (Platform.OS === 'ios') {
        // For iOS, use the Sharing module to share the file directly
        result = await Sharing.shareAsync(uri.uri, {
          dialogTitle: title,
          mimeType: 'image/png',
          UTI: 'image/png',
        });
      } else {
        // For Android, share the message and image URI together
        result = await Share.share(
          {
            title,
            message: messageAndUrl,
            url: uri.uri,
          },
          {
            subject: title,
          }
        );
      }


      if (result.action === Share.sharedAction) {
          if (result.activityType) {
          console.log('Shared via activity:', result.activityType);
        } else {
          console.log('Shared without specifying an activity');
        }
        setModalTurnVisible(false);

        const resultAdd = await callApiAddTurn(user.idUser,post?.gameInfoDTO?.gameId)
        console.log("AddTurn; ",resultAdd)
        if(resultAdd.success){
          setTurnResult(resultAdd.message);
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const askForTurnFromFriend = () => {
    console.log("Send noti to friend")

    setIsAskingForTurn(true);
    setModalTurnVisible(false);
    setModalAskForTurnVisible(true);
  }

  // giveTurnToFriend
  const giveTurnToFriend = () => {
    console.log("Give turn to friend")
    setIsAskingForTurn(false);
    setModalTurnVisible(false);
    setModalAskForTurnVisible(true);
  }

  const handlePlayGame = () => {
    if (userTurns <= 0) {
      Alert.alert("Thông báo", "Bạn đã hết lượt chơi, vui lòng thêm lượt hoặc quay lại sau!");
    } else {
      router.push({
        pathname: "/games/shakeGame",
        params: { gameId: post?.gameInfoDTO?.gameId, username: user.username },
      });
    }
  };

  const sendRequestTurn = async () => {
    if( turnInfo === '' || option === ''){
      setIsTurnError(true);
      return;
    }
    setIsTurnError(false);

    if(isAskingForTurn){
      // code gửi noti xin lượt 
      console.log("Info: ",turnInfo);

      if (user?.username)
        {
          console.log(form, user.username);
           await callApiAskForTurn({sender: user.username, receiver: turnInfo});
        }
    } else {
      // code tặng lượt cho bạn bè
      console.log("Info: ",turnInfo);
      
      const turnData = {
        username: turnInfo,
        email: null,
        receiverId: null,
        idGame: post?.gameInfoDTO?.gameId,
        turns: 1
      }
      console.log(turnData)

      const result = await callApiGiveTurn(turnData)
      console.log("Give turn to friens; ",result)
      if(result.success){
        // setUserTurns(userTurns-1);

        setDialogTitle("success");
        setDialogMessage(result.message);
        setDialogVisible(true)
      } else {
        setDialogTitle("");
        setDialogMessage("Tặng lượt không thành công");
        setDialogVisible(true)
      }
      
    }

    setModalAskForTurnVisible(false);
    setTurnInfo("");
    setOption(listOptions[0]);
    // setDialogTitle("success");
    // setDialogMessage("Gửi/Tặng lượt thành công");
    // setDialogVisible(true)
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
                        <Voucher isOnline={false} voucherImg={post?.inventoryInfo?.imageUrl} 
                          voucherName={post?.inventoryInfo?.voucher_name} voucherExpire={post?.inventoryInfo?.expiration_date} />
                        <CustomButton title={"Nhận ngay"} containerStyles={'w-3/4'} 
                          handlePress={() => { setCanExchangeVoucher(false); setModalVisible(false)}} />
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
                <View className='flex bg-white px-4 pb-4 pt-3 w-[360px] items-center rounded-lg'>
                    <TouchableOpacity className='flex-row-reverse w-full' onPress={() => setModalTurnVisible(false)}>
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
                    <CustomButton title={"Tặng lượt cho bạn bè"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={giveTurnToFriend} icon={"turn1"} iconStyle={'w-8 h-6'}/>
                    <CustomButton title={"Chia sẻ Facebook"}  containerStyles={'w-full bg-white border border-primary my-2'} textStyles={'text-black font-pmedium'}
                        handlePress={askForTurnFacebook} icon={"facebook"}/>
                    
                </View>
            </View>
        </Modal>

        {/* Modal ask for turn from friends */}
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
                    <Text className="text-base text-gray-500 text-center">Nhập username để gửi đến đúng người nhé</Text>
                    {isTurnError ? (
                        <Text className="text-base text-red text-center mt-3">Thông tin chưa hợp lệ. Vui lòng kiểm tra lại</Text>
                    ) : null}

                    <View className='relative w-full'>
                        <Text className="text-lg font-pregular mt-2">Username</Text>
                    </View>
                    <TextInput
                        placeholder='Nhập nội dung'
                        placeholderTextColor={'#949494'}
                        value={turnInfo}
                        onChange={(e) => setTurnInfo(e.nativeEvent.text)}
                        className="h-[48px] mt-2 mb-6 p-2 rounded-md border border-gray-200 w-full text-base font-pmedium "
                    />

                    <CustomButton title={"GỬI"}  containerStyles={'w-full'} handlePress={sendRequestTurn}/>
                
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
            className="bg-white w-full flex-col relative"
            style={{
              minHeight: Dimensions.get("window").height - 50,
            }}
          >
          {/* {loading ? (
            <Loader isLoading={loading} />
          ) : ( */}
            <>
            <View className = {`flex-row items-center justify-center  w-full h-12 absolute top-4 left-4 z-10`}>
              <TouchableOpacity className = {`bg-white w-12 h-12 items-center justify-center absolute left-0 rounded-xl shadow-md border border-gray-100 `} 
                onPress={() => {
                  router.push('/home')
                }}>
                <Ionicons name="chevron-back" size={24} color="#000"  />
              </TouchableOpacity>
            </View>
            
            <Image source={{ uri: post.imageUrl || "https://via.placeholder.com/200" }} className="w-full h-52 rounded-lg px-0" />
       
            <View className="flex flex-col px-4 ">
              <View className = 'flex-col space-y-1 my-2'>
                <Text className = 'text-black text-2xl font-psemibold'>{post.eventName}</Text>
                  <View className = 'flex-row items-center pl-2'>
                    <Ionicons name = 'calendar-clear-outline' size ={22} color = '#515151'/>
                    <Text className = 'text-black font-pregular text-base ml-2'>{moment(post.startDate).format('DD/MM/YYYY')} - {moment(post.endDate).format('DD/MM/YYYY')}</Text>
                  </View>
                  {post.gameInfoDTO?.gameType === 'shake-game' ? (
                  <View className = 'flex-row items-center justify-between  pl-2'>
                    <View className = 'flex-row items-center'>
                      <Ionicons name = 'play-circle-sharp' size ={20 } color = '#515151'/>
                      <Text className = 'text-grey-700 font-pregular text-base ml-2'>Lượt chơi: {userTurns|| 0}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {setModalTurnVisible(true)}}>
                      <Text className = 'text-primary font-psemibold text-base underline'>Thêm lượt</Text>
                    </TouchableOpacity>
                  </View>
                  ) : 
                  (
                    <View className = 'flex-row items-center justify-between  pl-2'>
                      <View className = 'flex-row items-center'>
                        <Ionicons name = 'time' size ={20 } color = '#515151'/>
                        <Text className = 'text-black font-pregular text-base ml-2'>Thời gian chơi: {moment(post?.gameInfoDTO?.startedAt).utcOffset(420, true).format('HH:mm:ss DD/MM/YYYY') + " "}
                    </Text>
                      </View>
                     
                    </View>
                  )}
              </View>

              <View className='my-3'>
                <View className = 'border-grey-200' style={{borderWidth:0.3, borderStyle:'dashed', borderRadius:1}}></View>
                <View className='flex-row space-y-1 my-2 justify-between'>
                  <View className='flex-row items-center space-x-2'>
                    <Image source={{ uri: post.brandLogo || "https://via.placeholder.com/50" }} className="w-10 h-10 rounded-lg" />
                    <Text className='text-black font-psemibold text-lg'>{post.brandId ? post.brandId[0]?.nameBrand : post.brandName}</Text>
                  </View>
                </View>
                <View 
                  className='border-grey-200 ' 
                  style={{ borderWidth: 0.3, borderStyle: 'dashed', borderRadius: 1 }}
                ></View>
              </View>
              {post.brandId && post.brandId.length > 1 ? (
                <View className='flex-col space-y-1 mb-2'>
                  <Text className='font-psemibold text-lg leading-6 tracking-wide text-primary'>
                    Hợp tác
                  </Text>
                  <Text className='text-base font-pregular'>Sự kiện có sự tham gia của các brand: {post.brandId.slice(1).map((brand) => brand.nameBrand).join(", ")}
                  </Text>
                </View>
              ) : (
                <></>
              )}
             
                
              {/* Noi dung game */}
              <View className='flex-col space-y-1'>
              <Text className='font-psemibold text-lg leading-6 tracking-wide text-primary'>
                {post.gameInfoDTO?.gameType === 'shake-game' ? 'Trò chơi lắc xu' : 'Trò chơi Quiz'}
              </Text>

                <TouchableOpacity onPress={handleToggle}>

                {post.gameInfoDTO?.gameType === 'shake-game' ? (
                <Text className=' font-pegular text-base leading-5 tracking-wide'>
                  {expanded 
                    ? 'Lắc Xu là game tương tác, trong đó người dùng lắc điện thoại để nhận các vật phẩm ngẫu nhiên như xu, quà, hoặc điểm thưởng. Các vật phẩm thu thập được có thể dùng để đổi lấy phần thưởng hấp dẫn, tạo cảm giác hứng thú và hồi hộp khi chơi.'
                    : 'Lắc Xu là game tương tác, trong đó người dùng lắc điện thoại để nhận các vật phẩm ngẫu nhiên như xu, quà, hoặc điểm thưởng. Các vật phẩm thu thập được có thể dùng để đổi lấy phần thưởng hấp dẫn,...'}
                </Text>
                ) : (
                  <Text className=' font-pegular text-base leading-5 tracking-wide'>
                  {expanded 
                    ? 'Quiz là game tương tác, nơi người dùng cùng xem livestream và trả lời các câu hỏi trong thời gian thực. Người chơi tham gia qua thiết bị cá nhân, cạnh tranh với nhau bằng cách chọn câu trả lời đúng nhanh nhất, tạo nên trải nghiệm học hỏi và giải trí trực tiếp.'
                    : 'Quiz là game tương tác, nơi người dùng cùng xem livestream và trả lời các câu hỏi trong thời gian thực. Người chơi tham gia qua thiết bị cá nhân,...'}
                </Text>
                )
              }
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
                    <Text className='font-pregular text-base'>Trị giá: 
                      <Text className="font-psemibold text-primary">
                      {" " + post?.inventoryInfo?.voucher_price + " VND"} 
                      </Text>
                    </Text>
                    <Text className='font-pregular text-base'>
                        Số lượng:
                      <Text className='font-psemibold text-primary'>
                        {" " + post?.numberOfVouchers + " mã giảm giá"}
                      </Text> 
                    </Text>
                    <Text className='font-pregular text-base'>Chi tiết: {post?.inventoryInfo?.voucher_description}</Text>
                    <Text className='font-pregular text-base'>
                      Bạn cần đạt được 
                      <Text className='font-psemibold text-primary'> 
                       {post?.inventoryInfo?.aim_coin ?  ` ${post?.inventoryInfo?.aim_coin} Xu hoặc` : ""} các mảnh ghép sau
                      </Text> để đủ điều kiện đổi thưởng.
                    </Text>
                    <View className="flex self-center flex-row flex-wrap bg-white rounded-md my-6 mb-2">
                      {listItems.map(item => (
                        <View key={item.idItem} className="w-1/4 p-2">
                          <Item imageUrl={item?.imageUrl} amount={`${item?.itemName}`} />
                        </View>
                      ))}
                    </View>
                  </View>
                   <View className='flex-row'>
                   <CustomButton 
                     title="Chơi ngay" 
                     containerStyles="justify-center my-4 flex-grow mr-4"
                     textStyles='' 
                     handlePress={() => router.push({
                       pathname: "/games/shakeGame",
                       params: { gameId: post?.gameInfoDTO?.gameId, username: user.username , idUser: user.idUser},
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
                  <Text className='font-pregular text-base'>Trị giá: 
                    <Text className="font-psemibold text-primary">
                    {" " + post?.inventoryInfo?.voucher_price + " VND"} 
                    </Text>
                  </Text>
                  <Text className='font-pregular text-base'>Chi tiết: {post?.inventoryInfo?.voucher_description}</Text>
                  <Text className='font-pregular text-base'>
                    Để nhận voucher, hãy tham gia chơi game vào lúc 
                    <Text className="font-psemibold text-primary text base">
                      {" " + moment(post?.gameInfoDTO?.startedAt).utcOffset(420, true).format('HH:mm:ss DD/MM/YYYY') + " "}
                    </Text>
                    để nhận ngay voucher.
                  </Text>

                  <Text className="text-base font-psemibold text-primary">Lưu ý: 
                    <Text className="text-base font-pregular text-black">
                      {" " + "Bấm Chơi ngay trước 1 phút game bắt đầu để có thể tham gia game thành công"}
                    </Text>
                  </Text>

                  <CustomButton 
                    title="Chơi ngay" 
                    containerStyles="justify-center my-4 flex-grow"
                    textStyles='' 
                    handlePress={() => {
                      const currentTime = moment().toLocaleString();
                      console.log(post?.gameInfoDTO?.startedAt)
                      const startedAt =moment(post?.gameInfoDTO?.startedAt).utcOffset(420, true).format('YYYY-MM-DDTHH:mm:ss.SSSZ');
                      const timeDifference = moment(startedAt).diff(moment(currentTime), 'seconds');

                      console.log("startedAt", startedAt, "currentTime", currentTime, "timeDifference", timeDifference);
                      
                      if (timeDifference > 0 && timeDifference <= 60) {
                        router.push({
                          pathname: "/games/waiting-room",
                          params: { 
                            room: post?.idEvent, 
                            username: user.username,
                            remainingTime: timeDifference,
                            eventId: post?.idEvent,
                            eventName: post?.eventName
                          },
                        });
                      } else if (timeDifference > 60) {
                        setDialogTitle("");
                        setDialogMessage("Chưa tới giờ chơi. Vui lòng quay lại sau!");
                        setDialogVisible(true);
                      } else {
                        setDialogTitle("");
                        setDialogMessage("Trò chơi đã bắt đầu. Bạn không thể tham gia được nữa :(");
                        setDialogVisible(true);
                      }
                    }}
                  />

                  </View>
                  

                )}
           

                
              </View>
            </View>
            </>  
          {/* )} */}
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}


export default Details;
