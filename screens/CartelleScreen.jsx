import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import { Button, Chip, useTheme } from "react-native-paper";

import ExtractedNumber from "../components/ExtractedNumber";
import Cartella from "../components/Cartella";
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
  const [check, setCheck] = useState(false);
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
  const [users, setUsers] = useState(props.route.params.users); // UTENTI NELLA STANZA
  useEffect(() => {
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);

      setPoints((prev) => ({ ...prev, [data]: username }));
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("endGame", (message) => {
      Alert.alert(
        "PARTITA FINITA",
        message + " Ritorno alla lobby in 5 secondi"
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
    socket.on("roomChange", (users) => {
      setUsers(users);
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
        <ScrollView horizontal={true}>
          {users.map((user) => (
            <Chip
              key={user.username || Math.random() * 9999}
              icon="account"
              style={{ marginLeft: 5, marginRigth: 5 }}
            >
              {user.username}
            </Chip>
          ))}
        </ScrollView>
      </View>
      <Text>{JSON.stringify(points)}</Text>
      {<ScrollView>{cartelle.map((c) => c)}</ScrollView>}
      <View>
        <Button
          mode="contained"
          style={{ margin: 15 }}
          onPress={() => {
            console.log("PREMUTO");
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
