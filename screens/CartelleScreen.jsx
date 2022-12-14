import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import { Button, Chip, useTheme } from "react-native-paper";

import ExtractedNumber from "../components/ExtractedNumber";
import Cartella from "../components/Cartella";
import Users from "../components/Users";
import Points from "../components/Points";
export default function CartelleScreen(props) {
  const theme = useTheme();
  //PARAMETRI
  const room = props.route.params.room;
  const numeroCartelle = props.route.params.numeroCartelle;
  //PUNTI
  const [points, setPoints] = useState({
    ambo: false,
    terna: false,
    cinquina: false,
    tombola: false,
  });
  const extractedNumbers = useRef([]); // NUMERI ESTRATTI
  const [check, setCheck] = useState(false); // CONTROLLO PUNTI
  const [disabled, setDisabled] = useState(false); //DISABLE BUTTON AT THE END OF THE GAME
  const cartelle = Array.from(Array(parseInt(numeroCartelle)), (_, i) => (
    <Cartella
      key={i}
      room={room}
      points={points}
      extractedNumbers={extractedNumbers}
      setPoints={setPoints}
      check={check}
    />
  ));

  useEffect(() => {
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);

      setPoints((prev) => ({ ...prev, [data]: username }));
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("endGame", (message) => {
      setDisabled(true);
      Alert.alert(
        "PARTITA FINITA",
        message + " ritorno alla lobby in 5 secondi"
      );
      setTimeout(() => {
        props.navigation.navigate("Lobby", {
          room,
          numeroCartelle,
          creator: props.route.params.creator,
        });
      }, 5000);
    });
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("endGame");
      socket.off("point");
    };
  }, []);

  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <ExtractedNumber
        extractedNumbers={extractedNumbers}
        navigation={props.navigation}
      />

      <View>
        <Users users={props.route.params.users} />
      </View>
      <View style={{ height: 35, marginTop: 5 }}>
        <Points points={points} />
      </View>

      {<ScrollView>{cartelle.map((c) => c)}</ScrollView>}
      <View>
        <Button
          disabled={disabled}
          mode="contained"
          style={{ margin: 15 }}
          onPress={() => {
            setCheck(!check);
          }}
        >
          {"Proponi " + getKeyByValue(points, false)}
        </Button>
      </View>
    </View>
  );
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
