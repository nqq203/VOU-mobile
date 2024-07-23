import { useState } from "react";
import { router, usePathname } from "expo-router";
import { View, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { icons } from "../constants";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-12 px-4 bg-white rounded-xl border border-grey-200 focus:border-grey-900">
      
      <TextInput
        className="text-sm mt-0.5 text-grey-900 flex-1 font-pregular"
        value={query}
        placeholder="Search"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (query === "")
            return Alert.alert(
              "Missing Query",
              "Please input something to search results across database"
            );

          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Ionicons name='search' size={20} color="#BCBCBC"/>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
