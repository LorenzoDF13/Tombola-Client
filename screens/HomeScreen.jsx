import { View, Alert } from "react-native";
import { Text, TextInput, Button, useTheme } from "react-native-paper";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [connessione, setConnessione] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      setConnessione(true);
    });
    socket.on("disconnect", () => {
      setConnessione(false);
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
    });
    socket.io.on("error", (err) => {
      Alert.alert("ATTENZIONE", "ERRORE DI CONNESSIONE");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Text>{connessione ? "CONNESSO" : "NON CONNESSO"}</Text>
      <View style={{ justifyContent: "center", flexDirection: "row" }}>
        <Text variant="headlineLarge" style={{ margin: 10 }}>
          Benvenuto
        </Text>
      </View>

      <TextInput
        label={"Nickname"}
        selectionColor={"black"}
        style={{ margin: 10 }}
        onChangeText={setUsername}
      ></TextInput>
      <View>
        <Button
          disabled={username.length < 1}
          mode="contained"
          style={{ margin: 10, marginTop: 30 }}
          onPress={() => {
            if (connessione) chagePage("CreaPartita");
          }}
        >
          Crea partita
        </Button>
        <Button
          disabled={username.length < 1}
          mode="contained"
          style={{ margin: 10 }}
          onPress={() => changePage("CreaPartita")}
        >
          Partecipa
        </Button>
      </View>
    </View>
  );
  function chagePage(pageName) {
    socket.emit("username", username);
    navigation.navigate(pageName);
  }
}
