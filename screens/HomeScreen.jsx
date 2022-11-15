import { View, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  FAB,
  Portal,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import CreaPartitaModal from "../components/CreaPartitaModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PartecipaPartitaModal from "../components/PartecipaPartitaModal";
export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [connessione, setConnessione] = useState(socket.connected);
  const [FBAopen, setFBAOpen] = useState(false); //FBA BUTTON
  const [modalCreaPartita, showModalCreaPartita] = useState(false); //MODAL PER CREARE PARTITA
  const [modalPartecipaPartita, showModalPartecipaPartita] = useState(false);
  async function loadUsername() {
    setUsername((await AsyncStorage.getItem("username")) || "");
  }
  useEffect(() => {
    loadUsername();
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
      <CreaPartitaModal
        visible={modalCreaPartita}
        setVisible={showModalCreaPartita}
        socket={socket}
        navigation={navigation}
      />
      <PartecipaPartitaModal
        visible={modalPartecipaPartita}
        setVisible={showModalPartecipaPartita}
        navigation={navigation}
      ></PartecipaPartitaModal>
      <TextInput
        label={"Nickname"}
        value={username}
        selectionColor={"black"}
        style={{ margin: 10 }}
        onChangeText={(t) => {
          setUsername(t);
          AsyncStorage.setItem("username", t);
        }}
      ></TextInput>
      {/* <View>
        <Button
          disabled={username.length < 1}
          mode="contained"
          style={{ margin: 10, marginTop: 30 }}
          onPress={() => {
            if (connessione) changePage("CreaPartita");
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
      </View> */}

      <FAB.Group
        disabled={username.length == 0}
        open={FBAopen}
        visible
        icon={"plus"}
        actions={[
          {
            icon: "plus",
            label: "Crea partita",
            onPress: () => {
              socket.emit("username", username);
              showModalCreaPartita(true);
            },
          },
          {
            icon: "star",
            label: "Partecipa",
            onPress: () => {
              socket.emit("username", username);
              showModalPartecipaPartita(true);
            },
          },
        ]}
        onStateChange={() => setFBAOpen(!FBAopen)}
        onPress={() => {}}
      />
    </View>
  );
}
