import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/TabelloneScreenStyle";
export default function TabelloneScreen(props) {
  const room = props.route.params.room;
  const [numero, setNumero] = useState("");
  const [extractedNumbers, setExtractedNumbers] = useState([]);
  useEffect(() => {
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });
    socket.on("point", (data, username) => {
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View>
      <View
        style={{
          textAlign: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={Styles.extractedNumber}>{numero}</Text>
      </View>

      <TouchableOpacity style={Styles.button} onPress={estraiNumero}>
        <Text style={Styles.text}>ESTRAI NUMERO </Text>
      </TouchableOpacity>
      <View style={Styles.container}>
        {generateTabellone().map((item) => {
          return item.map((i) => (
            <Text
              style={
                extractedNumbers.includes(i)
                  ? { ...Styles.item, backgroundColor: "red", color: "white" }
                  : Styles.item
              }
              key={i}
            >
              {i}
            </Text>
          ));
        })}
      </View>
    </View>
  );
  function generateTabellone() {
    var index = 1;
    var tabellone = [];
    for (let i = 1; i <= 10; i++) {
      tabellone[i] = [];
      for (let j = 1; j <= 9; j++) {
        tabellone[i][j] = index;
        index++;
      }
    }
    return tabellone;
  }
  function estraiNumero() {
    if (extractedNumbers.length < 90) {
      var extractedNumber = Math.floor(Math.random() * 90 + 1);
      while (extractedNumbers.includes(extractedNumber))
        extractedNumber = Math.floor(Math.random() * 90 + 1);
      setExtractedNumbers([...extractedNumbers, extractedNumber]);
      socket.emit("extractedNumber", room, extractedNumber);
      setNumero(extractedNumber);
    } else {
      Alert.alert("Partita finita");
      setExtractedNumbers([]);
      setNumero("");
    }
  }
}
