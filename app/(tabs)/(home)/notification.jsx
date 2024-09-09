import {EventNotification} from '../../../components';
import { HeaderAuth } from '../../../components';
import { SafeAreaView, View, Text, Dimensions, ScrollView, Image } from 'react-native';
import { callApiGetNoti } from '../../../api/events';
import * as SecureStore from 'expo-secure-store';
import React, { useState, useEffect } from 'react';

const Notification = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userString = await SecureStore.getItemAsync('user');
      if (userString) {
        const parsedUser = JSON.parse(userString);
        setUser(parsedUser);

        const notiRes = await callApiGetNoti(parsedUser?.username);
        if (notiRes.success) {
          setPosts(notiRes.metadata || []);
          console.log(notiRes.metadata);
          setIsLoading(false);
        } else {
          console.log(notiRes.message);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user?.id]);

  return (
    <SafeAreaView className="bg-bg h-full">
      <ScrollView>
        <View
          className="bg-bg w-full flex-col py-8 px-4"
          style={{
            minHeight: Dimensions.get('window').height - 50,
          }}
        >
          <HeaderAuth text={'Thông báo'}/>

          <View className="flex flex-col items-center justify-center">
            {isLoading ? (
              <Text>Loa12ding...</Text>
            ) :( posts.length === 0 ? (
              <Text>No notifications available.</Text>
            ) : (
              posts?.map((post, key) => (
                
                <View className={`flex flex-row align-middle justify-center my-1 p-2
                  bg-gray-100 rounded-lg border border-gray-100 `}
         
                 style={[{minWidth: "500px"}]}
                >
                 
                 <View className="w-[80px] h-[80px] rounded-full bg-active mx-2 mt-1 overflow-hidden">
                        <Image source={{uri: 'https://placehold.co/80x80'}}
                        className="w-full h-full " />
                    </View>
            
                    <View className="flex flex-col justify-center"
                        style={{width: Dimensions.get("window").width - 128}}
                    >
                        <Text className="text-lg font-psemibold">{post?.message}</Text>
                        <Text className="text-base font-pregular text-gray-500">{post?.numDay === 0 ? 'Hôm nay' : `${post?.numDay} ngày nữa`}</Text>
                    </View>
                </View>
              )
              //
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Notification;
