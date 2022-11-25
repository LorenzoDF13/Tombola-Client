import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, useTheme } from "react-native-paper";
import Styles from "../styles/CartelleScreenStyle";
import socket from "../utils/socket";
export default function ExtractNumberTabellone({ extractedNumbers }) {
  const theme = useTheme();
  const [number, setNumber] = useState("");
  useEffect(() => {}, []);
  return (
    <View
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {number != "" ? (
        <Text
          style={{
            ...Styles.extractedNumber,
            backgroundColor: theme.colors.primary,
          }}
        >
          {number}
        </Text>
      ) : null}
      <Button
        mode="elevated"
        style={{ marginTop: 20 }}
        onPress={() => estraiNumero()}
      >
        Estrai Numero
      </Button>
    </View>
  );
  function estraiNumero() {
    if (extractedNumbers.current.length < 90) {
      var extractedNumber = Math.floor(Math.random() * 90 + 1);
      while (extractedNumbers.current.includes(extractedNumber))
        extractedNumber = Math.floor(Math.random() * 90 + 1);
      extractedNumbers.current.push(extractedNumber);
      socket.emit("extractedNumber", extractedNumber);
      setNumber(extractedNumber);
    } else {
      socket.emit("endGame");
      Alert.alert("Partita finita");
    }
  }
}
