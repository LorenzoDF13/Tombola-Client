import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useRef } from "react";
import { useTheme } from "react-native-paper";
import CartellaCell from "./CartellaCell";

export default function CartellaTabellone({ firstValue, extractedNumbers }) {
  const theme = useTheme();
  const selectedNumbers = useRef([]);
  const index = useRef(firstValue); // NUMERO CHE FINISCE DENTRO CARTELLA CELL
  const cartella = useRef([]);
  console.log(`FIRST VALUE : ${firstValue}`);
  useEffect(() => {
    index.current = firstValue;
  }, []);
  return (
    <View
      style={{
        flexDirection: "column",
        margin: 1,
        marginLeft: 5,
        marginRigth: 5,
        borderWidth: 1,
        borderColor: theme.colors.primaryContainer,
      }}
    >
      {Array.from(Array(3), (_, i) => {
        i > 0 ? (index.current += 5) : "";

        return (
          <View
            key={i - 43282}
            style={{
              flexDirection: "row",
            }}
          >
            {Array.from(Array(5), (_, j) => {
              index.current++;
              cartella.current.push(index.current);
              return (
                <CartellaCell
                  key={(i + 1) * j + 342432}
                  value={index.current}
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
}
