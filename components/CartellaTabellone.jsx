import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "react-native-paper";
import CartellaCell from "./CartellaCell";
import socket from "../utils/socket";

export default function CartellaTabellone({
  firstValue,
  extractedNumbers,
  selected,
  check,
  points,
  setPoints,
}) {
  const theme = useTheme();
  const selectedNumbers = useRef([]);
  let index = firstValue; // NUMERO CHE FINISCE DENTRO CARTELLA CELL
  let cartella = useRef([]);
  useEffect(() => {
    cartella.current = [];
  }, []);
  useEffect(() => {
    selected && checkPoint();
  }, [check]);
  return (
    <View
      style={{
        flexDirection: "column",
        margin: 1,
        marginLeft: 5,
        marginRigth: 5,
        borderWidth: 1,
        borderColor: selected
          ? theme.colors.primary
          : theme.colors.primaryContainer,
      }}
    >
      {Array.from(Array(3), (_, i) => {
        i > 0 ? (index += 5) : "";

        return (
          <View
            key={i - 43282}
            style={{
              flexDirection: "row",
            }}
          >
            {Array.from(Array(5), (_, j) => {
              index++;
              cartella.current.push(index);
              return (
                <CartellaCell
                  key={(i + 1) * j + 342432}
                  value={index}
                  selectedNumbers={selectedNumbers}
                  extractedNumbers={extractedNumbers}
                  tabellone
                />
              );
            })}
          </View>
        );
      })}
    </View>
  );
  function checkPoint() {
    console.log(`controllo cartella `);
    const ObjectPoints = {
      2: "ambo",
      3: "terna",
      5: "cinquina",
    }; //MAPPING NUMBERS TO POINTS
    let pointDone = false;
    for (let i = 0; i < 3; i++) {
      let countRiga = 0;
      const riga = cartella.current.slice(i * 5, i * 5 + 5);
      for (const selectedNumber of selectedNumbers.current) {
        console.log(`${cartella.current}`);
        console.log(`riga : ${riga}`);
        if (riga.includes(selectedNumber)) countRiga++;
        const pointToDo = getKeyByValue(points, false);
        console.log(`COUNT RIGA: ${countRiga}, pointToDo : ${pointToDo},`);
        if (ObjectPoints[countRiga] == pointToDo && !points[pointToDo]) {
          pointDone = true;
          socket.emit("point", pointToDo, (username) => {
            setPoints((prev) => ({
              ...prev,
              [pointToDo]: username,
            }));
            Alert.alert(`ATTENZIONE','Hai Fatto ${pointToDo}`);
          });
          break;
        }
      }
      if (pointDone) break;
    }
    if (selectedNumbers.current.length == 15) {
      socket.emit("point", "tombola", () => {
        Alert.alert("HAI FATTO TOMBOLA, BRAVISSIMOOO!");
      });
    }
  }
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
