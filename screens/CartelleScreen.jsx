import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import { Chip, useTheme } from "react-native-paper";

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
  });
  const extractedNumbers = useRef([]); // NUMERI ESTRATTI
  const cartelle = Array.from(Array(parseInt(numeroCartelle)), (_, i) => (
    <Cartella
      key={i}
      room={room}
      points={points}
      extractedNumbers={extractedNumbers}
      setPoints={setPoints}
    />
  ));
  const [users, setUsers] = useState(props.route.params.users); // UTENTI NELLA STANZA
  useEffect(() => {
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);

      setPoints((prev) => ({ ...prev, [data]: true }));
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("endGame", () => {
      Alert.alert("PARTITA FINITA", "Ritorno alla lobby");
      props.navigation.navigate("Lobby", {
        room,
        numeroCartelle,
        creator: props.route.params.creator,
      });
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
    </View>
  );
}
