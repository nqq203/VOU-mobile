import EventNotification from '../components/EventNotification'
import { HeaderAuth } from '../components'
import { SafeAreaView, View, Text, Dimensions,ScrollView} from 'react-native'

const Notification = () => {
  return (
    <SafeAreaView className="bg-bg h-full"> 
    <ScrollView>
    <View
      className="bg-bg w-full flex-col py-8 px-4"
      style={{
        minHeight: Dimensions.get("window").height - 50,
      }}
    >
      <View className="flex-col justify-center my-4 gap-4">
        <HeaderAuth otherStyle="absolute top-5 left-4 z-10"></HeaderAuth>
        <View className=''>
          <Text className="text-2xl w-full text-center text-black font-pbold leading-8 
            mt-3 ml-3">
            Thông báo sự kiện
          </Text>
        </View>
      </View>

      <View className="flex flex-col items-center justify-center">
        <EventNotification title={'Sự kiện 10 năm sắp kết thúc'} 
          description={"Sự kiện sinh nhật 10 năm của Grab sắp kết thúc rồi. Hãy nhanh tay chơi ngay để nhận những phần thưởng cuối cùng nhé!"} 
          time={"20 phút trước"} isSeen={false} />
        <EventNotification title={'Sự kiện 10 năm sắp kết thúc 2'} 
          description={"Sự kiện sinh nhật 10 năm của Grab sắp kết thúc rồi. Hãy nhanh tay chơi ngay để nhận những phần thưởng cuối cùng nhé!!!!"} 
          time={"20 phút trước"} isSeen={false}/>
        <EventNotification title={'Sự kiện 10 năm sắp kết thúc 3'} 
          description={"Sự kiện sinh nhật 10 năm của Grab sắp kết thúc rồi. Hãy nhanh tay chơi ngay để nhận những phần thưởng cuối cùng nhé!!!!"} 
          time={"1 ngày trước"}  />
        <EventNotification title={'Sự kiện 10 năm sắp kết thúc 3'} 
          description={"Sự kiện sinh nhật 10 năm của Grab sắp kết thúc rồi. Hãy nhanh tay chơi ngay để nhận những phần thưởng cuối cùng nhé!!!!"} 
          time={"1 ngày trước"} />
      </View>
      

    </View>
    </ScrollView>
  </SafeAreaView>
  )
}

export default Notification