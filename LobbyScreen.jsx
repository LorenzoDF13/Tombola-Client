import { Alert, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Chip, Text } from "react-native-paper";
import socket from "../utils/socket";

export default function LobbyScreen({ navigation, route }) {
  const room = route.params.room;
  const creator = route.params.creator;

  const numeroCartelle = route.params.numeroCartelle;
  const tabelloneAutomatico = route.params.tabelloneAutomatico;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (creator) {
      socket.emit(
        "createRoom",
        { room, numeroCartelle, tabelloneAutomatico },
        (alreadyExist, users) => {
          if (alreadyExist) {
            Alert.alert("ATTENZIONE", "PARTITA GIA ESISTENTE");
            navigation.navigate("Home");
            return;
          }
          console.log(users);
          setUsers(users);
        }
      );
    } else {
      socket.emit("joinRoom", room, (error, users) => {
        if (error) {
          Alert.alert("ATTENZIONE", error);
          navigation.navigate("Home");
          return;
        }

        console.log(users);
        setUsers(users);
      });
    }
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      navigation.navigate("Home");
    });
    socket.on("roomChange", (users) => {
      setUsers(users);
    });
    socket.on("startGame", (numeroCartelle) => {
      navigation.navigate("Cartelle", { numeroCartelle, users });
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
        style={{ justifyContent: "center", flexDirection: "row", margin: 10 }}
      >
        <Text variant="headlineLarge">Stanza {room}</Text>
      </View>
      <ScrollView style={{ margin: 10 }}>
        {users.map((user) => (
          <Chip
            key={user._admin.clientId}
            style={{ padding: 10, margin: 5 }}
            icon="account"
          >
            {user.username}
          </Chip>
        ))}
      </ScrollView>

      <Button
        disabled={!creator}
        style={{ margin: 10 }}
        mode="contained"
        onPress={() => {
          if (users.length < 2) {
            Alert.alert("ATTENZIONE", "Minimo due giocatori necessari");
            return;
          }
          socket.emit("startGame", room);
          navigation.navigate("Cartelle", { numeroCartelle, users });
        }}
      >
        Start
      </Button>
    </View>
  );
}
