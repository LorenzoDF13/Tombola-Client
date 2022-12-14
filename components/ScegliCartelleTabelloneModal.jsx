import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";

export default function ScegliCartelleTabelloneModal({
  visible,
  setVisible,
  setCartelleScelte,
  numeroCartelle,
}) {
  const theme = useTheme();
  const Styles = StyleSheet.create({
    cartella: {
      paddingTop: 20,
      paddingBottom: 20,
      paddingLeft: 30,
      paddingRight: 30,
      margin: 10,
      borderColor: theme.colors.secondary,
      borderWidth: 2,
    },
  });
  const Cartella = ({ value, cartelleSelezionate }) => {
    const [selected, setSelected] = useState(false);
    return (
      <Text
        style={{
          ...Styles.cartella,
          borderColor: selected
            ? theme.colors.primary
            : theme.colors.primaryContainer,
        }}
        onPress={() => {
          if (selected) {
            const index = cartelleSelezionate.current.indexOf(value);
            cartelleSelezionate.current.splice(index, 1);
          } else cartelleSelezionate.current.push(value);
          setSelected(!selected);
        }}
      >
        {value}
      </Text>
    );
  };
  let index = 0;
  const cartelleSelezionate = useRef([]);
  return (
    <Portal>
      <Dialog
        dismissable={false}
        visible={visible}
        onDismiss={() => setVisible(false)}
      >
        <Dialog.Title style={{ textAlign: "center" }}>
          Scegli le tue cartelle
        </Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Array.from(Array(3), (_, i) => {
              return (
                <View style={{ flexDirection: "row" }} key={(i + 1) * 3143242}>
                  {Array.from(Array(2), (_, j) => {
                    index++;
                    return (
                      <Cartella
                        key={(i + 1) * j}
                        value={index}
                        cartelleSelezionate={cartelleSelezionate}
                      />
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button
            onPress={() => {
              if (cartelleSelezionate.current.length < numeroCartelle) {
                Alert.alert(
                  "Attenzione",
                  `Hai ancora ${
                    numeroCartelle - cartelleSelezionate.current.length
                  } cartelle da selezionare `
                );
                return;
              }
              if (cartelleSelezionate.current.length > numeroCartelle) {
                Alert.alert(
                  "Attenzione",
                  `Hai selezionato ${
                    cartelleSelezionate.current.length - numeroCartelle
                  } cartella di troppo `
                );
                return;
              }
              console.log(cartelleSelezionate.current);
              setCartelleScelte(cartelleSelezionate.current);
              setVisible(false);
            }}
          >
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
