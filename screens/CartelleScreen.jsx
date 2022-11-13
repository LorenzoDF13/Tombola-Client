import { View, Text, ScrollView, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import AppBar from "../components/AppBar";

export default function CartelleScreen(props) {
  const room = props.route.params.room;
  const params = props.route.params.params;
  //PUNTI
  const [points, setPoints] = useState({
    ambo: false,
    terna: false,
    cinquina: false,
    tombola: false,
  });
  //NUMERI ESTRATTI
  const [extractedNumber, setExtractedNumber] = useState("");
  const [extractedNumbers, setExtractedNumbers] = useState([]);
  const [arrayCartelle, setArrayCartelle] = useState([]);
  useEffect(() => {
    for (let i = 0; i < params.checked; i++) {
      setArrayCartelle((prev) => [...prev, GeneraCartella()]);
    }
    socket.on("extractedNumber", (data) => {
      //console.log(data + JSON.stringify(points));
      extractedNumbers.push(data);
      //CHECK IF THERE IS A POINT
      for (let i = 0; i < arrayCartelle.length; i++) {
        let countTombola = 0;
        for (let j = 0; j < 3; j++) {
          let riga = arrayCartelle[i].map((colonna) => colonna[j]); // OTTENGO LA RIGA
          //  console.log(riga + "    : " + extractedNumbers);
          let countRiga = 0; //CONTATORE NUMERI USCITI PRESENTI NELLA RIGA DI OGNI TABELLA
          for (let n of extractedNumbers) {
            if (riga.includes(n)) {
              countRiga++;
              countTombola++;
            }
          }
          if (countRiga == 2 && points.ambo == false) {
            // console.log("AMBOOO!!!!" + points.ambo);
            socket.emit("point", room, "ambo", () => {
              setPoints({
                ...points,
                ambo: true,
              });
              Alert.alert("HAI FATTO AMBO, BRAVO!");
            });
          }
          if (countRiga == 3 && points.terna == false) {
            socket.emit("point", room, "terna", () => {
              setPoints({
                ...points,
                terna: true,
              });
              Alert.alert("HAI FATTO TERNA, BRAVO!");
            });
          }

          if (countRiga == 5 && points.cinquina == false) {
            socket.emit("point", room, "cinquina", () => {
              setPoints({
                ...points,
                cinquina: true,
              });
              Alert.alert("HAI FATTO CINQUINA, BRAVO!");
            });
          }

          // console.log("COUNT RIGA" + j + " : " + countRiga);
        }
        //console.log("COUNT-TOMBOLA: " + countTombola);
        if (countTombola == 15 && points.tombola == false) {
          socket.emit("point", room, "tombola", () => {
            setPoints({
              ...points,
              tombola: true,
            });
            Alert.alert("HAI FATTO TOMBOLA, BRAVISSIMOOO!");
          });
        }
      }
      setExtractedNumbers(extractedNumbers);
      setExtractedNumber(data);
    });
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);
      setPoints({
        ...points,
        [data]: true,
      });
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  return (
    <View>
      <View style={Styles.container}>
        {typeof extractedNumber == "number" && (
          <Text style={Styles.extractedNumber}>{extractedNumber}</Text>
        )}
      </View>
      <Text>{JSON.stringify(points)}</Text>
      <Text>{JSON.stringify(params.checked)}</Text>
      <ScrollView>
        {arrayCartelle.map((cartella) => StampaCartella(cartella))}
      </ScrollView>
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
    //GENERO NUMERI CASUALI E LI POSZIONO NELLE COLONNE
    for (let i = 0; i < 15; i++) {
      number = Math.floor(Math.random() * 90 + 1);
      while (alreadyExtractedNumbers.includes(number))
        number = Math.floor(Math.random() * 90 + 1);
      alreadyExtractedNumbers.push(number);
      let index; // INDICE IN CUI POSIZIONARE IL NUMERO
      index = Math.floor(number / 10);
      if (number == 90) index = 8;
      if (cartella[index][0] == -1) cartella[index][0] = number;
      else if (cartella[index][1] == -1) cartella[index][1] = number;
      else if (cartella[index][2] == -1) cartella[index][2] = number;
      else i--; // SE LA COLONNA E' OCCUPATA PESCO UN ALTRO NUMERO
    }
    //ORDINO LE COLONNE
    for (let i = 0; i < 9; i++) {
      cartella[i].sort((a, b) => a - b);
    }
    return cartella;
  }
  //STAMPO CARTELLA
  function StampaCartella(cartella) {
    return (
      <View style={Styles.cartella} key={Math.random() * 1000}>
        {cartella.map((colonna, i) => {
          return (
            <View style={{ flexDirection: "column" }} key={i + 107}>
              {colonna.map((elemento, j) => (
                <Text
                  key={(i + 1) * j}
                  style={
                    extractedNumbers.includes(elemento)
                      ? {
                          ...Styles.cartellaText,
                          backgroundColor: "red",
                          color: "white",
                        }
                      : Styles.cartellaText
                  }
                >
                  {elemento == -1 ? "    " : elemento}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
    );
  }
}
