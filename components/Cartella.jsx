import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "react-native-paper";
import Styles from "../styles/CartelleScreenStyle";
import socket from "../utils/socket";
import CartellaCell from "./CartellaCell";
export default function Cartella({
  extractedNumbers,
  points,
  setPoints,
  room,
  check,
}) {
  const theme = useTheme();
  const [cartella, setCartella] = useState(GeneraCartella());
  const selectedNumbers = useRef([]);
  useEffect(() => {
    console.log("Controllo punto");
    checkPoint();
  }, [check]);
  return (
    <View>
      <View style={Styles.cartella} key={Math.random() * 1000}>
        {cartella.map((colonna, i) => {
          return (
            <View
              style={{ flexDirection: "column" }}
              key={Math.random() * 1000}
            >
              {colonna.map((elemento, j) => (
                <CartellaCell
                  extractedNumbers={extractedNumbers}
                  selectedNumbers={selectedNumbers}
                  value={elemento}
                />
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
  function GeneraCartella() {
    //NO DUPLICATI, NUMERI ORDINATI, 90 MESSO NELLA COLONNA GIUSTA
    const cartella = [];
    //RIMEPO MATRICE CON -1
    for (let i = 0; i < 9; i++) {
      cartella[i] = [];
      for (let j = 0; j < 3; j++) {
        cartella[i][j] = -1;
      }
    }
    let alreadyExtractedNumbers = []; //ARRAY NUMERI GIA PRESI PER EVITARE DUPLICATI
    //GENERO 5 NUMERI CASUALI PER RIGA
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 5; j++) {
        number = Math.floor(Math.random() * 90 + 1);
        while (alreadyExtractedNumbers.includes(number))
          number = Math.floor(Math.random() * 90 + 1);
        alreadyExtractedNumbers.push(number);
        let index; // INDICE IN CUI POSIZIONARE IL NUMERO
        index = Math.floor(number / 10);
        if (number == 90) index = 8;
        if (cartella[index][i] == -1) cartella[index][i] = number;
        else j--; // SE LA COLONNA E' OCCUPATA PESCO UN ALTRO NUMERO
      }
    }
    //ORDINO LE COLONNE
    for (let i = 0; i < 9; i++) {
      cartella[i].sort((a, b) => {
        if (a != -1 && b != -1) return a - b;
      });
    }
    return cartella;
  }
  function checkPoint() {
    //CHECK IF THERE IS A POINT
    let pointDone = false; // IF ALREADY SCORED THE POINT
    const ObjectPoints = {
      2: "ambo",
      3: "terna",
      5: "cinquina",
    }; //MAPPING NUMBERS TO POINTS
    for (let i = 0; i < 3; i++) {
      let riga = cartella.map((colonna) => colonna[i]); // OTTENGO LA RIGA
      let countRiga = 0; //CONTATORE NUMERI USCITI PRESENTI NELLA RIGA DI OGNI TABELLA
      for (let n of selectedNumbers.current) {
        if (riga.includes(n)) {
          countRiga++;
          let p = ObjectPoints[countRiga]; // PUNTO CONTATO CON COUNT RIGA
          let pToDo = getKeyByValue(points, false); // PUNTO DA FARE
          if (p == pToDo && !points[p] && !pointDone) {
            pointDone = true;
            console.log(p + " !!!!! " + extractedNumbers);
            socket.emit("point", room, p, (username) => {
              setPoints((prev) => ({ ...prev, [p]: username }));
              Alert.alert(`Hai Fatto ${p}, Bravo!`);
            });
            break;
          }
        }
        if (pointDone) break;
      }
    }
    console.log("COUNT-TOMBOLA: " + selectedNumbers.current.length);

    if (selectedNumbers.current.length == 15) {
      socket.emit("point", room, "tombola", () => {
        Alert.alert("HAI FATTO TOMBOLA, BRAVISSIMOOO!");
        socket.emit("endGame", room);
      });
    }
  }
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
