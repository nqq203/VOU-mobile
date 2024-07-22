

import {View, Text, Image} from 'react-native';
import { images } from "../constants/index";
import { Link } from "expo-router";

const FooterAuth = ({text, textLink, url}) => {
  return (
    <View className="justify-center items-center flex-column space-y-5 absolute bottom-5 self-center">
              <Image source={images.logoBig} 
                className= 'w-full opacity-50' resizeMode="contain" />
              <View className="flex-row items-center space-x-2 text-sm font-pregular">
              <Text className="text-grey-500 ">
                {text}
              </Text>
              <Link
                  href={url}
                  className="text-primary"
              >
                {textLink}
              </Link>
            </View>
       
            </View>
  );
}
export default FooterAuth;