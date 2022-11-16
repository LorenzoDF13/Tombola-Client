import { View } from "react-native";
import React from "react";
import { Appbar } from "react-native-paper";

export default function AppBar({ back, navigation, route }) {
  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={route.name} />
      {route.name == "Home" ? (
        <Appbar.Action
          icon="cog"
          onPress={() => navigation.navigate("Settings")}
        ></Appbar.Action>
      ) : (
        ""
      )}
    </Appbar.Header>
  );
}
