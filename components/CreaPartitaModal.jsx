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
  SegmentedButtons,
  Menu,
  Button,
  Dialog,
} from "react-native-paper";

export default function CreaPartitaModal({ visible, setVisible, navigation }) {
  const [checked, setChecked] = useState("2");
  const [room, setRoom] = useState("");
  const [tabelloneAutomatico, setTabelloneAutomatico] = useState(true);
  const [mode, setMode] = useState("facile"); // MODALITA NORMALE DIFFICILE DIFFICILISSIMA
  const [menu, setMenu] = useState(false);
  const theme = useTheme();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Content>
          <TextInput label="Stanza" onChangeText={setRoom} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: 20,
              marginLeft: 5,
              marginRight: 5,
            }}
          >
            <Text variant="bodyLarge">Tabellone automatico</Text>
            <Switch
              value={tabelloneAutomatico}
              onValueChange={() => setTabelloneAutomatico(!tabelloneAutomatico)}
            ></Switch>
          </View>
          <View
            style={{
              marginBottom: 20,
              /* justifyContent: "center",
              flexDirection: "row", */
            }}
          >
            <Menu
              visible={menu}
              onDismiss={() => setMenu(false)}
              anchor={
                <Button
                  mode="outlined"
                  style={{}}
                  onPress={() => setMenu(true)}
                >
                  {checked} Cartelle
                </Button>
              }
            >
              <Menu.Item
                title="2"
                onPress={() => (setChecked("2"), setMenu(false))}
              />
              <Menu.Item
                title="3"
                onPress={() => (setChecked("3"), setMenu(false))}
              />
              <Menu.Item
                title="4"
                onPress={() => (setChecked("4"), setMenu(false))}
              />
            </Menu>
          </View>
          {/*    <RadioButton.Group
            onValueChange={(value) => setChecked(value)}
            value={checked}
          >
            <RadioButton.Item value="2" label="2 cartelle" />
            <RadioButton.Item value="3" label="3 cartelle" />
            <RadioButton.Item value="4" label="4 cartelle" />
          </RadioButton.Group> */}
          <SegmentedButtons
            value={mode}
            onValueChange={setMode}
            style={{
              margin: 20,
              marginLeft: 0,
              marginTop: 0,
              marginRight: 0,
            }}
            buttons={[
              {
                value: "facile",
                label: "facile",
                showSelectedCheck: true,
              },
              {
                value: "normale",
                label: "normal",
                showSelectedCheck: true,
              },
              {
                value: "difficile",
                label: "difficile",
                showSelectedCheck: true,
              },
            ]}
          />
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
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}
const style = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
