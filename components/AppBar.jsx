import { Alert, View } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";

export default function AppBar({ back, navigation, route }) {
  return (
    <Appbar.Header elevated>
      {back ? (
        <Appbar.BackAction
          onPress={
            route.name == "Lobby" || route.name == "Cartelle"
              ? leaveRoom
              : navigation.goBack
          }
        />
      ) : null}
      <Appbar.Content title={route.name} />
      {/*route.name == "Home" ? (
        <Appbar.Action
          icon="cog"
          onPress={() => navigation.navigate("Settings")}
        ></Appbar.Action>
      ) : (
        ""
      )*/}
    </Appbar.Header>
  );
  function leaveRoom() {
    Alert.alert("ATTENZIONE", "Sei sicuro di voler uscire?", [
      {
        text: "Cancel",

        style: "cancel",
      },

      {
        text: "si",
        onPress: () => {
          navigation.navigate("Home", {
            room: route.params.room,
            isLeaving: true,
          });
        },
      },
    ]);
  }
}
