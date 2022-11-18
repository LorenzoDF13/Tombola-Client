import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/CartelleScreenStyle";
import { Chip, useTheme } from "react-native-paper";
import * as Speech from "expo-speech";
import AppBar from "../components/AppBar";
export default function CartelleScreen(props) {
  const theme = useTheme();
  //PARAMETRI
  const room = props.route.params.room;
  const numeroCartelle = props.route.params.numeroCartelle;
  //PUNTI
  const [points, setPoints] = useState({
    ambo: false,
    terna: false,
    cinquina: false,
    tombola: false,
  });
  //NUMERI ESTRATTI
  const [extractedNumber, setExtractedNumber] = useState(""); // NUMERO ESTRATTO
  const [extractedNumbers, setExtractedNumbers] = useState([]); // NUMERI ESTRATTI
  const [selectedNumbers, setSelectedNumbers] = useState([]); // NUMERI SELEZIONATI DALL'UTENTE
  const [arrayCartelle, setArrayCartelle] = useState(() => []);
  const [users, setUsers] = useState(props.route.params.users); // UTENTI NELLA STANZA
  const [mute, setMute] = useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      header: (props) => <AppBar {...props} setMute={setMute} mute={mute} />,
    });
    for (let i = 0; i < numeroCartelle; i++) {
      setArrayCartelle((prev) => [...prev, GeneraCartella()]);
    }
    socket.on("extractedNumber", (data) => {
      extractedNumbers.push(data);

      setExtractedNumbers(extractedNumbers);
      setExtractedNumber(data);
    });
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);
      points[data] = true;
      setPoints(points);
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("endGame", () => {
      Alert.alert("PARTITA FINITA", "Ritorno alla lobby");
      props.navigation.navigate("Lobby", {
        room,
        numeroCartelle,
        creator: props.route.params.creator,
      });
    });
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });
    socket.on("roomChange", (users) => {
      setUsers(users);
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);
  useEffect(() => {
    console.log(mute);
    if (!mute && extractedNumber != "") {
      Speech.speak("" + extractedNumber, { rate: 1 });
      Speech.speak("" + extractedNumber, {
        pitch: 0.5,
        rate: 0.1,
      });
    }
  }, [extractedNumber]);
  return (
    <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
      <View
        style={{
          ...Styles.container,
        }}
      >
        <Text
          style={{
            ...Styles.extractedNumber,
            backgroundColor: theme.colors.primary,
          }}
        >
          {extractedNumber}
        </Text>
      </View>

      <View>
        <ScrollView horizontal={true}>
          {users.map((user) => (
            <Chip
              key={user.username || Math.random() * 9999}
              icon="account"
              style={{ marginLeft: 5, marginRigth: 5 }}
            >
              {user.username}
            </Chip>
          ))}
        </ScrollView>
      </View>
      <Text>{mute ? "TRUE" : "FALSE"}</Text>
      <Text>{JSON.stringify(points)}</Text>
      {
        <ScrollView>
          {arrayCartelle.map((cartella) => StampaCartella(cartella))}
        </ScrollView>
      }
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
  //STAMPO CARTELLA
  function StampaCartella(cartella) {
    return (
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
                      extractedNumbers.includes(elemento) &&
                      !selectedNumbers.includes(elemento)
                    ) {
                      console.log(
                        "S: " + selectedNumbers + " E: " + extractedNumbers
                      );
                      selectedNumbers.push(elemento);
                      setSelectedNumbers(selectedNumbers);
                      checkPoint();
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
    );
  }
  function checkPoint() {
    //CHECK IF THERE IS A POINT
    for (let i = 0; i < numeroCartelle; i++) {
      let countTombola = 0;
      for (let j = 0; j < 3; j++) {
        let riga = arrayCartelle[i].map((colonna) => colonna[j]); // OTTENGO LA RIGA

        let countRiga = 0; //CONTATORE NUMERI USCITI PRESENTI NELLA RIGA DI OGNI TABELLA
        for (let n of selectedNumbers) {
          if (riga.includes(n)) {
            countRiga++;
            countTombola++;
          }
        }
        if (countRiga == 2 && points.ambo == false) {
          console.log("AMBOOO!!!!" + extractedNumbers);
          socket.emit("point", room, "ambo", () => {
            points.ambo = true;
            setPoints(points);
            Alert.alert("HAI FATTO AMBO, BRAVO!");
          });
        }
        if (countRiga == 3 && points.terna == false) {
          console.log("TERNA!!!!" + extractedNumbers);
          socket.emit("point", room, "terna", () => {
            points.terna = true;
            setPoints(points);
            Alert.alert("HAI FATTO TERNA, BRAVO!");
          });
        }

        if (countRiga == 5 && points.cinquina == false) {
          console.log("Cinquina!!!!" + extractedNumbers);
          socket.emit("point", room, "cinquina", () => {
            points.cinquina = true;
            setPoints(points);
            Alert.alert("HAI FATTO CINQUINA, BRAVO!");
          });
        }

        //console.log("extracted : " + extractedNumbers);
        //console.log("COUNT RIGA" + j + " : " + countRiga);
      }
      console.log("COUNT-TOMBOLA: " + countTombola);
      if (countTombola == 15 && points.tombola == false) {
        socket.emit("point", room, "tombola", () => {
          points.tombola = true;
          setPoints(points);
          Alert.alert("HAI FATTO TOMBOLA, BRAVISSIMOOO!");
          Alert.alert("PARTITA FINITA", "Ritorno alla lobby");
          props.navigation.navigate("Lobby", { room, numeroCartelle });
        });
      }
    }
  }
  function changeExtractedNumber(data) {
    console.log(mute);
    extractedNumbers.push(data);
    if (!mute) Speech.speak("ESTRATTO IL NUMERO " + data);

    setExtractedNumbers(extractedNumbers);
    setExtractedNumber(data);
  }
}
