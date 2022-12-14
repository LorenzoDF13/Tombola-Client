import { View, Text, Alert, ScrollView } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";
import Styles from "../styles/TabelloneScreenStyle";
import { Button, useTheme } from "react-native-paper";
import CartellaTabellone from "../components/CartellaTabellone";
import ExtractNumberTabellone from "../components/ExtractNumberTabellone";
import ReactNativeZoomableView from "@openspacelabs/react-native-zoomable-view/src/ReactNativeZoomableView";
import ScegliCartelleTabelloneModal from "../components/ScegliCartelleTabelloneModal";
import Users from "../components/Users";
import Points from "../components/Points";
export default function TabelloneScreen(props) {
  const theme = useTheme();
  const extractedNumbers = useRef([]);
  const [disabled, setDisabled] = useState(false);
  const [sceltaCartelle, setSceltaCartelle] = useState(true); // FA VEDERE IL MODAL O NO
  const [cartelleScelte, setCartelleScelte] = useState([]); //ARRAY DELLE CARTELLE SELEZIONATE
  const [check, setCheck] = useState(false);
  //const cartelleFirstValue = useRef(0); // PRIMO VALONE DELLE CARTELLE
  const [points, setPoints] = useState({
    ambo: false,
    terna: false,
    cinquina: false,
    tombola: false,
  });
  useEffect(() => {
    /*Alert.alert(
      "Info",
      "Puoi utilizzare due dita per muovere e zoomare il tabellone"
    );*/
    socket.on("point", (data, username) => {
      console.log(`${username} ha fatto  ${data}`);

      setPoints((prev) => ({ ...prev, [data]: username }));
      Alert.alert("ATTENZIONE", `${username} ha fatto  ${data}`);
    });
    socket.on("endGame", (message) => {
      setDisabled(true);
      Alert.alert(
        "PARTITA FINITA",
        message + " ritorno alla lobby in 5 secondi"
      );
      setTimeout(() => {
        props.navigation.navigate("Lobby", {
          room,
          numeroCartelle,
          creator: props.route.params.creator,
        });
      }, 5000);
    });
    socket.on("disconnect", () => {
      Alert.alert("ATTENZIONE", "SEI STATO DISCONNESSO");
      props.navigation.navigate("Home");
    });
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
      socket.off("endGame");
      socket.off("point");
    };
  }, []);
  let indexCartella = 0;
  let cartelleFirstValue = 0;
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View
        style={{
          textAlign: "center",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <ExtractNumberTabellone extractedNumbers={extractedNumbers} />
      </View>
      <ScegliCartelleTabelloneModal
        visible={sceltaCartelle}
        setVisible={setSceltaCartelle}
        setCartelleScelte={setCartelleScelte}
        numeroCartelle={props.route.params.numeroCartelle}
      />
      <View>
        <Users users={props.route.params.users} />
      </View>
      <View style={{ height: 35, marginTop: 5 }}>
        <Points points={points} />
      </View>
      <ReactNativeZoomableView>
        <View style={Styles.container}>
          {Array.from(Array(3), (_, i) => {
            if (i > 0) cartelleFirstValue += 25;
            return (
              <View style={{ flexDirection: "row" }} key={(i + 1) * 1234}>
                {Array.from(Array(2), (_, j) => {
                  if (j > 0) cartelleFirstValue += 5;
                  indexCartella++;
                  return (
                    <CartellaTabellone
                      key={(i + 1) * j + 7686}
                      extractedNumbers={extractedNumbers}
                      firstValue={cartelleFirstValue}
                      selected={cartelleScelte.includes(indexCartella)}
                      check={check}
                      points={points}
                      setPoints={setPoints}
                    />
                  );
                })}
              </View>
            );
          })}
        </View>
      </ReactNativeZoomableView>
      <View>
        <Button
          disabled={disabled}
          mode="contained"
          style={{ margin: 15 }}
          onPress={() => {
            setCheck(!check);
          }}
        >
          {"Proponi " + getKeyByValue(points, false)}
        </Button>
      </View>
    </View>
  );

  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
}
