import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/TabelloneScreenStyle";
import { useTheme } from "react-native-paper";
import CartellaTabellone from "../components/CartellaTabellone";
export default function TabelloneScreen(props) {
  const theme = useTheme();
  const room = props.route.params.room;
  const [numero, setNumero] = useState("");
  const extractedNumbers = useRef([]);
  const cartelleFirstValue = useRef(0); // PRIMO VALONE DELLE CARTELLE
  const [points, setPoints] = useState({
    ambo: false,
    terna: false,
    cinquina: false,
    tombola: false,
  });
  useEffect(() => {
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });
    socket.on("point", (data, username) => {
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
      points[data] = true;
      setPoints(points);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
      <ScrollView horizontal contentOffset={{ x: 25, y: 0 }}>
        <View style={Styles.container}>
          {Array.from(Array(3), (_, i) => {
            if (i > 0) cartelleFirstValue.current += 25;
            return (
              <View style={{ flexDirection: "row" }}>
                {Array.from(Array(2), (_, j) => {
                  if (j > 0) cartelleFirstValue.current += 5;
                  return (
                    <CartellaTabellone
                      key={(i + 1) * j + 7686}
                      extractedNumbers={extractedNumbers}
                      firstValue={cartelleFirstValue.current}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
