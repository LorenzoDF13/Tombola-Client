import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { FAB, RadioButton, TextInput, useTheme } from "react-native-paper";
import { Switch } from "react-native-paper";
import socket from "../utils/socket";
import ModalChoice from "../components/ModalChoice";
export default function CreaPartitaScreen({ navigation }) {
  const [tabelloneAutomatico, setTabelloneAutomatico] = useState(false);
  const [checked, setChecked] = useState("2");
  const [room, setRoom] = useState("");
  const [showModalChoice, setShowModalChoice] = useState(false); //MODAL TABELLA O CARTELLE
  const theme = useTheme();
  useEffect(() => {
    socket.on("disconnect", () => {
      navigation.replace("Home");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View
      style={{ backgroundColor: theme.colors.background, flex: 1, padding: 50 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ModalChoice
          params={{ tabelloneAutomatico, checked }}
          room={room}
          navigation={navigation}
          visible={showModalChoice}
          setVisible={setShowModalChoice}
        ></ModalChoice>
        <Text>Tabellone automatico</Text>
        <Switch
          value={tabelloneAutomatico}
          onValueChange={() => setTabelloneAutomatico(!tabelloneAutomatico)}
        ></Switch>
      </View>
      <View
        style={{ flexDirection: "column", justifyContent: "space-between" }}
      >
        <View style={style.row}>
          <Text>2 cartelle</Text>
          <RadioButton
            value="2"
            status={checked == "2" ? "checked" : "unchecked"}
            onPress={() => setChecked("2")}
          />
        </View>
        <View style={style.row}>
          <Text>3 cartelle</Text>
          <RadioButton
            value="3"
            status={checked == "3" ? "checked" : "unchecked"}
            onPress={() => setChecked("3")}
          />
        </View>
        <View style={style.row}>
          <Text>4 cartelle</Text>
          <RadioButton
            value="4"
            status={checked == "4" ? "checked" : "unchecked"}
            onPress={() => setChecked("4")}
          />
        </View>
      </View>
      <TextInput label="Stanza" value={room} onChangeText={setRoom} />
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 30,
          margin: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FAB
          label="Crea"
          icon="plus"
          disabled={room.length < 1}
          onPress={createRoom}
        />
      </View>
    </View>
  );
  function createRoom() {
    socket.emit("joinRoom", room);
    setShowModalChoice(true);
  }
}
const style = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
