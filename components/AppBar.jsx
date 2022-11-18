import { Alert, View } from "react-native";
import React, { useState } from "react";
import { Appbar } from "react-native-paper";

export default function AppBar({ back, navigation, route, mute, setMute }) {
  const [state, setState] = useState(false);
  return (
    <Appbar.Header statusBarHeight={"0"} elevated>
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
      {route.name == "Cartelle" ? (
        <Appbar.Action
          icon={state ? "volume-off" : "volume-high"}
          onPress={() =>
            state
              ? (setMute(false), setState(false))
              : (setMute(true), setState(true))
          }
        ></Appbar.Action>
      ) : (
        ""
      )}
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
