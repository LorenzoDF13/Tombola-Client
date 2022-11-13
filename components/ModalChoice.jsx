import { View, Text } from "react-native";
import React from "react";
import { Button, Dialog, Paragraph, Portal } from "react-native-paper";

export default function ModalChoice({
  visible,
  setVisible,
  room,
  navigation,
  params,
}) {
  return (
    <Portal>
      <Dialog visible={visible} dismissable="false">
        <Dialog.Title>ATTENZIONE</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Cosa desideri utilizzare?</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => changePage("Tabellone")}>Tabellone</Button>
          <Button style={{ margin: 10 }} onPress={() => changePage("Cartelle")}>
            cartelle
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
  function changePage(pageName) {
    navigation.navigate(pageName, { room, params });
    setVisible(false);
  }
}
