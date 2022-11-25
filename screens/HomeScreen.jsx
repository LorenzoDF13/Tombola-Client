import { View, Alert } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  FAB,
  Portal,
  Banner,
} from "react-native-paper";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import CreaPartitaModal from "../components/CreaPartitaModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PartecipaPartitaModal from "../components/PartecipaPartitaModal";
export default function HomeScreen({ navigation, route }) {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [connessione, setConnessione] = useState(socket.connected);
  const [FBAopen, setFBAOpen] = useState(false); //FBA BUTTON
  const [modalCreaPartita, showModalCreaPartita] = useState(false); //MODAL PER CREARE PARTITA
  const [modalPartecipaPartita, showModalPartecipaPartita] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  async function loadUsername() {
    setUsername((await AsyncStorage.getItem("username")) || "");
  }
  useEffect(() => {
    loadUsername();

    socket.on("connect", () => {
      setConnessione(true);
      setConnectionError(false);
    });
    socket.on("disconnect", () => {
      setConnessione(false);
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
    });
    socket.io.on("error", (err) => {
      navigation.navigate("Home");
      setConnectionError(err);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  useEffect(() => {
    if (route.params?.isLeaving) {
      socket.emit("leaveRoom");
      console.log("Leaved room " + route.params.room);
      route.params.isLeaving = false;
    }
  }, [route.params]);
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <Banner
        visible={connectionError}
        icon="web-off"
        actions={[
          {
            label: "Riprova",
            onPress: () => {
              socket.connect();
            },
          },
        ]}
      >
        Impossibile connettersi al Server {connectionError.toString()}
      </Banner>
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
              if (!connectionError) {
                setFBAOpen(false);
                socket.emit("username", username);
                showModalCreaPartita(true);
              }
            },
          },
          {
            icon: "star",
            label: "Partecipa",
            onPress: () => {
              if (!connectionError) {
                socket.emit("username", username);
                setFBAOpen(false);
                showModalPartecipaPartita(true);
              }
            },
          },
        ]}
        onStateChange={() => setFBAOpen(!FBAopen)}
        onPress={() => {}}
      />
    </View>
  );
}
