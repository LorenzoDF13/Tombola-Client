import { View } from "react-native";
import React, { useState } from "react";
import { Button, Dialog, Portal, TextInput } from "react-native-paper";

export default function PartecipaPartitaModal({
  navigation,
  visible,
  setVisible,
}) {
  const [room, setRoom] = useState("");
  return (
    <View>
      <View>
        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>Partecipa</Dialog.Title>
            <Dialog.Content>
              <TextInput label={"Nome partita"} onChangeText={setRoom} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>cancel</Button>
              <Button
                onPress={() => {
                  if (room.length > 0) {
                    setVisible(false);
                    navigation.navigate("Lobby", { room, creator: false });
                  }
                }}
              >
                partecipa
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </View>
  );
}
