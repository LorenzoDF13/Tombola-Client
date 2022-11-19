import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";
import Styles from "../styles/CartelleScreenStyle";
import socket from "../utils/socket";
export default function Cartella({
  extractedNumbers,

  points,
  setPoints,
  room,
}) {
  const theme = useTheme();
  const [cartella, setCartella] = useState(GeneraCartella());
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  useEffect(() => {
    checkPoint();
  }, [selectedNumbers]);
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
                <TouchableOpacity
                  key={(i + 1) * j}
                  onPress={() => {
                    if (
                      extractedNumbers.current.includes(elemento) &&
                      !selectedNumbers.includes(elemento)
                    ) {
                      setSelectedNumbers((prev) => [
                        ...selectedNumbers,
                        elemento,
                      ]);
                    }
                  }}
                  style={
                    selectedNumbers.includes(elemento)
                      ? {
                          ...Styles.cartellaText,
                          backgroundColor: theme.colors.primaryContainer,
                          borderColor: theme.colors.primaryContainer,
                          color: theme.colors.primaryContainer,
                        }
                      : {
                          ...Styles.cartellaText,
                          borderColor: theme.colors.primaryContainer,
                          color: "black",
                        }
                  }
                >
                  <Text style={{ color: theme.colors.onBackground }}>
                    {elemento == -1 ? "    " : elemento}
                  </Text>
                </TouchableOpacity>
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
    for (let i = 0; i < 3; i++) {
      let riga = cartella.map((colonna) => colonna[i]); // OTTENGO LA RIGA
      let countRiga = 0; //CONTATORE NUMERI USCITI PRESENTI NELLA RIGA DI OGNI TABELLA
      for (let n of selectedNumbers) {
        if (riga.includes(n)) {
          countRiga++;
        }
      }
      if (countRiga == 2 && !points.ambo) {
        console.log("AMBOOO!!!!" + extractedNumbers);
        socket.emit("point", room, "ambo", () => {
          setPoints((prev) => ({ ...prev, ambo: true }));
          Alert.alert("HAI FATTO AMBO, BRAVO!");
        });
      }
      if (countRiga == 3 && !points.terna) {
        console.log("TERNA!!!!" + extractedNumbers);
        socket.emit("point", room, "terna", () => {
          setPoints((prev) => ({ ...prev, terna: true }));
          Alert.alert("HAI FATTO TERNA, BRAVO!");
        });
      }

      if (countRiga == 5 && !points.cinquina) {
        console.log("Cinquina!!!!" + extractedNumbers);
        socket.emit("point", room, "cinquina", () => {
          setPoints((prev) => ({ ...prev, cinquina: true }));
          Alert.alert("HAI FATTO CINQUINA, BRAVO!");
        });
      }

      //console.log("extracted : " + extractedNumbers);
      //console.log("COUNT RIGA" + j + " : " + countRiga);
    }
    console.log("COUNT-TOMBOLA: " + selectedNumbers.length);

    if (selectedNumbers.length == 15) {
      socket.emit("point", room, "tombola", () => {
        Alert.alert("HAI FATTO TOMBOLA, BRAVISSIMOOO!");
        socket.emit("endGame", room);
      });
    }
  }
}
