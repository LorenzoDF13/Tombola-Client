import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import Styles from "../styles/CartelleScreenStyle";
import { useTheme } from "react-native-paper";
import socket from "../utils/socket";
import * as Speech from "expo-speech";
import AppBar from "./AppBar";
export default function ExtractedNumber({ navigation, extractedNumbers }) {
  const [number, setNumber] = useState("");
  const [mute, setMute] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      header: (props) => <AppBar {...props} setMute={setMute} mute={mute} />,
    });
    socket.on("extractedNumber", (number) => {
      setNumber(number);
    });
  }, []);
  useEffect(() => {
    extractedNumbers.current.push(number);
    if (!mute) {
      Speech.speak("" + number, { rate: 1 });
      Speech.speak("" + number, {
        pitch: 0.5,
        rate: 0.1,
      });
    }
  }, [number]);
  const theme = useTheme();
  return (
    <View>
      <View
        style={{
          ...Styles.container,
        }}
      >
        <Text
          style={{
            ...Styles.extractedNumber,
            backgroundColor: theme.colors.primary,
          }}
        >
          {number}
        </Text>
      </View>
    </View>
  );
}
