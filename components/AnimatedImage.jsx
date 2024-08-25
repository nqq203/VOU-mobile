import React, { useEffect, useState,useRef } from "react";
import { Animated, Easing } from "react-native";

const AnimatedImage = ({ source, containerStyle }) => {
  const tiltAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startTiltAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(tiltAnimation, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(tiltAnimation, {
            toValue: -1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startTiltAnimation();
  }, [tiltAnimation]);

  const rotate = tiltAnimation.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-5deg", "5deg"],
  });

  return (
    <Animated.Image
      source={source}
      style={{
        width: 170,
        height: 187,
        transform: [{ rotate }],
      }}
      className = {containerStyle}
      resizeMode="contain"
    />
  );
};

export default AnimatedImage;