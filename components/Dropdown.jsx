import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';


const Dropdown = ({
    listItems,
    setItem,
    customStyle
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentItem, setCurrentItem] = useState(listItems[0] || "None")

    const handleClickItem = (item) => {
        setItem(item);
        setIsOpen(false);
        setCurrentItem(item);
    }
    return (
        <TouchableOpacity className={` relative flex-row items-center w-full h-[48px] rounded-md border border-gray-300 ${customStyle}`} 
            onPress={() =>  setIsOpen(!isOpen)} >
            <View className='p-2'>
                <Ionicons name='caret-down' size={24} color={"black"}></Ionicons>
            </View>
            <Text className='text-base font-pmedium text-gray-700'>{currentItem}</Text>

            {isOpen ? (
                <View className={`bg-gray border w-full top-[50px] border-gray-400 rounded-md absolute`}>
                    {listItems.map(item  => {
                        return (
                            <TouchableOpacity key={item} className='bg-gray-50 p-2 border border-gray-100' 
                                onPress={() => handleClickItem(item)}>
                                <Text className='text-base font-pmedium text-gray-500'>{item}</Text>
                            </TouchableOpacity>
                        )
                    })}                            
                </View>
            ) : null}
        </TouchableOpacity>
    )
}

export default Dropdown