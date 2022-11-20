import { View, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  FAB,
  Modal,
  Text,
  Portal,
  RadioButton,
  Switch,
  TextInput,
  useTheme,
} from "react-native-paper";

export default function CreaPartitaModal({ visible, setVisible, navigation }) {
  const [checked, setChecked] = useState("2");
  const [room, setRoom] = useState("");
  const [tabelloneAutomatico, setTabelloneAutomatico] = useState(true);
  const [mode, setMode] = useState("normale"); // MODALITA NORMALE DIFFICILE DIFFICILISSIMA

  const theme = useTheme();
  return (
    <Portal>
      <Modal
        style={{ backgroundColor: theme.colors.background }}
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={{
          ...style.modal,
          backgroundColor: theme.colors.background,
        }}
      >
        <TextInput label="Stanza" onChangeText={setRoom} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            margin: 10,
            marginBottom: 5,
          }}
        >
          <Text variant="bodyLarge">Tabellone automatico</Text>
          <Switch
            value={tabelloneAutomatico}
            onValueChange={() => setTabelloneAutomatico(!tabelloneAutomatico)}
          ></Switch>
        </View>

        <RadioButton.Group
          onValueChange={(value) => setChecked(value)}
          value={checked}
        >
          <RadioButton.Item value="2" label="2 cartelle" />
          <RadioButton.Item value="3" label="3 cartelle" />
          <RadioButton.Item value="4" label="4 cartelle" />
        </RadioButton.Group>
        <Text
          style={{
            marginLeft: 15,
            marginRight: 15,
            marginTop: 5,
            marginBottom: 5,
          }}
          variant="titleMedium"
        >
          Modalita:
        </Text>
        <RadioButton.Group
          onValueChange={(value) => setMode(value)}
          value={mode}
        >
          <RadioButton.Item value="normale" label="Normale" />
          <RadioButton.Item value="difficile" label="Difficile" />
          <RadioButton.Item
            value="difficilissimo"
            label="Difficilissimo"
            style={{ marginBottom: 10 }}
          />
        </RadioButton.Group>
        <FAB
          label="Crea"
          mode="flat"
          icon="plus"
          disabled={room.length < 1}
          onPress={() => {
            setVisible(false);
            navigation.navigate("Lobby", {
              room,
              numeroCartelle: checked,
              tabelloneAutomatico,
              creator: true,
              mode,
            });
          }}
        />
      </Modal>
    </Portal>
  );
}
const style = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
  },
});
