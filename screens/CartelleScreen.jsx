import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import { Button, Chip, useTheme } from "react-native-paper";

import ExtractedNumber from "../components/ExtractedNumber";
import Cartella from "../components/Cartella";
import Avatar from "../components/Avatar";
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
  const [users, setUsers] = useState(props.route.params.users); // UTENTI NELLA STANZA
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
              avatar={<Avatar text={user.username} />}
              style={{ marginLeft: 5, marginRigth: 5 }}
            >
              {user.username}
            </Chip>
          ))}
        </ScrollView>
      </View>
      <View style={{ height: 35, marginTop: 5 }}>
        <ScrollView horizontal={true}>
          {Object.entries(points).map((point) =>
            point[1] != false ? (
              <Chip
                key={point[0]}
                style={{ marginLeft: 5, marginRigth: 5 }}
                mode="outlined"
              >
                {point[0] + ": " + point[1]}
              </Chip>
            ) : (
              ""
            )
          )}
        </ScrollView>
      </View>
      {}
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
