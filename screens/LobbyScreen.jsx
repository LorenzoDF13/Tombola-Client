import { Alert, ScrollView, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Button, Chip, Text, useTheme } from "react-native-paper";
import socket from "../utils/socket";
import Avatar from "../components/Avatar";

export default function LobbyScreen({ navigation, route }) {
  const theme = useTheme();
  const room = route.params.room;
  const creator = route.params.creator; // SE é IL CREATORE DELLA STANZA
  const mode = route.params.mode;
  const numeroCartelle = route.params.numeroCartelle;
  const [tabelloneAutomatico, setTabelloneAutomatico] = useState(
    route.params.tabelloneAutomatico || false
  );
  let [users, setUsers] = useState([]);
  let [tabelloneUsername, setTabelloneUsername] = useState(false);
  let [isTabellone, setIsTabellone] = useState(false);
  useEffect(() => {
    if (creator) {
      socket.emit(
        "createRoom",
        { room, numeroCartelle, tabelloneAutomatico, mode },
        (alreadyExist, users) => {
          if (alreadyExist) {
            Alert.alert("ATTENZIONE", "PARTITA GIA ESISTENTE");
            navigation.navigate("Home");
            return;
          }

          setUsers(users);
        }
      );
    } else {
      socket.emit("joinRoom", room, (error, props) => {
        if (error) {
          Alert.alert("ATTENZIONE", error);
          navigation.navigate("Home");
          return;
        }
        if (props.tabelloneAutomatico) {
          setTabelloneAutomatico(true);
        }
        users = props.users;
        setUsers(props.users);
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
    socket.on("tabelloneChoosen", (data) => {
      tabelloneUsername = data;
      setTabelloneUsername(tabelloneUsername);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("startGame");
      socket.off("tabelloneChoosen");
      socket.off("roomChange");
    };
  }, []);
  useEffect(() => {
    socket.off("startGame");
    socket.on("startGame", (numeroCartelle) => {
      console.log(isTabellone);
      if (isTabellone)
        navigation.navigate("Tabellone", { numeroCartelle, users, room });
      else navigation.navigate("Cartelle", { numeroCartelle, users, room });
    });
  }, [isTabellone]);
  return (
    <View style={{ backgroundColor: theme.colors.surface, flex: 1 }}>
      <View
        style={{ justifyContent: "center", flexDirection: "row", margin: 10 }}
      >
        <Text variant="headlineLarge">Stanza {room}</Text>
      </View>
      <ScrollView style={{ margin: 10 }}>
        {users.map((user, i) => (
          <Chip
            key={i}
            style={{ padding: 10, margin: 5 }}
            avatar={<Avatar text={user.username} />}
          >
            {user.username}
          </Chip>
        ))}
      </ScrollView>

      <View>
        {!tabelloneAutomatico && (
          <Button
            style={{ margin: 10 }}
            mode="contained-tonal"
            disabled={tabelloneUsername}
            onPress={() => {
              if (users.length < 2) {
                Alert.alert(
                  "ATTENZIONE",
                  "Prima di scegliere il tabellone attendi gli altri giocatori"
                );
                return;
              }
              socket.emit("chooseTabellone", room, (username) => {
                setIsTabellone(true);
                setTabelloneUsername(username);
              });
            }}
          >
            Tabellone
            {tabelloneUsername && ` preso da ${tabelloneUsername}`}
          </Button>
        )}
        <Button
          disabled={!creator}
          style={{ margin: 10 }}
          mode="contained"
          onPress={() => {
            if (users.length < 2) {
              Alert.alert("ATTENZIONE", "Minimo due giocatori necessari");
              return;
            }
            if (!tabelloneAutomatico && !tabelloneUsername) {
              Alert.alert(
                "ATTENZIONE",
                "Nessun giocatore ha scelto il tabellone"
              );
              return;
            }
            socket.emit("startGame", room);
            if (isTabellone)
              navigation.navigate("Tabellone", { numeroCartelle, users, room });
            else
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
    </View>
  );
}
