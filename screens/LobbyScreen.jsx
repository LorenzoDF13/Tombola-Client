import { Alert, ScrollView, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Chip, Text, useTheme } from "react-native-paper";
import socket from "../utils/socket";

export default function LobbyScreen({ navigation, route }) {
  const theme = useTheme();
  const room = route.params.room;
  const creator = route.params.creator;

  const numeroCartelle = route.params.numeroCartelle;
  const tabelloneAutomatico = route.params.tabelloneAutomatico;
  let [users, setUsers] = useState([]);
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

          setUsers(users);
          console.log(users);
        }
      );
    } else {
      socket.emit("joinRoom", room, (error, u /*USERS*/) => {
        if (error) {
          Alert.alert("ATTENZIONE", error);
          navigation.navigate("Home");
          return;
        }
        users = u;
        setUsers(u);
      });
    }
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      navigation.navigate("Home");
    });
    socket.on("roomChange", (u /**USERS */) => {
      users = u;
      setUsers(u);
    });
    socket.on("startGame", (numeroCartelle) => {
      navigation.navigate("Cartelle", { numeroCartelle, users, room });
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <View
        style={{ justifyContent: "center", flexDirection: "row", margin: 10 }}
      >
        <Text variant="headlineLarge">Stanza {room}</Text>
      </View>
      <ScrollView style={{ margin: 10 }}>
        {users.map((user, i) => (
          <Chip key={i} style={{ padding: 10, margin: 5 }} icon="account">
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
          navigation.navigate("Cartelle", {
            numeroCartelle,
            users,
            room,
            creator,
          });
        }}
      >
        Start
      </Button>
    </View>
  );
}
